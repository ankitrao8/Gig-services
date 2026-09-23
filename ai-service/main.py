"""
Sahakar Seva - Python AI/ML & Digital Certificate Microservice
Framework: FastAPI
Features:
1. Demand Forecasting (Scikit-learn Polynomial Ridge Regression)
2. Rating Fraud & Collusion Detection (Scikit-learn IsolationForest)
3. Cryptographic Signed QR Tokens (HMAC-SHA256 + QRCode)
4. Automated Skill Certificate PDF Generation (ReportLab)
"""

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from ml.demand_forecaster import DemandForecaster
from ml.anomaly_detector import RatingAnomalyDetector
from certificates.qr_signer import QrSigner
from certificates.pdf_generator import CertificatePdfGenerator

app = FastAPI(
    title="Sahakar Seva AI/ML & Credential Service",
    description="Python microservice for demand forecasting, fraud prevention, signed QR tokens, and auto-PDF certificates.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML engines
forecaster = DemandForecaster()
anomaly_detector = RatingAnomalyDetector()

# ================= Request / Response Models =================

class ForecastRequest(BaseModel):
    trade: str = Field(default="Electrician", description="Service category/trade")
    ward: str = Field(default="Ward 2 (Sigra)", description="Urban ward / district")
    historical_days: Optional[int] = Field(default=30, ge=7, le=90)
    forecast_horizon_days: Optional[int] = Field(default=7, ge=1, le=14)

class AnomalyCheckRequest(BaseModel):
    worker_id: str
    customer_id: str
    rating: int = Field(ge=1, le=5)
    review_text: str = ""
    job_duration_minutes: float = Field(default=45.0, ge=1.0)
    prior_reviews_between_pair: int = Field(default=0, ge=0)
    worker_average_rating: float = Field(default=4.8, ge=1.0, le=5.0)
    hours_since_booking_completed: float = Field(default=2.5, ge=0.0)

class QrSignRequest(BaseModel):
    worker_id: str
    society_id: str
    skill_level: str
    issue_date: str

class CertificatePdfRequest(BaseModel):
    worker_name: str
    worker_id: str
    trade: str
    skill_level: str
    skill_score: float
    society_name: str
    certificate_number: str
    issue_date: str
    verification_token: str

# ================= API Endpoints =================

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "sahakar-seva-ai-service",
        "ml_engines": ["scikit-learn-ridge-forecaster", "scikit-learn-isolation-forest"],
        "cert_engines": ["qrcode", "reportlab-pdf"]
    }

@app.post("/api/ml/forecast")
def get_demand_forecast(req: ForecastRequest):
    """Generates 7-day demand forecasts and cooperative workforce rebalancing recommendations."""
    try:
        result = forecaster.train_and_forecast(
            historical_days=req.historical_days,
            forecast_horizon_days=req.forecast_horizon_days,
            selected_trade=req.trade,
            selected_ward=req.ward
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecasting error: {str(e)}")

@app.post("/api/ml/anomaly-check")
def check_rating_anomaly(req: AnomalyCheckRequest):
    """Evaluates a review submission through IsolationForest and velocity heuristics."""
    try:
        result = anomaly_detector.evaluate_review(
            worker_id=req.worker_id,
            customer_id=req.customer_id,
            rating=req.rating,
            review_text=req.review_text,
            job_duration_minutes=req.job_duration_minutes,
            prior_reviews_between_pair=req.prior_reviews_between_pair,
            worker_average_rating=req.worker_average_rating,
            hours_since_booking_completed=req.hours_since_booking_completed
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Anomaly evaluation error: {str(e)}")

@app.post("/api/certificates/sign-qr")
def sign_qr_token(req: QrSignRequest):
    """Signs digital worker credentials and returns HMAC token + Base64 QR code."""
    try:
        token = QrSigner.generate_signed_token(
            worker_id=req.worker_id,
            society_id=req.society_id,
            skill_level=req.skill_level,
            issue_date=req.issue_date
        )
        qr_base64 = QrSigner.generate_qr_base64(f"https://sahakarseva.gov.in/verify-worker/{token}")
        return {
            "worker_id": req.worker_id,
            "signed_verification_token": token,
            "qr_image_base64": qr_base64,
            "verification_endpoint": f"/verify-worker/{token}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QR signing error: {str(e)}")

@app.post("/api/certificates/generate-pdf")
def generate_certificate_pdf(req: CertificatePdfRequest):
    """Generates official Cooperative Skill Recognition PDF document."""
    try:
        pdf_bytes = CertificatePdfGenerator.generate_certificate_pdf(
            worker_name=req.worker_name,
            worker_id=req.worker_id,
            trade=req.trade,
            skill_level=req.skill_level,
            skill_score=req.skill_score,
            society_name=req.society_name,
            certificate_number=req.certificate_number,
            issue_date=req.issue_date,
            verification_token=req.verification_token
        )
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=Certificate_{req.certificate_number}.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
