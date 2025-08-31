from rest_framework import serializers
from .models import User, BusinessProfile, TireListing, ListingImage, Review, Message
import uuid
from django.core.files.storage import default_storage
from PIL import Image
import io
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.validators import FileExtensionValidator
import os
from django.core.files.base import ContentFile
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    is_verified = serializers.BooleanField(read_only=True, default=False)
    is_business = serializers.BooleanField(required=False, default=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'confirm_password', 
                 'phone', 'is_business', 'is_superuser', 'rating', 'profile_image_url', 'is_verified',
                 'last_login')
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'last_login': {'read_only': True},
            'is_superuser': {'read_only': True},
            'is_business': {'required': False, 'default': False}
        }

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError("Passwords don't match")
        
        # Check for duplicate email
        email = data.get('email')
        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'A user with this email already exists'})
        
        # Ensure is_business is a boolean and defaults to False
        data['is_business'] = data.get('is_business', False)
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        # Ensure is_business is included in creation
        is_business = validated_data.get('is_business', False)
        user = User(**validated_data)
        user.set_password(password)
        user.is_business = is_business
        user.save()
        return user

class BusinessProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessProfile
        fields = '__all__'
        read_only_fields = ('user',)

class ListingImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(
        write_only=False,
        required=False,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    image_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ListingImage
        fields = ['id', 'image', 'image_url', 'thumbnail', 'thumbnail_url', 'position', 'is_primary', 'listing']
        read_only_fields = ['thumbnail', 'image_url', 'thumbnail_url']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None

    def validate_image(self, image):
        if image.size > 5 * 1024 * 1024:  # 5MB limit
            raise serializers.ValidationError("Image size cannot exceed 5MB")
        return image

    def create(self, validated_data):
        image = validated_data.pop('image')
        ext = image.name.split('.')[-1].lower()
        
        # Generate unique filenames with subdirectory based on listing ID
        listing_id = str(validated_data['listing'].id)
        upload_dir = f'listings/{listing_id}'
        
        # Create directories if they don't exist
        os.makedirs(os.path.join(settings.MEDIA_ROOT, upload_dir), exist_ok=True)
        os.makedirs(os.path.join(settings.MEDIA_ROOT, f'{upload_dir}/thumbnails'), exist_ok=True)
        
        filename = f"{uuid.uuid4()}.{ext}"
        thumb_filename = f"thumb_{filename}"
        
        try:
            # Create thumbnail
            img = Image.open(image)
            
            # Preserve EXIF orientation data for JPEGs
            if hasattr(img, '_getexif') and img._getexif():
                from PIL import ExifTags
                for orientation in ExifTags.TAGS.keys():
                    if ExifTags.TAGS[orientation] == 'Orientation':
                        exif = dict(img._getexif().items())
                        if orientation in exif:
                            if exif[orientation] == 3:
                                img = img.rotate(180, expand=True)
                            elif exif[orientation] == 6:
                                img = img.rotate(270, expand=True)
                            elif exif[orientation] == 8:
                                img = img.rotate(90, expand=True)
                        break
            
            # Resize large images to max dimensions while maintaining aspect ratio
            max_size = (1200, 1200)
            if img.width > max_size[0] or img.height > max_size[1]:
                img.thumbnail(max_size, Image.LANCZOS)
                
            # Create thumbnail
            thumb = img.copy()
            thumb.thumbnail((300, 300), Image.LANCZOS)
            
            # Save both images to IO objects
            img_io = io.BytesIO()
            thumb_io = io.BytesIO()
            
            save_format = 'JPEG' if ext.lower() in ['jpg', 'jpeg'] else 'PNG'
            quality = 85  # Good balance between size and quality
            
            # Convert to RGB mode if it's RGBA (has transparency) and we're saving as JPEG
            if img.mode == 'RGBA' and save_format == 'JPEG':
                img = img.convert('RGB')
                thumb = thumb.convert('RGB')
            
            # Save full image
            if save_format == 'JPEG':
                img.save(img_io, format=save_format, quality=quality, optimize=True)
            else:
                img.save(img_io, format=save_format, optimize=True)
            img_io.seek(0)
            
            # Save thumbnail
            if save_format == 'JPEG':
                thumb.save(thumb_io, format=save_format, quality=quality, optimize=True)
            else:
                thumb.save(thumb_io, format=save_format, optimize=True)
            thumb_io.seek(0)
            
            # Save to storage
            path = default_storage.save(
                f'{upload_dir}/{filename}', 
                ContentFile(img_io.getvalue())
            )
            
            thumb_path = default_storage.save(
                f'{upload_dir}/thumbnails/{thumb_filename}', 
                ContentFile(thumb_io.getvalue())
            )

            # Create ListingImage instance with file paths
            listing_image = ListingImage(
                **validated_data
            )
            
            # Assign image and thumbnail fields
            listing_image.image.name = path
            listing_image.thumbnail.name = thumb_path
            listing_image.save()
            
            # Set as primary if it's the first image for this listing
            if not ListingImage.objects.filter(listing=listing_image.listing).exclude(id=listing_image.id).exists():
                listing_image.is_primary = True
                listing_image.save()
                
            return listing_image
            
        except Exception as e:
            # Delete any saved files if there was an error
            try:
                default_storage.delete(f'{upload_dir}/{filename}')
                default_storage.delete(f'{upload_dir}/thumbnails/{thumb_filename}')
            except:
                pass
            raise serializers.ValidationError(f"Image processing error: {str(e)}")
            
    def update(self, instance, validated_data):
        """Allow updating position and primary status only"""
        if 'position' in validated_data:
            instance.position = validated_data.get('position')
        
        if validated_data.get('is_primary', False):
            # Unset other primary images for this listing
            ListingImage.objects.filter(
                listing=instance.listing, 
                is_primary=True
            ).exclude(id=instance.id).update(is_primary=False)
            instance.is_primary = True
            
        instance.save()
        return instance

class TireListingSerializer(serializers.ModelSerializer):
    images = ListingImageSerializer(many=True, read_only=True)
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    seller_rating = serializers.SerializerMethodField()
    seller_review_count = serializers.SerializerMethodField()
    seller = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()

    def get_seller_rating(self, obj):
        return obj.seller.get_average_rating()

    def get_seller_review_count(self, obj):
        return Review.objects.filter(reviewed_user=obj.seller).count()

    def get_seller(self, obj):
        return {
            'id': str(obj.seller.id),
            'username': obj.seller.username,
            'profile_image_url': obj.seller.profile_image_url,
            'date_joined': obj.seller.date_joined.isoformat() if obj.seller.date_joined else None,
            'is_business': obj.seller.is_business,
            'rating': float(obj.seller.rating)
        }
        
    def get_primary_image(self, obj):
        # Get the primary image or the first image if no primary is set
        primary_image = obj.images.filter(is_primary=True).first()
        
        # If no primary image is set but there are images, get the first one
        if not primary_image:
            primary_image = obj.images.first()
            
        if primary_image:
            request = self.context.get('request')
            return {
                'id': str(primary_image.id),
                'image_url': request.build_absolute_uri(primary_image.image.url) if request and primary_image.image else (primary_image.image.url if primary_image.image else None),
                'thumbnail_url': request.build_absolute_uri(primary_image.thumbnail.url) if request and primary_image.thumbnail else (primary_image.thumbnail.url if primary_image.thumbnail else None)
            }
        return None
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        # Sort images with primary first, then by position
        images = data.get('images', [])
        if images:
            # Make sure images are ordered by position
            data['images'] = sorted(images, key=lambda img: (not img.get('is_primary', False), img.get('position', 0)))
        
        # Ensure seller profile image URL is absolute
        if data.get('seller') and data['seller'].get('profile_image_url'):
            if not (data['seller']['profile_image_url'].startswith('http://') or 
                   data['seller']['profile_image_url'].startswith('https://')):
                request = self.context.get('request')
                if request:
                    data['seller']['profile_image_url'] = request.build_absolute_uri(data['seller']['profile_image_url'])
                    
        return data

    def update(self, instance, validated_data):
        # Update only the fields that were provided
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    class Meta:
        model = TireListing
        fields = '__all__'
        read_only_fields = ('seller', 'created_at', 'updated_at')
        extra_kwargs = {
            'title': {'required': False},
            'condition': {'required': False},
            'tire_type': {'required': False},
            'width': {'required': False},
            'aspect_ratio': {'required': False},
            'diameter': {'required': False},
            'load_index': {'required': False},
            'speed_rating': {'required': False},
            'tread_depth': {'required': False},
            'brand': {'required': False}
        }

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('reviewer', 'created_at')

# marketplace/serializers.py

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    sender_image = serializers.CharField(source='sender.profile_image_url', read_only=True)
    receiver_name = serializers.CharField(source='receiver.username', read_only=True)
    receiver_image = serializers.CharField(source='receiver.profile_image_url', read_only=True)

    class Meta:
        model = Message
        fields = [
            'id', 'content', 'created_at', 'is_read',
            'sender', 'sender_name', 'sender_image',
            'receiver', 'receiver_name', 'receiver_image'
        ]
        read_only_fields = ['sender', 'created_at', 'is_read']