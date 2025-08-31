from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone
from .models import TireListing

@receiver(pre_save, sender=TireListing)
def update_listing_timestamp(sender, instance, **kwargs):
    """Update the updated_at timestamp when a TireListing is modified"""
    if instance.pk:  # Only update timestamp if this is an existing instance
        instance.updated_at = timezone.now() 