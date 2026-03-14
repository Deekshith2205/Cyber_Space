import os
import requests
from dotenv import load_dotenv

def check_url_safety(url: str):
    """
    Checks the URL against the Google Safe Browsing API.
    Returns a dictionary with status and threat_type (if malicious).
    """
    load_dotenv() # Ensure we have the latest environment variables
    
    API_KEY = os.getenv("GOOGLE_SAFE_BROWSING_KEY")
    SAFE_BROWSING_URL = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={API_KEY}"

    if not API_KEY:
        print("Error: GOOGLE_SAFE_BROWSING_KEY is not set.")
        return {"status": "Error", "message": "Google Safe Browsing API key not configured"}

    payload = {
        "client": {
            "clientId": "cyberspace",
            "clientVersion": "1.0.0"
        },
        "threatInfo": {
            "threatTypes": [
                "MALWARE", 
                "SOCIAL_ENGINEERING", 
                "UNWANTED_SOFTWARE", 
                "POTENTIALLY_HARMFUL_APPLICATION"
            ],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [
                {"url": url}
            ]
        }
    }

    try:
        response = requests.post(SAFE_BROWSING_URL, json=payload)
        response.raise_for_status()
        data = response.json()

        # If there are matches, it's considered malicious
        if "matches" in data and len(data["matches"]) > 0:
            match = data["matches"][0] # getting the first match
            return {
                "status": "Malicious",
                "threat_type": match.get("threatType", "UNKNOWN_THREAT")
            }
        else:
            return {
                "status": "Safe"
            }

    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error calling Google Safe Browsing API: {e}")
        if e.response is not None:
             print(f"Response text: {e.response.text}")
        return {"status": "Error", "message": "Failed to connect to threat database"}
    except requests.exceptions.RequestException as e:
        print(f"Request Error calling Google Safe Browsing API: {e}")
        return {"status": "Error", "message": "Failed to connect to threat database"}
