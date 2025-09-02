from django.shortcuts import render, get_object_or_404
from rest_framework import status, generics, viewsets
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, BusinessProfileSerializer, TireListingSerializer, ListingImageSerializer, ReviewSerializer, MessageSerializer
from .models import BusinessProfile, TireListing, ListingImage, Review, Message, OTPVerification, PasswordReset
from django.db import models
from .services import generate_otp, send_otp_email, send_password_reset_email
from django.utils import timezone
from datetime import timedelta
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.conf import settings
import uuid
from django.db.models import Q, Count, Avg
from rest_framework.authtoken.models import Token
from django.core.cache import cache
import json
from django.core.mail import send_mail
import random
import string
from itertools import chain

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        # Log the data before saving
        print("Registration data:", serializer.validated_data)
        print("is_business value:", serializer.validated_data.get('is_business', False))
        
        user = serializer.save()
        
        # Log the saved user data
        print("Created user:", user.username)
        print("User is_business:", user.is_business)
        
        otp = generate_otp()
        OTPVerification.objects.create(user=user, otp=otp)
        send_otp_email(user.email, otp)
        return user

class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Update last_login when user successfully logs in
            user = User.objects.get(username=request.data['username'])
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
        return response

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def business_profile(request):
    try:
        profile = BusinessProfile.objects.get(user=request.user)
    except BusinessProfile.DoesNotExist:
        if request.method == 'GET':
            return Response({'detail': 'Business profile not found'}, 
                          status=status.HTTP_404_NOT_FOUND)
        profile = None

    if request.method == 'GET':
        serializer = BusinessProfileSerializer(profile)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        if profile:
            serializer = BusinessProfileSerializer(profile, data=request.data, partial=True)
        else:
            serializer = BusinessProfileSerializer(data=request.data)
            
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Add these new viewset classes
class TireListingViewSet(viewsets.ModelViewSet):
    queryset = TireListing.objects.all()
    serializer_class = TireListingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

