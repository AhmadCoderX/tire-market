from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from PIL import Image
from django.core.validators import FileExtensionValidator
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils.translation import gettext_lazy as _
from django.conf import settings
import os

class CaseSensitiveUsernameValidator(UnicodeUsernameValidator):
    def __call__(self, value):
        super().__call__(value)
        # Add case-sensitive uniqueness check
        from django.contrib.auth import get_user_model
        User = get_user_model()
        if User.objects.filter(username__exact=value).exists():
            raise models.ValidationError(
                _('A user with that username already exists.'),
                code='unique',
            )

class User(AbstractUser):
    # Override the username field to use case-sensitive validation
    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        help_text=_('Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[CaseSensitiveUsernameValidator()],
        error_messages={
            'unique': _('A user with that username already exists.'),
        },
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(max_length=15, null=True, blank=True)
    is_business = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    profile_image_url = models.CharField(max_length=255, null=True, blank=True)
    is_suspended = models.BooleanField(default=False)
    suspended_at = models.DateTimeField(null=True, blank=True)
    is_banned = models.BooleanField(default=False)
    banned_at = models.DateTimeField(null=True, blank=True)

    def get_average_rating(self):
        reviews = self.reviews_received.all()
        if not reviews:
            return 0
        return sum(review.rating for review in reviews) / len(reviews)

    class Meta:
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
        ]

class BusinessProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    shop_name = models.CharField(max_length=100)
    address = models.TextField()
    business_hours = models.JSONField()
    services = models.JSONField(default=list)
    subscription_active = models.BooleanField(default=False)
    subscription_start_date = models.DateTimeField(null=True)
    subscription_end_date = models.DateTimeField(null=True)

class TireListing(models.Model):
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('used', 'Used'),
    ]
    
    TIRE_TYPE_CHOICES = [
        ('all_season', 'All Season'),
        ('winter', 'Winter'),
        ('summer', 'Summer'),
        ('performance', 'Performance'),
        ('mud_terrain', 'Mud Terrain'),
        ('all_terrain', 'All Terrain'),
    ]

    VEHICLE_TYPE_CHOICES = [
        ('passenger', 'Passenger Car'),
        ('suv', 'SUV'),
        ('truck', 'Truck'),
        ('motorcycle', 'Motorcycle'),
        ('van', 'Van'),
        ('others', 'Others'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    condition = models.CharField(max_length=10, choices=CONDITION_CHOICES)
    tire_type = models.CharField(max_length=20, choices=TIRE_TYPE_CHOICES)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPE_CHOICES, default='passenger')
    width = models.IntegerField()
    aspect_ratio = models.IntegerField()
    diameter = models.IntegerField()
    load_index = models.IntegerField()
    speed_rating = models.CharField(max_length=5)
    tread_depth = models.DecimalField(max_digits=4, decimal_places=2)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100, blank=True, null=True)
    quantity = models.IntegerField()
    mileage = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_promoted = models.BooleanField(default=False)
    promotion_end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)  # Track if listing is active or unlisted

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class ListingImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.ForeignKey(TireListing, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='tire_images/', null=True, blank=True)
    thumbnail = models.ImageField(upload_to='tire_images/thumbnails/', null=True, blank=True)
    position = models.PositiveIntegerField(default=0)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.thumbnail and self.image:
            try:
                # Create necessary directories
                thumbnail_dir = os.path.join(settings.MEDIA_ROOT, 'tire_images/thumbnails')
                os.makedirs(thumbnail_dir, exist_ok=True)
                
                # Create thumbnail
                img = Image.open(self.image)
                img.thumbnail((300, 300))  # Adjust size as needed
                thumb_name = f'thumb_{os.path.basename(self.image.name)}'
                thumb_path = os.path.join(thumbnail_dir, thumb_name)
                
                # Save thumbnail
                img.save(thumb_path)
                
                # Update thumbnail field relative to MEDIA_ROOT
                rel_path = os.path.join('tire_images/thumbnails', thumb_name)
                self.thumbnail = rel_path
            except Exception as e:
                print(f"Error creating thumbnail: {e}")
                # Continue saving even if thumbnail creation fails
                
        super().save(*args, **kwargs)

    class Meta:
        indexes = [models.Index(fields=['listing'])]
        ordering = ['position']

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reviewer = models.ForeignKey(User, related_name='reviews_given', on_delete=models.CASCADE)
    reviewed_user = models.ForeignKey(User, related_name='reviews_received', on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['reviewed_user']),
        ]

class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['sender', 'receiver']),
        ]

class OTPVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'otp']),
        ]

class PasswordReset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'token']),
        ]