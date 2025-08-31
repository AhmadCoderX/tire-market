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
    reset_link = f"http://localhost:19006/reset-password/{reset_token}"  # Adjust URL for your frontend
    subject = 'Password Reset Request'
    message = f'Click the following link to reset your password: {reset_link}'
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [user_email],
        fail_silently=False,
    ) 