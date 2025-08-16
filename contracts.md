# NICHE Digital Marketing - Backend Integration Contracts

## Overview
This document outlines the API contracts and integration requirements to transform the current mock-based frontend into a fully functional backend-integrated system.

## Current Mock Data to Replace

### 1. Contact Form Submission (ContactSection.jsx)
**Current Mock Implementation:**
- Form data logged to console
- Success message shown for 3 seconds
- Form resets automatically

**Backend Requirements:**
- Real form submission to API endpoint
- Email sending to business owner
- Database storage for record keeping
- Spam protection and validation
- Error handling and user feedback

## API Endpoints to Implement

### 1. Contact Form Submission
**Endpoint:** `POST /api/contact`

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "phone": "string (optional)",
  "service": "string (optional)",
  "message": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you! We'll get back to you within 24 hours."
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here",
  "errors": ["field-specific errors"]
}
```

## Database Schema

### Contact Submissions Table
```sql
CREATE TABLE contact_submissions (
  id: ObjectId (primary key),
  name: String (required),
  email: String (required, indexed),
  phone: String (optional),
  service: String (optional),
  message: Text (optional),
  created_at: DateTime (auto-generated),
  updated_at: DateTime (auto-generated),
  ip_address: String (for spam protection),
  user_agent: String (for tracking),
  status: String (default: "new", enum: ["new", "contacted", "closed"])
)
```

## Email Configuration Required

### SMTP Settings Needed:
- **SMTP Host:** (e.g., smtp.gmail.com, mail.domain.com)
- **SMTP Port:** (587 for TLS, 465 for SSL)
- **Email Username:** (sender email)
- **Email Password/App Password:** (authentication)
- **Recipient Email:** (where form submissions are sent)

### Email Template:
- Subject: "New Consultation Request - NICHE Digital Marketing"
- Professional HTML template with form data
- Auto-reply confirmation to user

## Security & Spam Protection

### 1. Input Validation
- Server-side validation for all fields
- Email format validation
- XSS protection (sanitize inputs)
- SQL injection protection (using ODM)

### 2. Rate Limiting
- Max 3 submissions per IP per hour
- Cooldown period for repeated submissions

### 3. Basic Spam Protection
- Honeypot field (hidden input)
- Simple CAPTCHA or time-based validation
- Email domain blacklist check

### 4. Data Protection
- Secure password hashing for any admin features
- Environment variables for sensitive data
- Input sanitization and validation

## Frontend Integration Changes

### 1. ContactSection.jsx Updates
**Replace Mock Code:**
```javascript
// REMOVE: Mock form submission
console.log('Form submitted:', formData);
setIsSubmitted(true);

// ADD: Real API call
try {
  const response = await axios.post(`${API}/contact`, formData);
  if (response.data.success) {
    setIsSubmitted(true);
    // Show success message
  }
} catch (error) {
  // Show error handling
  setError(error.response?.data?.message || 'Something went wrong');
}
```

**Add Error Handling:**
- Loading states during submission
- Error message display
- Form validation feedback
- Success confirmation with details

### 2. Form Enhancements
- Client-side validation before submission  
- Loading spinner during API call
- Better error messaging
- Form field persistence on errors

## Additional Backend Features

### 1. Admin Dashboard (Optional)
- Simple admin route to view submissions
- Basic authentication
- Export functionality (CSV)
- Status management (new/contacted/closed)

### 2. Auto-Reply Email
- Confirmation email sent to user
- Professional template with next steps
- Company contact information

### 3. Analytics & Monitoring
- Track submission success rates
- Monitor for spam attempts
- Basic form analytics

## Environment Variables Needed

```env
# Email Configuration
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
RECIPIENT_EMAIL=

# Security
JWT_SECRET=
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=3

# Optional: Admin Access
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

## Testing Requirements

### 1. Backend Testing
- Contact form submission endpoint
- Email sending functionality
- Database storage verification
- Rate limiting validation
- Input validation and sanitization

### 2. Integration Testing
- Frontend form submission flow
- Error handling scenarios
- Success confirmation flow
- Email delivery verification

## Implementation Priority

1. **Phase 1:** Basic contact form API with database storage
2. **Phase 2:** Email sending functionality
3. **Phase 3:** Security and spam protection
4. **Phase 4:** Error handling and user feedback
5. **Phase 5:** Admin features (if needed)

## Notes
- All mock data in `/app/frontend/src/data/mock.js` remains unchanged (static content)
- Only contact form functionality needs backend integration
- Maintain current UI/UX - no frontend changes except API calls
- Ensure email reliability and delivery tracking