"""
End-to-End Validation Script for Sahakar Seva Python AI/ML Microservice
Tests:
1. Scikit-learn Polynomial Ridge Demand Forecaster
2. Scikit-learn IsolationForest Rating Anomaly & Velocity Detector
3. Cryptographic Signed QR Token Generation
4. ReportLab PDF Skill Milestone Certificate Generation
"""

import os
from ml.demand_forecaster import DemandForecaster
from ml.anomaly_detector import RatingAnomalyDetector
from certificates.qr_signer import QrSigner
from certificates.pdf_generator import CertificatePdfGenerator

def test_ai_pipeline():
    print("==================================================")
    print("Testing Sahakar Seva AI/ML & Digital Credential Engine")
    print("==================================================")

    # 1. Test Demand Forecaster
    print("\n[1/4] Testing Scikit-learn Demand Forecaster...")
    forecaster = DemandForecaster()
    forecast = forecaster.train_and_forecast(
        historical_days=30,
        forecast_horizon_days=7,
        selected_trade="Electrician",
        selected_ward="Ward 2 (Sigra)"
    )
    print(f"  Trade: {forecast['trade']} | Ward: {forecast['ward']}")
    print(f"  Projected Mean Daily Orders: {forecast['projected_mean_daily_orders']}")
    print(f"  Growth: {forecast['expected_growth_percentage']}%")
    print(f"  Zonal Alert: {forecast['zonal_allocation_alert']['status']}")
    print(f"  Rebalance Action: {forecast['zonal_allocation_alert']['rebalance_action'][:80]}...")
    assert len(forecast["forecast_timeline"]) == 7
    print("  -> Forecaster Test PASSED!")

    # 2. Test Anomaly Detector
    print("\n[2/4] Testing Scikit-learn IsolationForest Review Anomaly Detector...")
    detector = RatingAnomalyDetector()
    
    # Normal review
    normal_res = detector.evaluate_review(
        worker_id="SKR-EL-10291",
        customer_id="USR-CUST-8812",
        rating=5,
        review_text="Excellent repair work on switchboard. Very polite and prompt.",
        job_duration_minutes=60.0,
        prior_reviews_between_pair=0,
        worker_average_rating=4.9,
        hours_since_booking_completed=3.0
    )
    print(f"  Normal Review: Anomaly={normal_res['is_anomaly']} | Risk={normal_res['risk_level']} | Action={normal_res['action_taken']}")
    assert normal_res['is_anomaly'] is False

    # Suspicious / Fraudulent review (collusion + instant duration + velocity burst)
    fraud_res = detector.evaluate_review(
        worker_id="SKR-EL-10291",
        customer_id="USR-FAKE-9999",
        rating=5,
        review_text="Best worker ever 5 stars fast fast",
        job_duration_minutes=3.0,
        prior_reviews_between_pair=5,
        worker_average_rating=4.9,
        hours_since_booking_completed=0.01
    )
    print(f"  Fraud Review: Anomaly={fraud_res['is_anomaly']} | Risk={fraud_res['risk_level']} | Reasons={fraud_res['reasons']}")
    assert fraud_res['is_anomaly'] is True
    print("  -> Anomaly Detector Test PASSED!")

    # 3. Test QR Signer
    print("\n[3/4] Testing HMAC-SHA256 Signed QR Token...")
    token = QrSigner.generate_signed_token(
        worker_id="SKR-EL-10291",
        society_id="SOC-VNS-001",
        skill_level="MASTER",
        issue_date="2026-09-23"
    )
    print(f"  Signed Token: {token}")
    is_valid = QrSigner.verify_token(
        worker_id="SKR-EL-10291",
        society_id="SOC-VNS-001",
        skill_level="MASTER",
        issue_date="2026-09-23",
        token=token
    )
    assert is_valid is True
    qr_b64 = QrSigner.generate_qr_base64(f"https://sahakarseva.gov.in/verify-worker/{token}")
    assert qr_b64.startswith("data:image/png;base64,")
    print("  -> QR Signer Test PASSED!")

    # 4. Test ReportLab PDF Generator
    print("\n[4/4] Testing ReportLab PDF Skill Milestone Certificate...")
    pdf_bytes = CertificatePdfGenerator.generate_certificate_pdf(
        worker_name="Ramesh Kumar",
        worker_id="SKR-EL-10291",
        trade="Electrician",
        skill_level="MASTER",
        skill_score=94.5,
        society_name="Kashi Shramik Sahakari Samiti",
        certificate_number="CERT-SKR-2026-0042",
        issue_date="2026-09-23",
        verification_token=token
    )
    print(f"  Generated PDF Size: {len(pdf_bytes)} bytes")
    assert len(pdf_bytes) > 1000

    out_pdf = "sample_verified_certificate.pdf"
    with open(out_pdf, "wb") as f:
        f.write(pdf_bytes)
    print(f"  Saved sample PDF to {out_pdf}")
    print("  -> ReportLab PDF Generator Test PASSED!")

    print("\n==================================================")
    print("ALL AI/ML & CREDENTIAL PIPELINE TESTS COMPLETED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    test_ai_pipeline()
