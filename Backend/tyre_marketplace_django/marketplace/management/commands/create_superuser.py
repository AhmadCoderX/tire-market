from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a Django superuser for admin access'

    def add_arguments(self, parser):
        parser.add_argument(
            '--username',
            type=str,
            default='admin',
            help='Username for the superuser (default: admin)'
        )
        parser.add_argument(
            '--email',
            type=str,
            default='admin@tiremarket.com',
            help='Email for the superuser (default: admin@tiremarket.com)'
        )
        parser.add_argument(
            '--password',
            type=str,
            default='admin123',
            help='Password for the superuser (default: admin123)'
        )

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']
        
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'User with username "{username}" already exists!')
            )
            return
        
        try:
            superuser = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                first_name='Admin',
                last_name='User',
                phone='+1234567890',
                is_business=True
            )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created superuser:\n'
                    f'Username: {username}\n'
                    f'Email: {email}\n'
                    f'Password: {password}\n\n'
                    f'You can now login to the admin dashboard at: http://localhost:6000/admin/'
                )
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating superuser: {e}')
            )
