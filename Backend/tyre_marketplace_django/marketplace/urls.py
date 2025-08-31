from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from rest_framework.documentation import include_docs_urls
from . import views

router = DefaultRouter()
router.register(r'images', views.ListingImageViewSet)
router.register(r'reviews', views.ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.user_profile, name='user-profile'),
    path('profile/business/', views.business_profile, name='business-profile'),
    path('profile/listings-info/', views.get_user_listing_info, name='user-listings-info'),
    path('auth/verify-otp/', views.verify_otp, name='verify-otp'),
    path('auth/resend-otp/', views.resend_otp, name='resend-otp'),
    path('auth/request-reset/', views.request_password_reset, name='request-reset'),
    path('auth/reset-password/', views.reset_password, name='reset-password'),
    path('profile/upload-image/', views.upload_profile_image, name='upload-profile-image'),
    path('listings/search/', views.search_listings, name='search_listings'),
    path('listings/', views.get_listings, name='get_listings'),
    path('listings/create/', views.create_listing, name='create_listing'),
    path('listings/<uuid:listing_id>/', views.update_listing, name='listing-details'),
    path('listings/<uuid:listing_id>/delete/', views.delete_listing, name='delete_listing'),
    path('listings/<uuid:listing_id>/images/', views.upload_listing_images, name='upload_listing_images'),
    path('listings/<uuid:listing_id>/images/<uuid:image_id>/', 
         views.manage_listing_image, 
         name='manage_listing_image'),
    
    # Shops endpoint
    path('shops/', views.shops_list, name='shops-list'),
    path('shops/services/', views.get_services_list, name='get-services-list'),
    
    path('messages/send/', views.send_message, name='send_message'),
    path('messages/conversations/', views.get_conversations, name='get_conversations'),
    path('messages/history/<uuid:user_id>/', views.get_chat_history, name='chat_history'),
    path('messages/read/<uuid:user_id>/', views.mark_messages_read, name='mark_messages_read'),
    
    # User reviews
    path('users/<uuid:user_id>/reviews/', views.create_user_review, name='create-user-review'),
    path('users/<uuid:user_id>/reviews/<uuid:review_id>/', views.manage_user_review, name='manage-user-review'),
    
    # User profile
    path('users/<uuid:user_id>/profile/', views.get_user_profile, name='get-user-profile'),
    
    # Admin endpoints
    path('admin/dashboard/stats/', views.admin_dashboard_stats, name='admin-dashboard-stats'),
    path('admin/users/', views.admin_user_list, name='admin-user-list'),
    path('admin/users/<uuid:user_id>/status/', views.admin_update_user_status, name='admin-update-user-status'),
    path('admin/listings/', views.admin_listing_list, name='admin-listing-list'),
    path('admin/listings/<uuid:listing_id>/update/', views.admin_update_listing, name='admin-update-listing'),
    path('tire-sizes/widths/', views.get_tire_widths, name='tire-widths'),
    path('tire-sizes/aspect-ratios/', views.get_tire_aspect_ratios, name='tire-aspect-ratios'),
    path('tire-sizes/diameters/', views.get_tire_diameters, name='tire-diameters'),
    path('tire-sizes/speed-ratings/', views.get_speed_ratings, name='speed-ratings'),
    path('tire-sizes/load-indices/', views.get_load_indices, name='load-indices'),
] 