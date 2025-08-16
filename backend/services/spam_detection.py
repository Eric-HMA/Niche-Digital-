import re
import logging
from typing import Dict, Tuple
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class SpamDetectionService:
    def __init__(self):
        # Common spam keywords and patterns
        self.spam_keywords = [
            'bitcoin', 'cryptocurrency', 'forex', 'loan', 'credit', 'casino',
            'viagra', 'cialis', 'pharmacy', 'weight loss', 'make money',
            'work from home', 'mlm', 'pyramid', 'investment opportunity',
            'guaranteed income', 'free money', 'click here', 'limited time',
            'act now', 'congratulations you won', 'nigerian prince'
        ]
        
        # Suspicious patterns
        self.suspicious_patterns = [
            r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+',  # URLs
            r'[A-Z]{5,}',  # All caps words
            r'[!]{3,}',    # Multiple exclamation marks
            r'[$£€¥₹]{2,}', # Multiple currency symbols
            r'\b\d{3}-\d{3}-\d{4}\b',  # Phone number patterns in message
        ]
        
        # Email domain blacklist (common spam domains)
        self.blacklisted_domains = [
            'tempmail.org', '10minutemail.com', 'guerrillamail.com',
            'mailinator.com', 'throwaway.email', 'temp-mail.org'
        ]
        
        # Rate limiting storage (in production, use Redis)
        self.submission_history = {}
    
    def calculate_spam_score(self, submission_data: Dict) -> Tuple[float, list]:
        """
        Calculate spam score for a submission
        Returns: (spam_score, reasons)
        Score: 0.0 = not spam, 1.0 = definitely spam
        """
        score = 0.0
        reasons = []
        
        # Check email domain
        email = submission_data.get('email', '').lower()
        email_domain = email.split('@')[-1] if '@' in email else ''
        
        if email_domain in self.blacklisted_domains:
            score += 0.8
            reasons.append(f"Suspicious email domain: {email_domain}")
        
        # Check for spam keywords in message and name
        message = submission_data.get('message', '').lower()
        name = submission_data.get('name', '').lower()
        combined_text = f"{message} {name}".lower()
        
        spam_word_count = 0
        for keyword in self.spam_keywords:
            if keyword in combined_text:
                spam_word_count += 1
                reasons.append(f"Contains spam keyword: {keyword}")
        
        # Add score based on spam keywords
        if spam_word_count > 0:
            score += min(spam_word_count * 0.2, 0.6)
        
        # Check for suspicious patterns
        pattern_count = 0
        for pattern in self.suspicious_patterns:
            if re.search(pattern, combined_text, re.IGNORECASE):
                pattern_count += 1
                reasons.append(f"Suspicious pattern detected")
        
        if pattern_count > 0:
            score += min(pattern_count * 0.15, 0.4)
        
        # Check for very short or very long messages
        message_length = len(message.strip())
        if message_length > 0:
            if message_length < 10:
                score += 0.1
                reasons.append("Message too short")
            elif message_length > 1500:
                score += 0.2
                reasons.append("Message too long")
        
        # Check name validity
        name_clean = submission_data.get('name', '').strip()
        if len(name_clean) < 2:
            score += 0.3
            reasons.append("Invalid name length")
        elif name_clean.lower() in ['test', 'admin', 'user', 'name', 'asdf', 'qwerty']:
            score += 0.4
            reasons.append("Suspicious name")
        
        # Check for repeated characters in name
        if re.search(r'(.)\1{4,}', name_clean):
            score += 0.3
            reasons.append("Repeated characters in name")
        
        # Business name checks
        business_name = submission_data.get('business_name', '').lower()
        if business_name and business_name in ['test company', 'abc company', 'test', 'company']:
            score += 0.2
            reasons.append("Generic business name")
        
        # Ensure score doesn't exceed 1.0
        score = min(score, 1.0)
        
        logger.info(f"Spam score calculated: {score:.2f} for {email}")
        if reasons:
            logger.info(f"Spam reasons: {', '.join(reasons)}")
        
        return score, reasons
    
    def check_rate_limit(self, ip_address: str, email: str) -> Tuple[bool, str]:
        """
        Check if IP or email has exceeded rate limits
        Returns: (is_allowed, reason)
        """
        now = datetime.utcnow()
        cutoff_time = now - timedelta(hours=1)  # 1 hour window
        
        # Clean old entries
        self._clean_old_entries(cutoff_time)
        
        # Check IP rate limit (max 3 per hour)
        ip_submissions = self.submission_history.get(f"ip_{ip_address}", [])
        recent_ip_submissions = [ts for ts in ip_submissions if ts > cutoff_time]
        
        if len(recent_ip_submissions) >= 3:
            return False, f"Too many submissions from IP {ip_address}"
        
        # Check email rate limit (max 2 per hour)
        email_submissions = self.submission_history.get(f"email_{email}", [])
        recent_email_submissions = [ts for ts in email_submissions if ts > cutoff_time]
        
        if len(recent_email_submissions) >= 2:
            return False, f"Too many submissions from email {email}"
        
        # Record this submission
        if f"ip_{ip_address}" not in self.submission_history:
            self.submission_history[f"ip_{ip_address}"] = []
        self.submission_history[f"ip_{ip_address}"].append(now)
        
        if f"email_{email}" not in self.submission_history:
            self.submission_history[f"email_{email}"] = []
        self.submission_history[f"email_{email}"].append(now)
        
        return True, "Rate limit OK"
    
    def _clean_old_entries(self, cutoff_time: datetime):
        """Remove old entries from rate limiting storage"""
        for key in list(self.submission_history.keys()):
            self.submission_history[key] = [
                ts for ts in self.submission_history[key] 
                if ts > cutoff_time
            ]
            if not self.submission_history[key]:
                del self.submission_history[key]
    
    def is_likely_spam(self, spam_score: float, recaptcha_score: float = None) -> bool:
        """
        Determine if submission is likely spam based on multiple factors
        """
        # High spam score threshold
        if spam_score >= 0.7:
            return True
        
        # Combined scoring with reCAPTCHA
        if recaptcha_score is not None:
            combined_risk = spam_score + (1.0 - recaptcha_score)
            if combined_risk >= 1.2:
                return True
        
        return False

# Initialize spam detection service
spam_detector = SpamDetectionService()