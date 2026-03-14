from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from phishing_checker import check_url_safety
from threat_scoring import analyze_domain, calculate_risk_score

app = FastAPI()

# Configure CORS so Next.js frontend can call it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    url: str

@app.post("/api/phishing-check")
async def phishing_check(request: URLRequest):
    # 1. Analyze the domain heuristically (Stages 1-6)
    domain_analysis = analyze_domain(request.url)
    
    # Catch early exits (Stage 1 and 2)
    if domain_analysis.get("status") in ["INVALID URL", "INVALID DOMAIN"]:
        return calculate_risk_score({}, domain_analysis)
        
    # 2. Ask Google Safe Browsing (Only if valid domain)
    google_result = check_url_safety(request.url)
    
    if google_result.get("status") == "Error":
        raise HTTPException(status_code=500, detail=google_result.get("message"))
    
    # 3. Calculate final Risk Score (Stage 7)
    final_assessment = calculate_risk_score(google_result, domain_analysis)
        
    response = {
        "url": request.url,
        "risk_score": final_assessment["risk_score"],
        "status": final_assessment["status"],
        "checks": final_assessment["checks"]
    }
    
    # Add reasons if any exist
    if final_assessment.get("reason"):
        response["reason"] = final_assessment["reason"]
        
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
