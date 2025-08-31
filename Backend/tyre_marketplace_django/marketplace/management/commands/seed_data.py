from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal
import random
from datetime import timedelta

from marketplace.models import User, TireListing, Review, BusinessProfile, ListingImage

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed the database with test data for tire marketplace'

    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            type=int,
            default=10,
            help='Number of users to create (default: 10)'
        )
        parser.add_argument(
            '--listings',
            type=int,
            default=50,
            help='Number of tire listings to create (default: 50)'
        )
        parser.add_argument(
            '--reviews',
            type=int,
            default=100,
            help='Number of reviews to create (default: 100)'
        )

    def handle(self, *args, **options):
        self.stdout.write('Starting to seed database...')
        
        # Create users
        users = self.create_users(options['users'])
        
        # Create tire listings
        listings = self.create_tire_listings(users, options['listings'])
        
        # Create reviews
        self.create_reviews(users, listings, options['reviews'])
        
        # Create business profiles for some users
        self.create_business_profiles(users)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully seeded database with {len(users)} users, {len(listings)} listings, and {options["reviews"]} reviews!'
            )
        )

    def create_users(self, num_users):
        """Create test users"""
        users = []
        
        # Create a superuser for admin access
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@tiremarket.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'phone': '+1234567890',
                'is_business': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(f'Created admin user: {admin_user.username}')
        else:
            self.stdout.write(f'Admin user already exists: {admin_user.username}')
        
        users.append(admin_user)
        
        # Create regular users
        for i in range(num_users):
            is_business = random.choice([True, False])
            username = f'user{i+1}'
            
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': f'user{i+1}@example.com',
                    'first_name': f'User{i+1}',
                    'last_name': f'Test{i+1}',
                    'phone': f'+1{random.randint(1000000000, 9999999999)}',
                    'is_business': is_business,
                    'rating': Decimal(str(random.uniform(3.0, 5.0)))
                }
            )
            
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(f'Created user: {user.username} (Business: {is_business})')
            else:
                self.stdout.write(f'User already exists: {user.username}')
            
            users.append(user)
        
        return users

    def create_tire_listings(self, users, num_listings):
        """Create tire listings"""
        listings = []
        
        # Tire data for realistic listings
        tire_brands = ['Michelin', 'Bridgestone', 'Goodyear', 'Continental', 'Pirelli', 'Dunlop', 'Yokohama', 'Hankook', 'BFGoodrich', 'Toyo']
        tire_models = ['Pilot Sport', 'Potenza', 'Eagle', 'ProContact', 'P Zero', 'Sport Maxx', 'Advantage', 'Ventus', 'All-Terrain', 'Proxes']
        
        tire_specs = [
            # width, aspect_ratio, diameter, load_index, speed_rating
            (205, 55, 16, 91, 'V'),
            (215, 55, 17, 98, 'V'),
            (225, 45, 17, 94, 'W'),
            (235, 45, 18, 98, 'W'),
            (245, 40, 18, 97, 'Y'),
            (255, 35, 19, 96, 'Y'),
            (265, 35, 20, 99, 'Y'),
            (275, 40, 19, 101, 'Y'),
            (285, 35, 19, 103, 'Y'),
            (295, 30, 20, 101, 'Y'),
        ]
        
        conditions = ['new', 'used']
        tire_types = ['all_season', 'winter', 'summer', 'performance', 'mud_terrain', 'all_terrain']
        vehicle_types = ['passenger', 'suv', 'truck', 'motorcycle', 'van', 'others']
        
        for i in range(num_listings):
            seller = random.choice(users)
            condition = random.choice(conditions)
            tire_type = random.choice(tire_types)
            vehicle_type = random.choice(vehicle_types)
            brand = random.choice(tire_brands)
            model = random.choice(tire_models)
            width, aspect_ratio, diameter, load_index, speed_rating = random.choice(tire_specs)
            
            # Generate realistic pricing
            if condition == 'new':
                base_price = random.uniform(80, 400)
            else:
                base_price = random.uniform(40, 200)
            
            # Adjust price based on tire type
            if tire_type in ['performance', 'mud_terrain']:
                base_price *= 1.3
            elif tire_type == 'winter':
                base_price *= 1.2
            
            price = Decimal(str(round(base_price, 2)))
            
            listing = TireListing.objects.create(
                seller=seller,
                title=f'{brand} {model} {width}/{aspect_ratio}R{diameter} {condition.title()} Tire',
                description=f'High-quality {condition} {brand} {model} tires. Perfect for {vehicle_type} vehicles. Load index: {load_index}, Speed rating: {speed_rating}.',
                price=price,
                condition=condition,
                tire_type=tire_type,
                vehicle_type=vehicle_type,
                width=width,
                aspect_ratio=aspect_ratio,
                diameter=diameter,
                load_index=load_index,
                speed_rating=speed_rating,
                tread_depth=Decimal(str(random.uniform(2.0, 10.0))),
                brand=brand,
                model=model,
                quantity=random.randint(1, 8),
                mileage=random.randint(0, 50000) if condition == 'used' else None,
                is_promoted=random.choice([True, False]),
                promotion_end_date=timezone.now() + timedelta(days=random.randint(1, 30)) if random.choice([True, False]) else None,
                is_active=True
            )
            
            listings.append(listing)
            self.stdout.write(f'Created listing: {listing.title}')
        
        return listings

    def create_reviews(self, users, listings, num_reviews):
        """Create reviews for users and listings"""
        review_texts = [
            "Great seller, fast shipping!",
            "Tires are in excellent condition as described.",
            "Very professional and responsive.",
            "Quality product, highly recommended!",
            "Good communication throughout the process.",
            "Tires arrived on time and well packaged.",
            "Fair price for the quality received.",
            "Would definitely buy from again.",
            "Excellent service and product quality.",
            "Very satisfied with the purchase.",
            "Tires perform great, exactly as advertised.",
            "Reliable seller with good prices.",
            "Fast response and quick delivery.",
            "Product matches description perfectly.",
            "Great experience overall!",
        ]
        
        for i in range(num_reviews):
            # Randomly choose if this is a user review or listing review
            if random.choice([True, False]):
                # User review
                reviewer = random.choice(users)
                reviewed_user = random.choice([u for u in users if u != reviewer])
                
                if not Review.objects.filter(reviewer=reviewer, reviewed_user=reviewed_user).exists():
                    Review.objects.create(
                        reviewer=reviewer,
                        reviewed_user=reviewed_user,
                        rating=random.randint(1, 5),
                        comment=random.choice(review_texts),
                        created_at=timezone.now() - timedelta(days=random.randint(1, 365))
                    )
            else:
                # Listing review (if you have a listing review model)
                pass

    def create_business_profiles(self, users):
        """Create business profiles for business users"""
        business_users = [user for user in users if user.is_business]
        
        business_names = [
            'Premium Tire Shop',
            'Quick Tire Service',
            'Elite Tire Center',
            'Pro Tire Solutions',
            'Best Tire Store',
            'Quality Tire Hub',
            'Express Tire Service',
            'Reliable Tire Center',
            'Expert Tire Shop',
            'Trusted Tire Solutions'
        ]
        
        services = [
            'Tire Sales',
            'Tire Installation',
            'Wheel Alignment',
            'Tire Balancing',
            'Tire Rotation',
            'Emergency Tire Service',
            'Tire Repair',
            'Wheel Sales',
            'Tire Pressure Monitoring',
            'Seasonal Tire Storage'
        ]
        
        business_hours = {
            'monday': {'open': '08:00', 'close': '18:00'},
            'tuesday': {'open': '08:00', 'close': '18:00'},
            'wednesday': {'open': '08:00', 'close': '18:00'},
            'thursday': {'open': '08:00', 'close': '18:00'},
            'friday': {'open': '08:00', 'close': '18:00'},
            'saturday': {'open': '09:00', 'close': '16:00'},
            'sunday': {'open': 'closed', 'close': 'closed'}
        }
        
        for user in business_users:
            if not hasattr(user, 'business_profile'):
                business_profile = BusinessProfile.objects.create(
                    user=user,
                    shop_name=random.choice(business_names),
                    address=f'{random.randint(100, 9999)} Main St, City, State {random.randint(10000, 99999)}',
                    business_hours=business_hours,
                    services=random.sample(services, random.randint(3, 6)),
                    subscription_active=random.choice([True, False]),
                    subscription_start_date=timezone.now() - timedelta(days=random.randint(1, 365)) if random.choice([True, False]) else None,
                    subscription_end_date=timezone.now() + timedelta(days=random.randint(30, 365)) if random.choice([True, False]) else None
                )
                self.stdout.write(f'Created business profile for: {user.username}')
