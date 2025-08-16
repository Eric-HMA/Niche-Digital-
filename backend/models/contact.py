from pydantic import BaseModel, Field, EmailStr, validator
from datetime import datetime
from typing import Optional
import uuid

class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field(..., min_length=2, max_length=100)
    business_name: Optional[str] = Field(None, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    service: Optional[str] = Field(None)
    message: Optional[str] = Field(None, max_length=2000)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    status: str = Field(default="new")  # new, contacted, closed
    spam_score: float = Field(default=0.0)
    recaptcha_score: Optional[float] = None

    @validator('service')
    def validate_service(cls, v):
        if v is not None:
            allowed_services = [
                'Facebook & Instagram Marketing',
                'TikTok Marketing', 
                'Google & Google Maps Marketing',
                'Website Creation',
                'Full Package (All Services)',
                'Consultation Only',
                'Other'
            ]
            if v not in allowed_services:
                return 'Other'
        return v

    @validator('phone')
    def validate_phone(cls, v):
        if v is not None:
            # Remove non-numeric characters for validation
            phone_clean = ''.join(filter(str.isdigit, v))
            if len(phone_clean) < 8 or len(phone_clean) > 15:
                raise ValueError('Phone number must be between 8-15 digits')
        return v

    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        return v.strip().title()

    class Config:
        schema_extra = {
            "example": {
                "name": "John Doe",
                "business_name": "ABC Company",
                "email": "john@example.com",
                "phone": "+66 XX XXX XXXX",
                "service": "Facebook & Instagram Marketing",
                "message": "I'm interested in growing my business through social media marketing."
            }
        }

class ContactSubmissionCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    business_name: Optional[str] = Field(None, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    service: Optional[str] = Field(None)
    message: Optional[str] = Field(None, max_length=2000)
    recaptcha_token: Optional[str] = Field(None)

    @validator('service')
    def validate_service(cls, v):
        if v is not None:
            allowed_services = [
                'Facebook & Instagram Marketing',
                'TikTok Marketing',
                'Google & Google Maps Marketing', 
                'Website Creation',
                'Full Package (All Services)',
                'Consultation Only',
                'Other'
            ]
            if v not in allowed_services:
                return 'Other'
        return v

class ContactSubmissionResponse(BaseModel):
    success: bool
    message: str
    submission_id: Optional[str] = None

class ContactSubmissionList(BaseModel):
    submissions: list[ContactSubmission]
    total: int
    page: int
    limit: int
    total_pages: int