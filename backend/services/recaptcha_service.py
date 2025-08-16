import os
import requests
import logging
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

class RecaptchaService:
    def __init__(self):
        self.secret_key = os.environ.get('RECAPTCHA_SECRET_KEY')
        self.verify_url = 'https://www.google.com/recaptcha/api/siteverify'
        self.min_score = 0.5  # Minimum score for reCAPTCHA v3 (0.0 = bot, 1.0 = human)
    
    async def verify_recaptcha(self, token: str, ip_address: Optional[str] = None) -> Tuple[bool, float]:
        """
        Verify reCAPTCHA v3 token
        Returns: (is_valid, score)
        """
        if not self.secret_key or not token:
            logger.warning("reCAPTCHA verification skipped - missing secret key or token")
            return True, 1.0  # Allow if not configured (development mode)
        
        try:
            payload = {
                'secret': self.secret_key,
                'response': token
            }
            
            if ip_address:
                payload['remoteip'] = ip_address
            
            response = requests.post(self.verify_url, data=payload, timeout=10)
            result = response.json()
            
            if result.get('success'):
                score = result.get('score', 0.0)
                is_valid = score >= self.min_score
                
                logger.info(f"reCAPTCHA verification: score={score}, valid={is_valid}")
                return is_valid, score
            else:
                error_codes = result.get('error-codes', [])
                logger.error(f"reCAPTCHA verification failed: {error_codes}")
                return False, 0.0
                
        except requests.RequestException as e:
            logger.error(f"reCAPTCHA verification request failed: {str(e)}")
            return False, 0.0
        except Exception as e:
            logger.error(f"reCAPTCHA verification error: {str(e)}")
            return False, 0.0
    
    def is_configured(self) -> bool:
        """Check if reCAPTCHA is properly configured"""
        return bool(self.secret_key and self.secret_key != 'your-secret-key-here')

# Initialize recaptcha service
recaptcha_service = RecaptchaService()