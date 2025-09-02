from django.core.mail import send_mail
from django.conf import settings
import random

def generate_otp():
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])

def send_otp_email(user_email, otp):
    subject = 'Email Verification OTP'
    message = f'Your verification code is: {otp}'
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [user_email],
        fail_silently=False,
    )

def send_password_reset_email(user_email, reset_token):
    # Use environment variable for frontend URL or default to localhost
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:19006')
    
    # Create the reset link with proper routing
    reset_link = f"{frontend_url}/change-password?token={reset_token}&email={user_email}"
    
    subject = 'Password Reset Request - Tire Marketplace'
    message = f'''
Hello,

You have requested to reset your password for your Tire Marketplace account.

Click the following link to reset your password:
{reset_link}

This link will expire in 24 hours.

If you did not request this password reset, please ignore this email.

Best regards,
Tire Marketplace Team
'''
    
    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [user_email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send password reset email to {user_email}: {str(e)}")
        return False 