class ListingImageViewSet(viewsets.ModelViewSet):
    queryset = ListingImage.objects.all()
    serializer_class = ListingImageSerializer
    permission_classes = [IsAuthenticated]

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(
            models.Q(sender=user) | models.Q(receiver=user)
        )

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')
    
    if not email or not otp:
        return Response(
            {'error': 'Email and OTP are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Check if multiple users with the same email exist
        users_with_email = User.objects.filter(email=email)
        if users_with_email.count() > 1:
            return Response(
                {'error': 'Multiple accounts with this email exist. Please contact support.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = users_with_email.first()
        if not user:
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        verification = OTPVerification.objects.filter(
            user=user, 
            otp=otp, 
            is_verified=False
        ).latest('created_at')
        
        # Check if OTP has expired (e.g., after 10 minutes)
        if timezone.now() > verification.created_at + timedelta(minutes=10):
            return Response(
                {'error': 'OTP has expired. Please request a new one.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        verification.is_verified = True
        verification.save()
        
        # Also update the user's verified status
        user.is_verified = True
        user.save()
        
        return Response({'message': 'Email verified successfully'})
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except OTPVerification.DoesNotExist:
        return Response(
            {'error': 'Invalid or expired OTP'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def resend_otp(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        otp = generate_otp()
        OTPVerification.objects.create(user=user, otp=otp)
        send_otp_email(user.email, otp)
        return Response({'message': 'OTP resent successfully'})
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
def request_password_reset(request):
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'error': 'Email is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
        
        # Check if there's already an unused reset token for this user
        existing_reset = PasswordReset.objects.filter(
            user=user, 
            is_used=False,
            created_at__gte=timezone.now() - timedelta(hours=24)
        ).first()
        
        if existing_reset:
            # Use existing token if it's still valid
            reset = existing_reset
        else:
            # Create new reset token
            reset = PasswordReset.objects.create(user=user)
        
        # Send password reset email
        email_sent = send_password_reset_email(user.email, reset.token)
        
        if email_sent:
            return Response({
                'message': 'Password reset email sent successfully',
                'email': email  # Return email for confirmation
            })
        else:
            return Response(
                {'error': 'Failed to send password reset email. Please try again.'}, 
                status=status.HTP_500_INTERNAL_SERVER_ERROR
            )
            
    except User.DoesNotExist:
        # Don't reveal if email exists or not for security
        return Response({
            'message': 'If an account with this email exists, a password reset link has been sent.'
        })
    except Exception as e:
        print(f"Password reset request error: {str(e)}")
        return Response(
            {'error': 'An error occurred while processing your request. Please try again.'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def reset_password(request):
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')

    # Validate input
    if not token:
        return Response(
            {'error': 'Reset token is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not new_password:
        return Response(
            {'error': 'New password is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not confirm_password:
        return Response(
            {'error': 'Password confirmation is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    if new_password != confirm_password:
        return Response(
            {'error': 'Passwords do not match'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate password strength (basic validation)
    if len(new_password) < 6:
        return Response(
            {'error': 'Password must be at least 6 characters long'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        reset = PasswordReset.objects.get(
            token=token,
            is_used=False,
            created_at__gte=timezone.now() - timedelta(hours=24)
        )
        
        user = reset.user
        user.set_password(new_password)
        user.save()
        
        # Mark reset token as used
        reset.is_used = True
        reset.save()
        
        return Response({
            'message': 'Password reset successful. You can now login with your new password.'
        })
        
    except PasswordReset.DoesNotExist:
        return Response(
            {'error': 'Invalid or expired reset token. Please request a new password reset.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        print(f"Password reset error: {str(e)}")
        return Response(
            {'error': 'An error occurred while resetting your password. Please try again.'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_profile_image(request):
    if 'image' not in request.FILES:
        return Response(
            {'error': 'No image file provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    image = request.FILES['image']
    
    # Generate unique filename
    ext = image.name.split('.')[-1]
    filename = f'profile_images/{request.user.id}/{uuid.uuid4()}.{ext}'
    
    # Save file to media directory
    default_storage.save(filename, image)
    
    # Update user's profile_image_url
    request.user.profile_image_url = settings.MEDIA_URL + filename
    request.user.save()
    
    return Response({
        'message': 'Profile image uploaded successfully',
        'image_url': request.user.profile_image_url
    })

@api_view(['GET'])
def get_listings(request):
    try:
        # Get filter and pagination parameters
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 12))
        sort_by = request.GET.get('sort_by', '-created_at')  # Default sort by newest
        conditions = request.GET.getlist('condition')  # Get all condition values
        quantities = request.GET.getlist('quantity')  # Get all quantity values
        brands = request.GET.getlist('brand')  # Get all brand values
        vehicle_types = request.GET.getlist('vehicle_type')  # Get all vehicle type values
        tire_types = request.GET.getlist('tire_type')  # Get all tire type values
        seller_type = request.GET.get('seller_type')
        seller_id = request.GET.get('seller')  # Get seller ID filter
        search = request.GET.get('search')
        price_min = request.GET.get('price_min')
        price_max = request.GET.get('price_max')
        width = request.GET.get('width')
        aspect_ratio = request.GET.get('aspect_ratio')
        diameter = request.GET.get('diameter')
        tread_depth_min = request.GET.get('tread_depth_min')
        tread_depth_max = request.GET.get('tread_depth_max')
        rating_min = request.GET.get('rating_min')
        speed_ratings = request.GET.getlist('speed_rating')  # Get all speed rating values
        load_indices = request.GET.getlist('load_index')  # Get all load index values
        
        # Base queryset
        listings = TireListing.objects.all().select_related('seller').prefetch_related('images')

        # Debug logging
        print("Initial queryset count:", listings.count())
        
        # Filter to only show active listings by default
        listings = listings.filter(is_active=True)
        print("After active filter count:", listings.count())

        # Filter by seller ID if provided
        if seller_id:
            print(f"Filtering by seller ID: {seller_id}")
            listings = listings.filter(seller__id=seller_id)
            print("After seller filter count:", listings.count())

        # Apply search filter first - this should find all matching listings regardless of seller type
        if search and search.strip():  # Only apply search if there's a non-empty search term
            search_terms = search.strip().split()
            if search_terms:  # Extra check to ensure we have actual terms to search for
                search_query = Q()
                for term in search_terms:
                    # Make search more flexible by looking for partial matches
                    text_query = (
                        Q(title__icontains=term) |
                        Q(description__icontains=term) |
                        Q(brand__icontains=term) |
                        Q(model__icontains=term) |
                        Q(tire_type__icontains=term) |
                        Q(seller__username__icontains=term)  # Also search in seller usernames
                    )
                    search_query |= text_query
                    
                    # Try to match tire size specifications
                    # Check if the term is a number that could be a tire dimension
                    try:
                        # Strip any non-numeric characters to handle cases like "16in" or "225mm"
                        numeric_term = ''.join(filter(str.isdigit, term))
                        if numeric_term:
                            num_value = int(numeric_term)
                            # Add matches for common tire dimensions with exact match
                            size_query = (
                                Q(width=num_value) |
                                Q(aspect_ratio=num_value) |
                                Q(diameter=num_value)
                            )
                            search_query |= size_query
                            print(f"Added numeric search for: {num_value}")
                            
                            # Also add a query to check if the value is in the title
                            # This helps catch patterns like "225/45R17" 
                            num_in_title_query = Q(title__icontains=str(num_value))
                            search_query |= num_in_title_query
                    except (ValueError, TypeError) as e:
                        print(f"Error parsing numeric value from '{term}': {str(e)}")
                        # Not a number, so skip tire size matching for this term
                        pass
                
                print(f"Applying search filter with terms: {search_terms}")
                
                # First check how many results we would get with this search query
                result_count = listings.filter(search_query).count()
                print(f"Search would return {result_count} results")
                
                # Apply the search if we have results
                if result_count > 0:
                    listings = listings.filter(search_query)
                    print("After search filter count:", listings.count())
                else:
                    # If no results found, try a more relaxed search - just look for the term in the title
                    relaxed_query = Q()
                    for term in search_terms:
                        relaxed_query |= Q(title__icontains=term)
                    
                    relaxed_count = listings.filter(relaxed_query).count()
                    print(f"Relaxed search would return {relaxed_count} results")
                    
                    if relaxed_count > 0:
                        # If relaxed search has results, use that instead
                        listings = listings.filter(relaxed_query)
                        print("Using relaxed search with count:", listings.count())
                    else:
                        # No results even with relaxed search, keep original query
                        listings = listings.filter(search_query)

        # Apply other filters
        if conditions:
            listings = listings.filter(condition__in=conditions)
        if quantities:
            quantity_map = {
                'single': 1,
                'double': 2,
                'set4': 4
            }
            quantity_numbers = [quantity_map[q] for q in quantities if q in quantity_map]
            if quantity_numbers:
                listings = listings.filter(quantity__in=quantity_numbers)
        if brands:
            listings = listings.filter(brand__in=brands)
        if vehicle_types:
            listings = listings.filter(vehicle_type__in=vehicle_types)
        if tire_types:
            listings = listings.filter(tire_type__in=tire_types)
        if speed_ratings:
            listings = listings.filter(speed_rating__in=speed_ratings)
        if load_indices:
            # Convert string load indices to integers for filtering
            load_index_numbers = [int(li) for li in load_indices if li.isdigit()]
            if load_index_numbers:
                listings = listings.filter(load_index__in=load_index_numbers)
            
        # Apply price filters
        if price_min:
            listings = listings.filter(price__gte=float(price_min))
        if price_max:
            listings = listings.filter(price__lte=float(price_max))
            
        # Only apply seller type filter if explicitly searching for a seller type
        if seller_type and not search:  # Don't apply seller type filter during search
            is_business = seller_type.lower() == 'business'
            print(f"Applying seller_type filter: is_business={is_business}")
            listings = listings.filter(seller__is_business=is_business)
            print("After seller_type filter count:", listings.count())
        
        # Apply tire size filters
        if width:
            listings = listings.filter(width=int(width))
        if aspect_ratio:
            listings = listings.filter(aspect_ratio=int(aspect_ratio))
        if diameter:
            listings = listings.filter(diameter=int(diameter))
            
        # Apply tread depth filters
        if tread_depth_min:
            listings = listings.filter(tread_depth__gte=float(tread_depth_min))
        if tread_depth_max:
            listings = listings.filter(tread_depth__lte=float(tread_depth_max))
            
        # Apply seller rating filter
        if rating_min:
            listings = listings.filter(seller__rating__gte=float(rating_min))

        # Apply sorting
        if sort_by:
            # First separate promoted and non-promoted listings
            promoted_listings = listings.filter(is_promoted=True)
            regular_listings = listings.filter(is_promoted=False)
            
            # Add debugging information
            promoted_count = promoted_listings.count()
            regular_count = regular_listings.count()
            print(f"Before sorting - Promoted listings: {promoted_count}, Regular listings: {regular_count}, Total: {promoted_count + regular_count}")
            
            # Apply the same sorting to both groups
            if sort_by == 'price_low':
                promoted_listings = promoted_listings.order_by('price')
                regular_listings = regular_listings.order_by('price')
            elif sort_by == 'price_high':
                promoted_listings = promoted_listings.order_by('-price')
                regular_listings = regular_listings.order_by('-price')
            elif sort_by == 'rating':
                promoted_listings = promoted_listings.order_by('-seller__rating')
                regular_listings = regular_listings.order_by('-seller__rating')
            elif sort_by == 'newest':
                promoted_listings = promoted_listings.order_by('-created_at')
                regular_listings = regular_listings.order_by('-created_at')
            else:
                promoted_listings = promoted_listings.order_by(sort_by)
                regular_listings = regular_listings.order_by(sort_by)
            
            # Combine the two querysets while maintaining order
            listings_list = list(chain(promoted_listings, regular_listings))
            
            # Get the total count before pagination
            total_count = len(listings_list)
            print(f"After combining - Total listings: {total_count}")
            
            # Apply pagination manually
            start_idx = (page - 1) * page_size
            end_idx = start_idx + page_size
            paginated_listings = listings_list[start_idx:end_idx]
            print(f"After pagination - Showing listings {start_idx+1} to {min(end_idx, total_count)} of {total_count}")
        else:
            # If no sorting is applied, still prioritize promoted listings
            # but use the default database ordering
            promoted_listings = listings.filter(is_promoted=True)
            regular_listings = listings.filter(is_promoted=False).order_by('-created_at')
            
            # Add debugging information
            promoted_count = promoted_listings.count()
            regular_count = regular_listings.count()
            print(f"No explicit sort - Promoted listings: {promoted_count}, Regular listings: {regular_count}, Total: {promoted_count + regular_count}")
            
            # Combine the two querysets
            listings_list = list(chain(promoted_listings, regular_listings))
            
            # Get the total count
            total_count = len(listings_list)
            
            # Apply pagination manually
            start_idx = (page - 1) * page_size
            end_idx = start_idx + page_size
            paginated_listings = listings_list[start_idx:end_idx]
            print(f"After pagination - Showing listings {start_idx+1} to {min(end_idx, total_count)} of {total_count}")
        
        # Make sure all listings have their related data preloaded
        # for serialization efficiency
        # Note: since we're working with a list of model instances now,
        # we can't use select_related/prefetch_related at this point
        
        # Use serializer with proper context to handle URLs
        serializer = TireListingSerializer(paginated_listings, many=True, context={'request': request})
        serialized_data = serializer.data
        
        # Ensure all image URLs are absolute
        for listing in serialized_data:
            if 'images' in listing:
                for image in listing['images']:
                    if image.get('image_url') and not (image['image_url'].startswith('http://') or image['image_url'].startswith('https://')):
                        image['image_url'] = request.build_absolute_uri(image['image_url'])
                    if image.get('thumbnail_url') and not (image['thumbnail_url'].startswith('http://') or image['thumbnail_url'].startswith('https://')):
                        image['thumbnail_url'] = request.build_absolute_uri(image['thumbnail_url'])
                        
            if listing.get('primary_image'):
                primary = listing['primary_image']
                if primary.get('image_url') and not (primary['image_url'].startswith('http://') or primary['image_url'].startswith('https://')):
                    primary['image_url'] = request.build_absolute_uri(primary['image_url'])
                if primary.get('thumbnail_url') and not (primary['thumbnail_url'].startswith('http://') or primary['thumbnail_url'].startswith('https://')):
                    primary['thumbnail_url'] = request.build_absolute_uri(primary['thumbnail_url'])
        
        # Construct next and previous page URLs
        base_url = request.build_absolute_uri().split('?')[0]
        query_params = request.GET.copy()
        
        # Next page URL
        next_url = None
        if end_idx < total_count:
            query_params['page'] = page + 1
            next_url = f"{base_url}?{query_params.urlencode()}"
        
        # Previous page URL
        previous_url = None
        if page > 1:
            query_params['page'] = page - 1
            previous_url = f"{base_url}?{query_params.urlencode()}"

        return Response({
            'count': total_count,
            'next': next_url,
            'previous': previous_url,
            'results': serialized_data
        })
    except Exception as e:
        print(f"Error in get_listings: {str(e)}")  # Add error logging
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_listing(request):
    try:
        # Check if user has reached their listing limit (non-business users)
        if not request.user.is_business:
            user_listings_count = TireListing.objects.filter(seller=request.user).count()
            listings_limit = 5  # Limit for regular users
            
            if user_listings_count >= listings_limit:
                return Response(
                    {
                        'error': f'You have reached the maximum limit of {listings_limit} listings. Upgrade to a business account for unlimited listings.'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
        
        # Get listing data from the 'data' field
        listing_data = json.loads(request.data.get('data', '{}'))
        
        # Log the received data for debugging
        print('Received listing data:', listing_data)
        
        serializer = TireListingSerializer(data=listing_data, context={'request': request})
        if serializer.is_valid():
            # Save the listing with the authenticated user as the seller
            listing = serializer.save(seller=request.user)
            
            # Handle image uploads
            images = request.FILES.getlist('images')
            print(f'Received {len(images)} images')
            
            # Print information about all form data for debugging
            for key in request.data.keys():
                print(f'Form data key: {key}, Type: {type(request.data[key])}')
            
            for key in request.FILES.keys():
                print(f'Files key: {key}, Count: {len(request.FILES.getlist(key))}')
            
            # Process each image
            for i, image in enumerate(images):
                print(f'Processing image {i+1}: {image.name}, Size: {image.size} bytes, Content type: {image.content_type}')
                
                try:
                    # Create a new ListingImage instance for each uploaded image
                    list_image = ListingImage.objects.create(
                        listing=listing,
                        image=image
                    )
                    print(f'Created ListingImage with ID: {list_image.id}')
                except Exception as e:
                    print(f'Error creating image {i+1}: {str(e)}')
            
            # Retrieve the listing with images to return in response
            updated_listing = TireListing.objects.get(id=listing.id)
            response_serializer = TireListingSerializer(updated_listing, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('Serializer errors:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except json.JSONDecodeError:
        return Response({'error': 'Invalid JSON data'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print('Error creating listing:', str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT'])
def update_listing(request, listing_id):
    try:
        # For GET requests, we don't need to check if the user is the seller
        if request.method == 'GET':
            listing = TireListing.objects.select_related('seller').prefetch_related('images').get(id=listing_id)
            serializer = TireListingSerializer(listing, context={'request': request})
            return Response(serializer.data)
            
        # For PUT requests, verify the user is the seller
        listing = TireListing.objects.get(id=listing_id, seller=request.user)
        if request.method == 'PUT':
            serializer = TireListingSerializer(listing, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except TireListing.DoesNotExist:
        return Response(
            {'error': 'Listing not found or you do not have permission to edit it'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_listing(request, listing_id):
    try:
        listing = TireListing.objects.get(id=listing_id, seller=request.user)
        listing.delete()
        return Response({'message': 'Listing deleted successfully'})
    except TireListing.DoesNotExist:
        return Response(
            {'error': 'Listing not found or you do not have permission to delete it'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def search_listings(request):
    try:
        query = request.GET.get('q', '')
        if not query:
            # Return all listings if no query provided
            listings = TireListing.objects.all()
        else:
            listings = TireListing.objects.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(brand__icontains=query) |
                Q(model__icontains=query) |
                Q(tire_type__icontains=query)
            ).distinct()

        # Add order by to show newest first
        listings = listings.order_by('-created_at')

        serializer = TireListingSerializer(listings, many=True)
        return Response({
            'count': listings.count(),
            'results': serializer.data
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_listing_images(request, listing_id):
    """Upload multiple images for a listing with proper validation and error handling"""
    try:
        # Get the listing and verify ownership
        listing = get_object_or_404(TireListing, id=listing_id, seller=request.user)
        images = request.FILES.getlist('images')
        
        if not images:
            return Response(
                {'error': 'No images provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check max images per listing (limit to 10)
        current_image_count = listing.images.count()
        max_allowed = 10
        if current_image_count + len(images) > max_allowed:
            return Response(
                {'error': f'Maximum {max_allowed} images allowed per listing. You already have {current_image_count} images.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Process each image
        uploaded_images = []
        errors = []
        
        for image in images:
            # Validate file size (5MB limit)
            if image.size > 5 * 1024 * 1024:
                errors.append(f'Image {image.name} exceeds 5MB size limit')
                continue
                
            # Validate file extension
            ext = image.name.split('.')[-1].lower()
            if ext not in ['jpg', 'jpeg', 'png']:
                errors.append(f'Image {image.name} has invalid extension. Only jpg, jpeg, and png formats are allowed')
                continue
            
            # Create serializer with the image and listing ID
            serializer = ListingImageSerializer(data={
                'image': image,
                'listing': listing.id
            })
            
            if serializer.is_valid():
                serializer.save()
                uploaded_images.append(serializer.data)
            else:
                errors.append(f'Error processing image {image.name}: {serializer.errors}')
        
        # Return response with results
        response_data = {'images': uploaded_images}
        if errors:
            response_data['errors'] = errors
            
        if not uploaded_images and errors:
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
            
        return Response(response_data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE', 'PUT'])
@permission_classes([IsAuthenticated])
def manage_listing_image(request, listing_id, image_id):
    try:
        listing = TireListing.objects.get(id=listing_id, seller=request.user)
        image = ListingImage.objects.get(id=image_id, listing=listing)

        if request.method == 'DELETE':
            # Delete image files
            default_storage.delete(image.image_url.split('/')[-1])
            if image.thumbnail_url:
                default_storage.delete(image.thumbnail_url.split('/')[-1])
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        elif request.method == 'PUT':
            # Update image position or primary status
            position = request.data.get('position')
            is_primary = request.data.get('is_primary')

            if position is not None:
                image.position = position
            
            if is_primary:
                # Unset other primary images
                listing.images.filter(is_primary=True).update(is_primary=False)
                image.is_primary = True
            
            image.save()
            return Response(ListingImageSerializer(image).data)

    except (TireListing.DoesNotExist, ListingImage.DoesNotExist):
        return Response(
            {'error': 'Image not found or you do not have permission'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def verify_token(request):
    try:
        # Get the token from the Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Token '):
            return Response({'error': 'Invalid token format'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token_key = auth_header.split(' ')[1]
        token = Token.objects.get(key=token_key)
        
        # Get user data and update last_login
        user = token.user
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        
        user_data = {
            'id': str(user.id),
            'username': user.username,
            'email': user.email,
            'is_business': user.is_business,
            'is_superuser': user.is_superuser,
            'rating': float(user.rating),
            'profile_image_url': user.profile_image_url,
            'phone': user.phone
        }
        
        return Response({
            'valid': True,
            'user': user_data
        })
    except Token.DoesNotExist:
        return Response({
            'valid': False,
            'error': 'Invalid token'
        }, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        return Response({
            'valid': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_listing_details(request, listing_id):
    try:
        # Get the listing with related seller and images data for efficiency
        listing = TireListing.objects.select_related('seller').prefetch_related('images').get(id=listing_id)
        
        # Serialize the listing data with images
        serializer = TireListingSerializer(listing)
        response_data = serializer.data
        
        # Add information about total image count
        response_data['total_images'] = listing.images.count()
        
        # Ensure image URLs are properly formed
        if 'images' in response_data:
            for image in response_data['images']:
                if image.get('image_url') and not (image['image_url'].startswith('http://') or image['image_url'].startswith('https://')):
                    image['image_url'] = request.build_absolute_uri(image['image_url'])
                if image.get('thumbnail_url') and not (image['thumbnail_url'].startswith('http://') or image['thumbnail_url'].startswith('https://')):
                    image['thumbnail_url'] = request.build_absolute_uri(image['thumbnail_url'])
                    
        # Also ensure primary_image URLs are properly formed
        if response_data.get('primary_image'):
            primary = response_data['primary_image']
            if primary.get('image_url') and not (primary['image_url'].startswith('http://') or primary['image_url'].startswith('https://')):
                primary['image_url'] = request.build_absolute_uri(primary['image_url'])
            if primary.get('thumbnail_url') and not (primary['thumbnail_url'].startswith('http://') or primary['thumbnail_url'].startswith('https://')):
                primary['thumbnail_url'] = request.build_absolute_uri(primary['thumbnail_url'])
        
        return Response(response_data)
    except TireListing.DoesNotExist:
        return Response(
            {'error': 'Listing not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
# marketplace/views.py

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversations(request):
    """Get list of users the current user has chatted with"""
    user = request.user
    
    # Get unique users from both sent and received messages
    conversations = Message.objects.filter(
        Q(sender=user) | Q(receiver=user)
    ).values(
        'sender', 'receiver'
    ).distinct()
    
    # Get unique user IDs excluding the current user
    user_ids = set()
    for conv in conversations:
        user_ids.add(conv['sender'] if conv['sender'] != user.id else conv['receiver'])
    
    # Get user details and last message for each conversation
    conversation_data = []
    for other_user_id in user_ids:
        other_user = User.objects.get(id=other_user_id)
        last_message = Message.objects.filter(
            (Q(sender=user) & Q(receiver=other_user)) |
            (Q(sender=other_user) & Q(receiver=user))
        ).order_by('-created_at').first()
        
        unread_count = Message.objects.filter(
            sender=other_user,
            receiver=user,
            is_read=False
        ).count()
        
        conversation_data.append({
            'user': {
                'id': str(other_user.id),
                'username': other_user.username,
                'profile_image_url': other_user.profile_image_url
            },
            'last_message': {
                'content': last_message.content,
                'created_at': last_message.created_at,
                'is_read': last_message.is_read
            },
            'unread_count': unread_count
        })
    
    return Response(conversation_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request, user_id):
    """Get chat history between current user and specified user"""
    try:
        other_user = User.objects.get(id=user_id)
        messages = Message.objects.filter(
            (Q(sender=request.user) & Q(receiver=other_user)) |
            (Q(sender=other_user) & Q(receiver=request.user))
        ).order_by('created_at')
        
        # Mark messages as read
        messages.filter(receiver=request.user, is_read=False).update(is_read=True)
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    """Send a new message"""
    receiver_id = request.data.get('receiver')
    content = request.data.get('content')
    
    try:
        receiver = User.objects.get(id=receiver_id)
        message = Message.objects.create(
            sender=request.user,
            receiver=receiver,
            content=content
        )
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response(
            {'error': 'Receiver not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_messages_read(request, user_id):
    """Mark all messages from a specific user as read"""
    try:
        other_user = User.objects.get(id=user_id)
        Message.objects.filter(
            sender=other_user,
            receiver=request.user,
            is_read=False
        ).update(is_read=True)
        return Response({'status': 'Messages marked as read'})
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

# Admin Views
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_dashboard_stats(request):
    """Get overall statistics for admin dashboard"""
    try:
        # Calculate the date 30 days ago
        thirty_days_ago = timezone.now() - timedelta(days=30)
        
        # User statistics
        total_users = User.objects.count()
        active_users = User.objects.filter(last_login__gte=thirty_days_ago).count()
        new_users = User.objects.filter(date_joined__gte=thirty_days_ago).count()
        
        # Marketplace Activity Metrics
        active_listings = TireListing.objects.count()
        total_messages = Message.objects.filter(created_at__gte=thirty_days_ago).count()
        total_reviews = Review.objects.filter(created_at__gte=thirty_days_ago).count()
        
        # Business vs Individual User Metrics
        business_users = User.objects.filter(is_business=True)
        individual_users = User.objects.filter(is_business=False)
        
        # Calculate average ratings
        business_rating = business_users.aggregate(Avg('rating'))['rating__avg'] or 0
        individual_rating = individual_users.aggregate(Avg('rating'))['rating__avg'] or 0
        
        return Response({
            'user_stats': {
                'total_users': total_users,
                'active_users': active_users,
                'new_users': new_users
            },
            'marketplace_activity': {
                'active_listings': active_listings,
                'total_messages': total_messages,
                'total_reviews': total_reviews,
                'new_users': new_users
            },
            'seller_performance': {
                'business': {
                    'total_users': business_users.count(),
                    'average_rating': round(business_rating, 2)
                },
                'individual': {
                    'total_users': individual_users.count(),
                    'average_rating': round(individual_rating, 2)
                }
            }
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_user_list(request):
    """Get paginated list of users with filters"""
    try:
        # Get filter parameters
        search = request.GET.get('search', '')
        status_filter = request.GET.get('status')
        date_filter = request.GET.get('date')
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 50))
        
        # Base queryset
        users = User.objects.all()
        
        # Apply filters
        if search:
            users = users.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search)
            )
        
        if status_filter:
            if status_filter == 'approved':
                users = users.filter(is_active=True, is_suspended=False, is_banned=False)
            elif status_filter == 'suspended':
                users = users.filter(is_suspended=True)
            elif status_filter == 'banned':
                users = users.filter(is_banned=True)
        
        if date_filter:
            days = int(date_filter)
            date_threshold = timezone.now() - timedelta(days=days)
            users = users.filter(date_joined__gte=date_threshold)
        
        # Calculate pagination
        total_count = users.count()
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        
        # Get paginated results
        paginated_users = users[start_idx:end_idx]
        
        # Serialize the results
        user_data = []
        for user in paginated_users:
            # Determine status
            if user.is_banned:
                status = 'banned'
            elif user.is_suspended:
                status = 'suspended'
            else:
                status = 'approved' if user.is_active else 'banned'
                
            user_data.append({
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'date_joined': user.date_joined,
                'last_login': user.last_login,
                'is_business': user.is_business,
                'status': status,
                'profile_image_url': user.profile_image_url,
                'suspended_at': user.suspended_at,
                'banned_at': user.banned_at
            })
        
        return Response({
            'count': total_count,
            'results': user_data
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_update_user_status(request, user_id):
    """Update user status (approve, suspend, ban)"""
    try:
        user = User.objects.get(id=user_id)
        action = request.data.get('action')
        
        if action not in ['approve', 'suspend', 'ban']:
            return Response(
                {'error': 'Invalid action'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        now = timezone.now()
        
        if action == 'approve':
            user.is_active = True
            user.is_suspended = False
            user.suspended_at = None
            user.is_banned = False
            user.banned_at = None
        elif action == 'suspend':
            user.is_active = False
            user.is_suspended = True
            user.suspended_at = now
            # Keep banned status as is
        elif action == 'ban':
            user.is_active = False
            user.is_banned = True
            user.banned_at = now
            # Also set suspended to False as banned takes precedence
            user.is_suspended = False
            user.suspended_at = None
        
        user.save()
        
        return Response({
            'message': f'User {action}ed successfully',
            'status': action,
            'user': {
                'id': str(user.id),
                'username': user.username,
                'is_active': user.is_active,
                'is_suspended': user.is_suspended,
                'suspended_at': user.suspended_at,
                'is_banned': user.is_banned,
                'banned_at': user.banned_at
            }
        })
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_listing_list(request):
    """Get paginated list of listings with filters"""
    try:
        # Get filter parameters
        search = request.GET.get('search', '')
        status_filter = request.GET.get('status')
        category_filter = request.GET.get('category')
        date_filter = request.GET.get('date')
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 50))
        
        # Base queryset
        listings = TireListing.objects.select_related('seller')
        
        # Apply filters
        if search:
            listings = listings.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(seller__username__icontains=search)
            )
        
        if status_filter:
            if status_filter == 'promoted':
                listings = listings.filter(is_promoted=True)
            elif status_filter == 'active':
                listings = listings.filter(created_at__gte=timezone.now() - timedelta(days=30))
        
        if category_filter:
            listings = listings.filter(tire_type=category_filter)
        
        if date_filter:
            days = int(date_filter)
            date_threshold = timezone.now() - timedelta(days=days)
            listings = listings.filter(created_at__gte=date_threshold)
        
        # Calculate pagination
        total_count = listings.count()
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        
        # Get paginated results
        paginated_listings = listings[start_idx:end_idx]
        
        # Serialize the results
        listing_data = []
        for listing in paginated_listings:
            listing_data.append({
                'id': str(listing.id),
                'title': listing.title,
                'seller': {
                    'id': str(listing.seller.id),
                    'username': listing.seller.username,
                    'email': listing.seller.email,
                    'profile_image_url': listing.seller.profile_image_url
                },
                'price': str(listing.price),
                'created_at': listing.created_at,
                'is_promoted': listing.is_promoted,
                'is_active': listing.is_active,
                'tire_type': listing.tire_type,
                'condition': listing.condition
            })
        
        return Response({
            'count': total_count,
            'results': listing_data
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_update_listing(request, listing_id):
    """Update listing status (promote, unlist, reactivate)"""
    try:
        listing = TireListing.objects.get(id=listing_id)
        action = request.data.get('action')
        
        if action not in ['promote', 'unlist', 'reactivate']:
            return Response(
                {'error': 'Invalid action'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if action == 'promote':
            duration = request.data.get('duration', 30)  # Default 30 days promotion
            listing.is_promoted = True
            listing.promotion_end_date = timezone.now() + timedelta(days=duration)
        elif action == 'unlist':
            listing.is_active = False
        elif action == 'reactivate':
            listing.is_active = True
        
        listing.save()
        
        return Response({
            'message': f'Listing {action}ed successfully',
            'status': action
        })
    except TireListing.DoesNotExist:
        return Response(
            {'error': 'Listing not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Add a middleware to update last_login on each authenticated request
class UpdateLastActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Update last_login if user is authenticated
        if request.user.is_authenticated:
            # Use cache to prevent too frequent updates
            cache_key = f'last_login_update_{request.user.id}'
            last_update = cache.get(cache_key)
            
            # Only update if more than 5 minutes have passed since last update
            if not last_update:
                request.user.last_login = timezone.now()
                request.user.save(update_fields=['last_login'])
                cache.set(cache_key, True, 300)  # Cache for 5 minutes
                
        return response

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def create_user_review(request, user_id):
    """
    GET: Get reviews for a user (no authentication required)
    POST: Create a review for a user (authentication required)
    """
    try:
        reviewed_user = get_object_or_404(User, id=user_id)
        
        if request.method == 'GET':
            # Override permission for GET requests
            if not request.user.is_authenticated:
                request.user = None
            
            reviews = Review.objects.filter(reviewed_user=reviewed_user).select_related('reviewer')
            reviews_data = [{
                'id': str(review.id),
                'rating': review.rating,
                'comment': review.comment,
                'created_at': review.created_at,
                'reviewer': {
                    'id': str(review.reviewer.id),
                    'username': review.reviewer.username,
                    'profile_image_url': review.reviewer.profile_image_url if review.reviewer.profile_image_url else None
                }
            } for review in reviews]
            
            return Response({
                'reviews': reviews_data,
                'average_rating': float(reviewed_user.rating),
                'total_reviews': len(reviews_data)
            })
        
        elif request.method == 'POST':
            if request.user == reviewed_user:
                return Response(
                    {'error': 'You cannot review yourself'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            existing_review = Review.objects.filter(
                reviewer=request.user, 
                reviewed_user=reviewed_user
            ).first()
            
            if existing_review:
                return Response(
                    {'error': 'You have already reviewed this user'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            rating = request.data.get('rating')
            if not rating or not isinstance(rating, (int, float)) or rating < 1 or rating > 5:
                return Response(
                    {'error': 'Rating must be a number between 1 and 5'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            review = Review.objects.create(
                reviewer=request.user,
                reviewed_user=reviewed_user,
                rating=int(rating),
                comment=request.data.get('comment', '')
            )
            
            # Update user's average rating
            reviewed_user.rating = reviewed_user.get_average_rating()
            reviewed_user.save()
            
            return Response({
                'id': str(review.id),
                'rating': review.rating,
                'comment': review.comment,
                'created_at': review.created_at,
                'reviewer': {
                    'id': str(request.user.id),
                    'username': request.user.username,
                    'profile_image_url': request.user.profile_image_url
                }
            }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        print(f"Error in create_user_review: {str(e)}")  # Add logging
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_user_review(request, review_id):
    try:
        review = get_object_or_404(Review, id=review_id)
        
        # Check if the user owns this review
        if review.reviewer != request.user:
            return Response({'error': 'You can only modify your own reviews'}, status=status.HTTP_403_FORBIDDEN)
        
        if request.method == 'PUT':
            # Validate rating
            rating = request.data.get('rating')
            if not rating or not isinstance(rating, int) or rating < 1 or rating > 5:
                return Response({'error': 'Rating must be a number between 1 and 5'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Update review
            review.rating = rating
            review.comment = request.data.get('comment', review.comment)
            review.save()
            
        else:  # DELETE request
            review.delete()
        
        # Update user's average rating
        reviewed_user = review.reviewed_user
        reviewed_user.rating = reviewed_user.get_average_rating()
        reviewed_user.save()
        
        if request.method == 'PUT':
            return Response({
                'id': review.id,
                'rating': review.rating,
                'comment': review.comment,
                'created_at': review.created_at,
                'reviewer': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'profile_image_url': request.user.profile_image_url
                }
            })
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_tire_widths(request):
    widths = TireListing.objects.values_list('width', flat=True).distinct().order_by('width')
    return Response({'widths': list(widths)})

@api_view(['GET'])
def get_tire_aspect_ratios(request):
    width = request.GET.get('width')
    if not width:
        return Response({'error': 'Width parameter is required.'}, status=400)
    aspect_ratios = TireListing.objects.filter(width=width).values_list('aspect_ratio', flat=True).distinct().order_by('aspect_ratio')
    return Response({'aspect_ratios': list(aspect_ratios)})

@api_view(['GET'])
def get_tire_diameters(request):
    width = request.GET.get('width')
    aspect_ratio = request.GET.get('aspect_ratio')
    if not width or not aspect_ratio:
        return Response({'error': 'Width and aspect_ratio parameters are required.'}, status=400)
    diameters = TireListing.objects.filter(width=width, aspect_ratio=aspect_ratio).values_list('diameter', flat=True).distinct().order_by('diameter')
    return Response({'diameters': list(diameters)})

@api_view(['GET'])
def get_speed_ratings(request):
    """Get all unique speed ratings from the database"""
    speed_ratings = TireListing.objects.values_list('speed_rating', flat=True).distinct().exclude(speed_rating__isnull=True).exclude(speed_rating__exact='').order_by('speed_rating')
    return Response({'speed_ratings': list(speed_ratings)})

@api_view(['GET'])
def get_load_indices(request):
    """Get all unique load indices from the database"""
    load_indices = TireListing.objects.values_list('load_index', flat=True).distinct().exclude(load_index__isnull=True).order_by('load_index')
    return Response({'load_indices': list(load_indices)})

@api_view(['GET'])
def get_user_profile(request, user_id):
    """
    Get complete profile data for any user by their ID.
    
    All profile information is public and accessible to everyone,
    including contact details and business information.
    """
    try:
        # Get the user
        user = get_object_or_404(User, id=user_id)
        
        # Create complete profile data with all fields
        profile_data = {
            'id': str(user.id),
            'username': user.username,
            'profile_image_url': user.profile_image_url,
            'rating': float(user.rating),
            'is_business': user.is_business,
            'date_joined': user.date_joined.isoformat() if user.date_joined else None,
            'phone': user.phone,
            'email': user.email,
        }
        
        # Get user review count
        review_count = Review.objects.filter(reviewed_user=user).count()
        profile_data['total_reviews'] = review_count
        
        # If the user is a business, add business profile data
        if user.is_business:
            try:
                business_profile = BusinessProfile.objects.get(user=user)
                
                # Add business profile data
                profile_data['shop_name'] = business_profile.shop_name
                profile_data['shop_address'] = business_profile.address
                profile_data['services'] = business_profile.services
                
                # Process business hours
                business_hours = business_profile.business_hours
                if isinstance(business_hours, str):
                    try:
                        import json
                        business_hours = json.loads(business_hours)
                    except json.JSONDecodeError:
                        business_hours = {}
                
                profile_data['business_hours'] = business_hours
                
            except BusinessProfile.DoesNotExist:
                # User is marked as business but doesn't have a business profile
                profile_data['services'] = []
                profile_data['business_hours'] = {}
                profile_data['shop_name'] = None
                profile_data['shop_address'] = None
        
        return Response(profile_data)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_listing_info(request):
    """Get information about a user's listings and limits"""
    user = request.user
    user_listings_count = TireListing.objects.filter(seller=user).count()
    
    # Different limits based on user type
    if user.is_business:
        listings_limit = None  # Unlimited for business users
    else:
        listings_limit = 5  # Limit for regular users
    
    return Response({
        'total_listings': user_listings_count,
        'listings_limit': listings_limit,
        'can_create_more': listings_limit is None or user_listings_count < listings_limit,
        'remaining': None if listings_limit is None else (listings_limit - user_listings_count)
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_services_list(request):
    """
    Get list of all unique services offered by businesses
    """
    try:
        # Get all business profiles with services
        business_profiles = BusinessProfile.objects.exclude(services__isnull=True).exclude(services=[])
        
        # Collect all unique services
        all_services = set()
        
        for profile in business_profiles:
            services = profile.services
            if isinstance(services, list):
                for service in services:
                    if service and service.strip():  # Avoid empty strings
                        all_services.add(service.strip())
        
        # Convert to sorted list for consistent ordering
        services_list = sorted(list(all_services))
        
        return Response({
            'services': services_list,
            'count': len(services_list)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Failed to fetch services',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def shops_list(request):
    """
    Get list of all shops (business profiles) with filtering support
    """
    try:
        # Get filter parameters
        services = request.GET.getlist('services')
        rating_min = request.GET.get('rating_min')
        operating_hours = request.GET.getlist('operating_hours')
        search = request.GET.get('search')
        
        # Get all business profiles with related user data
        business_profiles = BusinessProfile.objects.select_related('user').all()
        
        # Apply filters
        filtered_profiles = []
        
        for profile in business_profiles:
            user = profile.user
            
            # Calculate average rating and review count
            reviews = Review.objects.filter(reviewed_user=user)
            avg_rating = reviews.aggregate(models.Avg('rating'))['rating__avg'] or 0.0
            review_count = reviews.count()
            
            # Apply rating filter
            if rating_min and avg_rating < float(rating_min):
                continue
            
            # Apply services filter
            if services:
                profile_services = profile.services if profile.services else []
                if not any(service in profile_services for service in services):
                    continue
            
            # Apply operating hours filter
            if operating_hours:
                business_hours = profile.business_hours
                if isinstance(business_hours, str):
                    try:
                        import json
                        business_hours = json.loads(business_hours)
                    except json.JSONDecodeError:
                        business_hours = {}
                
                hours_match = False
                current_time = timezone.now()
                
                for hours_filter in operating_hours:
                    if hours_filter == 'open_now':
                        # Check if currently open (simplified logic)
                        current_day = current_time.strftime('%A').lower()
                        current_hour = current_time.hour
                        
                        if isinstance(business_hours, dict) and current_day in business_hours:
                            day_hours = business_hours[current_day]
                            if isinstance(day_hours, dict) and day_hours.get('isOpen'):
                                # Simple hour check (you might want to improve this)
                                hours_match = True
                                break
                    
                    elif hours_filter == 'open_weekends':
                        # Check if open on Saturday or Sunday
                        if isinstance(business_hours, dict):
                            weekend_open = (
                                business_hours.get('saturday', {}).get('isOpen', False) or
                                business_hours.get('sunday', {}).get('isOpen', False)
                            )
                            if weekend_open:
                                hours_match = True
                                break
                    
                    elif hours_filter == 'open_late':
                        # Check if open after 6 PM any day
                        if isinstance(business_hours, dict):
                            for day_hours in business_hours.values():
                                if isinstance(day_hours, dict) and day_hours.get('isOpen'):
                                    to_time = day_hours.get('to', '')
                                    if to_time and ('PM' in to_time or 'pm' in to_time):
                                        try:
                                            hour = int(to_time.split(':')[0])
                                            if 'PM' in to_time and hour >= 6:
                                                hours_match = True
                                                break
                                        except (ValueError, IndexError):
                                            continue
                    
                    elif hours_filter == 'open_early':
                        # Check if open before 8 AM any day
                        if isinstance(business_hours, dict):
                            for day_hours in business_hours.values():
                                if isinstance(day_hours, dict) and day_hours.get('isOpen'):
                                    from_time = day_hours.get('from', '')
                                    if from_time and ('AM' in from_time or 'am' in from_time):
                                        try:
                                            hour = int(from_time.split(':')[0])
                                            if hour < 8:
                                                hours_match = True
                                                break
                                        except (ValueError, IndexError):
                                            continue
                    
                    elif hours_filter == '24_7':
                        # Check if any indication of 24/7 service
                        business_hours_str = str(business_hours).lower()
                        if '24' in business_hours_str or 'always' in business_hours_str:
                            hours_match = True
                            break
                    
                    elif hours_filter == 'extended_hours':
                        # Check if open more than 10 hours any day
                        if isinstance(business_hours, dict):
                            for day_hours in business_hours.values():
                                if isinstance(day_hours, dict) and day_hours.get('isOpen'):
                                    from_time = day_hours.get('from', '')
                                    to_time = day_hours.get('to', '')
                                    # Simplified check - you might want to improve this
                                    if from_time and to_time:
                                        hours_match = True
                                        break
                
                if not hours_match:
                    continue
            
            # Apply search filter
            if search:
                search_lower = search.lower()
                searchable_text = ' '.join([
                    profile.shop_name or '',
                    profile.address or '',
                    user.username or '',
                    ' '.join(profile.services if profile.services else [])
                ]).lower()
                
                if search_lower not in searchable_text:
                    continue
            
            # Format the shop data
            shop_data = {
                'id': str(profile.id),
                'user_id': str(user.id),  # Add user ID for profile navigation
                'name': profile.shop_name,
                'business_type': 'tire_shop',  # Default as requested
                'address': profile.address,  # Single address field only
                'phone': user.phone or '',
                'rating': round(float(avg_rating), 1),
                'review_count': review_count,
                'services': profile.services if profile.services else [],
                'operating_hours': profile.business_hours,
                'image_url': user.profile_image_url,
                'is_featured': profile.subscription_active  # Use subscription status for featured
            }
            
            filtered_profiles.append(shop_data)
        
        return Response({
            'results': filtered_profiles,
            'count': len(filtered_profiles)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Failed to fetch shops',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    