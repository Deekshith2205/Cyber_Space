import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "http://localhost:8000/api/phishing-check"
tests = [
    "youtube-login-verification.net", # High Risk test case / Malicious 
    "hgddce.com",                     # Invalid Domain 
    "https://google.com",             # Low risk / Safe
    "this is not a url"               # Invalid URL
]

print("Starting Phase 3 Advanced checks...\n")

for test_url in tests:
    print(f"Testing: {test_url}")
    data = json.dumps({"url": test_url}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})

    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            result = response.read().decode('utf-8')
            parsed = json.loads(result)
            print(json.dumps(parsed, indent=2))
            print("-" * 50)
    except Exception as e:
        print(f"Error: {e}\n")
