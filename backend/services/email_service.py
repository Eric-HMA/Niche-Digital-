import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        self.smtp_user = os.environ.get('SMTP_USER')
        self.smtp_pass = os.environ.get('SMTP_PASS')
        self.business_email = os.environ.get('BUSINESS_EMAIL')
        
    def send_notification_to_business(self, submission_data: dict) -> bool:
        """Send notification email to business owner about new contact submission"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f"New Consultation Request - NICHE Digital Marketing"
            msg['From'] = self.smtp_user
            msg['To'] = self.business_email
            
            # Create HTML content
            html_content = self._create_business_notification_html(submission_data)
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_pass)
                server.send_message(msg)
                
            logger.info(f"Business notification sent for submission {submission_data.get('id')}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send business notification: {str(e)}")
            return False
    
    def send_confirmation_to_client(self, submission_data: dict) -> bool:
        """Send auto-confirmation email to client"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = "Thank you for your interest - NICHE Digital Marketing"
            msg['From'] = self.smtp_user
            msg['To'] = submission_data['email']
            
            # Create HTML content
            html_content = self._create_client_confirmation_html(submission_data)
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_pass)
                server.send_message(msg)
                
            logger.info(f"Client confirmation sent to {submission_data['email']}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send client confirmation: {str(e)}")
            return False
    
    def _create_business_notification_html(self, data: dict) -> str:
        """Create HTML template for business notification email"""
        service_text = data.get('service', 'Not specified')
        business_name_text = f" from {data.get('business_name')}" if data.get('business_name') else ""
        phone_text = f"<strong>Phone:</strong> {data.get('phone')}<br>" if data.get('phone') else ""
        message_text = data.get('message', 'No additional message provided.')
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #ECEC75; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background: #fff; padding: 30px; border: 1px solid #ddd; }}
                .footer {{ background: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; color: #666; }}
                .field {{ margin-bottom: 15px; }}
                .label {{ font-weight: bold; color: #0f172a; }}
                .highlight {{ background: #e6e67c; padding: 10px; border-radius: 5px; margin: 10px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2 style="margin: 0; color: #0f172a;">New Consultation Request</h2>
                    <p style="margin: 10px 0 0 0; color: #0f172a;">NICHE Digital Marketing</p>
                </div>
                
                <div class="content">
                    <p>You have received a new consultation request{business_name_text}:</p>
                    
                    <div class="highlight">
                        <div class="field">
                            <span class="label">Name:</span> {data.get('name')}<br>
                            {f"<span class='label'>Business:</span> {data.get('business_name')}<br>" if data.get('business_name') else ""}
                            <span class="label">Email:</span> {data.get('email')}<br>
                            {phone_text}
                            <span class="label">Service Interest:</span> {service_text}<br>
                            <span class="label">Submitted:</span> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}
                        </div>
                    </div>
                    
                    <div class="field">
                        <p><strong>Message:</strong></p>
                        <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-style: italic;">{message_text}</p>
                    </div>
                    
                    <p><strong>Next Steps:</strong></p>
                    <ul>
                        <li>Respond within 24 hours for best client experience</li>
                        <li>Schedule a consultation call to discuss their needs</li>
                        <li>Prepare a customized proposal based on their service interest</li>
                    </ul>
                </div>
                
                <div class="footer">
                    <p>This email was sent from your NICHE Digital Marketing website contact form.</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def _create_client_confirmation_html(self, data: dict) -> str:
        """Create HTML template for client confirmation email"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #ECEC75; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }}
                .content {{ background: #fff; padding: 30px; border: 1px solid #ddd; }}
                .footer {{ background: #0f172a; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }}
                .cta-button {{ display: inline-block; background: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 15px 0; }}
                .highlight {{ background: #e6e67c; padding: 15px; border-radius: 5px; margin: 15px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; color: #0f172a;">Thank You!</h1>
                    <p style="margin: 10px 0 0 0; color: #0f172a;">NICHE Digital Marketing</p>
                </div>
                
                <div class="content">
                    <p>Dear {data.get('name')},</p>
                    
                    <p>Thank you for your interest in our digital marketing services! We've successfully received your consultation request.</p>
                    
                    <div class="highlight">
                        <h3 style="margin-top: 0; color: #0f172a;">What happens next?</h3>
                        <ol>
                            <li><strong>Quick Response:</strong> We'll respond within 24 hours to schedule your consultation</li>
                            <li><strong>Strategy Discussion:</strong> 30-minute consultation to understand your needs and goals</li>
                            <li><strong>Custom Proposal:</strong> Tailored strategy and pricing based on your requirements</li>
                        </ol>
                    </div>
                    
                    <p><strong>Your submission details:</strong></p>
                    <ul>
                        <li>Service Interest: {data.get('service', 'Consultation')}</li>
                        <li>Submitted: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</li>
                    </ul>
                    
                    <p>In the meantime, feel free to explore our services and case studies on our website. If you have any urgent questions, don't hesitate to contact us directly.</p>
                    
                    <div style="text-align: center;">
                        <p><strong>Questions? Contact us:</strong></p>
                        <p>📧 Email: {self.business_email}<br>
                        📱 Phone: +66 XX XXX XXXX</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>NICHE Digital Marketing</strong></p>
                    <p>Tailored digital marketing solutions that help businesses stand out, attract their ideal customers, and scale online.</p>
                </div>
            </div>
        </body>
        </html>
        """

# Initialize email service
email_service = EmailService()