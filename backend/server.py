from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, Query
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
import secrets
import io
import csv
from datetime import datetime, timedelta
from typing import Optional, List

# Import our models and services
from models.contact import ContactSubmission, ContactSubmissionCreate, ContactSubmissionResponse, ContactSubmissionList
from services.email_service import email_service
from services.recaptcha_service import recaptcha_service
from services.spam_detection import spam_detector

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="NICHE Digital Marketing API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security for admin endpoints
security = HTTPBasic()

def get_admin_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    """Verify admin credentials"""
    correct_username = secrets.compare_digest(credentials.username, os.environ.get('ADMIN_USERNAME', 'admin'))
    correct_password = secrets.compare_digest(credentials.password, os.environ.get('ADMIN_PASSWORD', 'change-this-secure-password'))
    
    if not (correct_username and correct_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return credentials.username

# Utility function to get client IP
def get_client_ip(request: Request) -> str:
    """Get client IP address from request"""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"

# Original endpoints
@api_router.get("/")
async def root():
    return {"message": "NICHE Digital Marketing API - Ready to grow your business!"}

# Contact form submission endpoint
@api_router.post("/contact", response_model=ContactSubmissionResponse)
async def submit_contact_form(
    submission: ContactSubmissionCreate,
    request: Request
):
    """
    Submit contact form with spam protection and email notifications
    """
    try:
        # Get client information
        ip_address = get_client_ip(request)
        user_agent = request.headers.get("User-Agent", "")
        
        # Rate limiting check
        rate_limit_ok, rate_limit_reason = spam_detector.check_rate_limit(ip_address, submission.email)
        if not rate_limit_ok:
            logger.warning(f"Rate limit exceeded: {rate_limit_reason}")
            raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
        
        # Verify reCAPTCHA if token provided
        recaptcha_score = None
        if submission.recaptcha_token:
            is_valid, recaptcha_score = await recaptcha_service.verify_recaptcha(
                submission.recaptcha_token, ip_address
            )
            if not is_valid:
                logger.warning(f"reCAPTCHA verification failed for {submission.email}")
                raise HTTPException(status_code=400, detail="reCAPTCHA verification failed. Please try again.")
        
        # Calculate spam score
        submission_dict = submission.dict()
        spam_score, spam_reasons = spam_detector.calculate_spam_score(submission_dict)
        
        # Check if likely spam
        if spam_detector.is_likely_spam(spam_score, recaptcha_score):
            logger.warning(f"Submission blocked as spam: {submission.email}, score: {spam_score}")
            # Don't tell spammers they were blocked - return success but don't process
            return ContactSubmissionResponse(
                success=True,
                message="Thank you! We'll get back to you within 24 hours."
            )
        
        # Create contact submission record
        contact_data = ContactSubmission(
            **submission_dict,
            ip_address=ip_address,
            user_agent=user_agent,
            spam_score=spam_score,
            recaptcha_score=recaptcha_score
        )
        
        # Save to database
        result = await db.contact_submissions.insert_one(contact_data.dict())
        contact_data.id = str(result.inserted_id)
        
        # Send notification emails (in background)
        submission_data_for_email = contact_data.dict()
        
        # Send business notification
        business_email_sent = email_service.send_notification_to_business(submission_data_for_email)
        if not business_email_sent:
            logger.error(f"Failed to send business notification for submission {contact_data.id}")
        
        # Send client confirmation
        client_email_sent = email_service.send_confirmation_to_client(submission_data_for_email)
        if not client_email_sent:
            logger.error(f"Failed to send client confirmation for submission {contact_data.id}")
        
        logger.info(f"Contact submission processed successfully: {contact_data.id}")
        
        return ContactSubmissionResponse(
            success=True,
            message="Thank you! We'll get back to you within 24 hours.",
            submission_id=contact_data.id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing contact submission: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your request. Please try again.")

# Admin endpoints for managing submissions
@api_router.get("/admin/submissions", response_model=ContactSubmissionList)
async def get_contact_submissions(
    admin: str = Depends(get_admin_credentials),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    """
    Get contact submissions with pagination and filtering (Admin only)
    """
    skip = (page - 1) * limit
    
    # Build query filter
    query_filter = {}
    if status:
        query_filter["status"] = status
    if search:
        query_filter["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"business_name": {"$regex": search, "$options": "i"}},
            {"message": {"$regex": search, "$options": "i"}}
        ]
    
    # Get total count
    total = await db.contact_submissions.count_documents(query_filter)
    
    # Get submissions
    cursor = db.contact_submissions.find(query_filter).sort("created_at", -1).skip(skip).limit(limit)
    submissions = []
    
    async for submission in cursor:
        submission["_id"] = str(submission["_id"])
        submissions.append(ContactSubmission(**submission))
    
    total_pages = (total + limit - 1) // limit
    
    return ContactSubmissionList(
        submissions=submissions,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )

@api_router.put("/admin/submissions/{submission_id}/status")
async def update_submission_status(
    submission_id: str,
    status: str,
    admin: str = Depends(get_admin_credentials)
):
    """
    Update submission status (Admin only)
    """
    if status not in ["new", "contacted", "closed"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    result = await db.contact_submissions.update_one(
        {"id": submission_id},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return {"message": "Status updated successfully"}

@api_router.get("/admin/submissions/export")
async def export_submissions_csv(
    admin: str = Depends(get_admin_credentials),
    days: int = Query(30, ge=1, le=365)
):
    """
    Export contact submissions as CSV (Admin only)
    """
    # Get submissions from last N days
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    cursor = db.contact_submissions.find(
        {"created_at": {"$gte": cutoff_date}}
    ).sort("created_at", -1)
    
    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        'Date', 'Name', 'Business Name', 'Email', 'Phone', 
        'Service', 'Message', 'Status', 'Spam Score', 'reCAPTCHA Score'
    ])
    
    # Write data
    async for submission in cursor:
        writer.writerow([
            submission.get('created_at', '').strftime('%Y-%m-%d %H:%M:%S') if submission.get('created_at') else '',
            submission.get('name', ''),
            submission.get('business_name', ''),
            submission.get('email', ''),
            submission.get('phone', ''),
            submission.get('service', ''),
            submission.get('message', ''),
            submission.get('status', ''),
            submission.get('spam_score', ''),
            submission.get('recaptcha_score', '')
        ])
    
    # Create response
    output.seek(0)
    filename = f"niche_submissions_{datetime.now().strftime('%Y%m%d')}.csv"
    
    def iterfile():
        yield output.getvalue().encode('utf-8')
    
    return StreamingResponse(
        iterfile(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@api_router.get("/admin/stats")
async def get_admin_stats(admin: str = Depends(get_admin_credentials)):
    """
    Get submission statistics (Admin only)
    """
    now = datetime.utcnow()
    today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    # Aggregate statistics
    total_submissions = await db.contact_submissions.count_documents({})
    today_submissions = await db.contact_submissions.count_documents({"created_at": {"$gte": today}})
    week_submissions = await db.contact_submissions.count_documents({"created_at": {"$gte": week_ago}})
    month_submissions = await db.contact_submissions.count_documents({"created_at": {"$gte": month_ago}})
    
    # Status breakdown
    new_count = await db.contact_submissions.count_documents({"status": "new"})
    contacted_count = await db.contact_submissions.count_documents({"status": "contacted"})
    closed_count = await db.contact_submissions.count_documents({"status": "closed"})
    
    # Service popularity
    pipeline = [
        {"$match": {"service": {"$ne": None}}},
        {"$group": {"_id": "$service", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    service_stats = []
    async for result in db.contact_submissions.aggregate(pipeline):
        service_stats.append({"service": result["_id"], "count": result["count"]})
    
    return {
        "total_submissions": total_submissions,
        "submissions_today": today_submissions,
        "submissions_this_week": week_submissions,
        "submissions_this_month": month_submissions,
        "status_breakdown": {
            "new": new_count,
            "contacted": contacted_count,
            "closed": closed_count
        },
        "popular_services": service_stats[:5]
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("NICHE Digital Marketing API starting up...")
    
    # Create indexes for better performance
    await db.contact_submissions.create_index("email")
    await db.contact_submissions.create_index("created_at")
    await db.contact_submissions.create_index("status")
    
    logger.info("Database indexes created")
    
    # Check service configurations
    if not email_service.smtp_user:
        logger.warning("Email service not configured - emails will not be sent")
    
    if not recaptcha_service.is_configured():
        logger.warning("reCAPTCHA not configured - spam protection limited")
    
    logger.info("NICHE Digital Marketing API ready!")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Database connection closed")