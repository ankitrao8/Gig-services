"""
Cryptographic QR Token Signer & Generator.
Uses HMAC-SHA256 to generate tamper-proof verification tokens and encodes them as QR images.
"""

import hmac
import hashlib
import base64
import io
import json
import qrcode
from typing import Dict, Any

SECRET_KEY = "SAHAKAR_SEVA_FEDERATION_SECRET_SALT_2026"

class QrSigner:
    """Signs digital identity credentials for cooperative gig workers."""

    @staticmethod
    def generate_signed_token(worker_id: str, society_id: str, skill_level: str, issue_date: str) -> str:
        """Create a tamper-proof signed payload string."""
        payload = f"{worker_id}:{society_id}:{skill_level}:{issue_date}"
        signature = hmac.new(
            SECRET_KEY.encode("utf-8"),
            payload.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()[:16].upper()
        # Format: SKR-VERIFIED-<WORKER_ID>-<SIGNATURE>
        return f"SKR-VERIFIED-{worker_id}-{signature}"

    @staticmethod
    def verify_token(worker_id: str, society_id: str, skill_level: str, issue_date: str, token: str) -> bool:
        """Verifies if the token matches the expected HMAC signature."""
        expected = QrSigner.generate_signed_token(worker_id, society_id, skill_level, issue_date)
        return hmac.compare_digest(token, expected)

    @staticmethod
    def generate_qr_base64(data: str) -> str:
        """Generates a base64 encoded PNG QR code."""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=8,
            border=2,
        )
        qr.add_data(data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="#0F172A", back_color="#FFFFFF")
        buffer = io.BytesIO()
        img.save(buffer)
        encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{encoded}"
