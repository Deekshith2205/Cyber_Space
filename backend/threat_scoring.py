import urllib.parse
import re
import socket
import ssl
import whois
import dns.resolver
from datetime import datetime
from typing import Dict, Any

SUSPICIOUS_KEYWORDS = [
    "login", "verify", "update", "account", "secure", "password", "auth", "confirm", "billing", "support"
]

BRAND_IMPERSONATION = [
    "google", "youtube", "paypal", "amazon", "bank", "instagram", "microsoft", "apple", "netflix", "facebook"
]

RISKY_TLDS = [".top", ".xyz", ".tk", ".ml", ".cf", ".gq", ".ga"]

def validate_url_format(url: str) -> bool:
    """Stage 1: Check if URL format is strictly valid (http/https and structure)."""
    # Strict regex expecting http:// or https:// and a valid domain part
    pattern = re.compile(
        r'^(https?://)'  # http:// or https://
        r'(([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}|'  # domain...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
        r'(:\d+)?(/.*)?$', re.IGNORECASE)
    return bool(pattern.match(url))

def check_dns_resolution(domain: str) -> bool:
    """Stage 2: Check if domain resolves to an IP address."""
    try:
        # Try finding A records
        dns.resolver.resolve(domain, 'A')
        return True
    except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer, dns.resolver.Timeout, dns.exception.DNSException):
        return False

def check_domain_age(domain: str) -> int:
    """Stage 5: Returns domain age in days. Returns -1 if lookup fails."""
    try:
        w = whois.whois(domain)
        creation_date = w.creation_date
        
        # Handle cases where creation_date is a list of dates
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
            
        if creation_date:
            age = (datetime.now() - creation_date).days
            return max(age, 0)
        return -1
    except Exception:
        return -1

def check_ssl_certificate(domain: str) -> bool:
    """Stage 6: Checks if the domain has a valid SSL certificate."""
    try:
        context = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=3) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                return True # Handshake successful
    except Exception:
        return False

def analyze_domain(url: str) -> Dict[str, Any]:
    """
    Analyzes a URL traversing through multiple heuristic and active checks.
    """
    if not validate_url_format(url):
        return {"status": "INVALID URL"}

    parsed_url = urllib.parse.urlparse(url)
    domain = parsed_url.netloc.lower()
    full_url = url.lower()

    # Stage 2: DNS Resolution
    if not check_dns_resolution(domain):
        return {"status": "INVALID DOMAIN", "reason": "DNS lookup failed"}

    # Subdomain logic
    parts = domain.split('.')
    is_ip = bool(re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$', domain))

    # Stage 4: Domain Structure Analysis
    heuristic_checks = {
        "is_https": parsed_url.scheme == "https",
        "has_ip_domain": is_ip,
        "high_subdomain_count": len(parts) > 3, # number of dots > 3 translates to > 3 parts (excluding root)
        "has_suspicious_keywords": any(keyword in full_url for keyword in SUSPICIOUS_KEYWORDS),
        "has_brand_impersonation": any(brand in domain for brand in BRAND_IMPERSONATION) and domain not in [f"{b}.com" for b in BRAND_IMPERSONATION], # naive check
        "is_abnormally_long": len(domain) > 25,
        "excessive_hyphens": domain.count('-') > 2,
        "has_risky_tld": any(domain.endswith(tld) for tld in RISKY_TLDS)
    }

    # Stage 5: Domain Age Check
    domain_age_days = check_domain_age(domain) if not is_ip else -1
    heuristic_checks["is_young_domain"] = 0 <= domain_age_days < 30
    heuristic_checks["domain_age_days"] = domain_age_days

    # Stage 6: SSL Certificate Check
    heuristic_checks["has_valid_ssl"] = check_ssl_certificate(domain)

    return {
        "status": "VALID",
        "heuristics": heuristic_checks
    }

def calculate_risk_score(google_api_result: Dict[str, Any], domain_analysis: Dict[str, Any]) -> Dict[str, Any]:
    """
    Stage 7: Calculates the final risk score based on Google API + heuristic penalties.
    """
    # Handle early exits (Invalid URLs or DNS Failures)
    if domain_analysis.get("status") in ["INVALID URL", "INVALID DOMAIN"]:
        return {
            "risk_score": 0,
            "status": domain_analysis["status"],
            "reason": domain_analysis.get("reason", "Malformed URL structure"),
            "checks": {}
        }
        
    heuristics = domain_analysis["heuristics"]
    score = 0
    reasons = []
    
    # 1. Google Safe Browsing Check (Trigger automatic Malicious if flagged)
    is_google_malicious = google_api_result.get("status") == "Malicious"
    if is_google_malicious:
        score += 90
        threat = google_api_result.get("threat_type", "Malicious Link")
        reasons.append(f"Google Safe Browsing flagged as: {threat}")

    # 2. Brand Impersonation Penalty (+30)
    if heuristics["has_brand_impersonation"]:
        score += 30
        reasons.append("Brand impersonation detected")

    # 3. Suspicious Keywords Penalty (+20)
    if heuristics["has_suspicious_keywords"]:
        score += 20
        reasons.append("Suspicious keywords detected")
        
    # 4. Young Domain / Domain Age Penalty (+25)
    if heuristics["is_young_domain"]:
        score += 25
        reasons.append("Domain age is less than 30 days")
        
    # 5. Missing SSL Penalty (+15)
    if not heuristics["has_valid_ssl"]:
        score += 15
        reasons.append("Missing or invalid SSL certificate")

    # 6. Suspicious Domain Structure Penalties
    if heuristics["excessive_hyphens"]:
        score += 10
        reasons.append("Hyphenated domain structure")
    if heuristics["is_abnormally_long"]:
        score += 10
        reasons.append("Domain name is unusually long")
    if heuristics["high_subdomain_count"]:
        score += 10
        reasons.append("Excessive subdomains detected")
    if heuristics["has_risky_tld"]:
        score += 15
        reasons.append("Suspicious Top-Level Domain (TLD)")
    if heuristics["has_ip_domain"]:
        score += 20
        reasons.append("IP address used instead of domain name")

    # Cap score at 100
    score = min(score, 100)
    
    # Determine final status classification
    if score <= 20:
        status = "Safe"
    elif score <= 50:
        status = "Suspicious"
    elif score <= 80:
        status = "High Risk"
    else:
        status = "Malicious"
        
    # Build robust checklist for the frontend gauge
    checks = {
        "google_safe_browsing": not is_google_malicious, 
        "https_secure": heuristics["has_valid_ssl"], # Updated from simple scheme check to active SSL port check
        "suspicious_keywords": heuristics["has_suspicious_keywords"],
        "suspicious_tld": heuristics["has_risky_tld"],
        "dns_resolved": True,
        "domain_age_days": heuristics["domain_age_days"]
    }
        
    return {
        "risk_score": score,
        "status": status,
        "reason": reasons,  # List of triggered penalties
        "checks": checks
    }
