from django.core.management.base import BaseCommand, CommandError
from django.db import connection

# Import all seeders
from django_seeders.category_seeder import seed_categories
from django_seeders.user_seeder import seed_users
from django_seeders.book_seeder import seed_books
from django_seeders.audiobook_seeder import seed_audiobooks
from django_seeders.settings_seeder import seed_settings
from django_seeders.posts_seeder import seed_posts
from django_seeders.subscription_seeder import seed_subscription_pricing


class Command(BaseCommand):
    help = 'Seed the database with demo data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            dest='clear',
            help='Clear existing data before seeding',
        )
        parser.add_argument(
            '--seeder',
            type=str,
            help='Run a specific seeder (categories, users, books, audiobooks, settings, posts, subscriptions)',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🌱 Starting database seeding...'))

        try:
            if options['clear']:
                self.clear_database()

            seeder = options.get('seeder')

            if seeder == 'categories' or not seeder:
                seed_categories()

            if seeder == 'users' or not seeder:
                seed_users()

            if seeder == 'books' or not seeder:
                seed_books()

            if seeder == 'audiobooks' or not seeder:
                seed_audiobooks()

            if seeder == 'settings' or not seeder:
                seed_settings()

            if seeder == 'posts' or not seeder:
                seed_posts()

            if seeder == 'subscriptions' or not seeder:
                seed_subscription_pricing()

            self.stdout.write(self.style.SUCCESS('✅ Database seeding completed successfully!'))

        except Exception as e:
            raise CommandError(f'Error during seeding: {str(e)}')

    def clear_database(self):
        """Clear existing data"""
        self.stdout.write(self.style.WARNING('🗑️  Clearing existing data...'))

        with connection.cursor() as cursor:
            # Get all table names
            cursor.execute("""
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name NOT LIKE 'sqlite_%'
            """)
            tables = cursor.fetchall()

            # Delete all data from tables (keeping the schema)
            for table in tables:
                table_name = table[0]
                # Skip auth and Django internal tables for safety
                if table_name not in ['auth_user', 'django_session', 'django_migrations']:
                    try:
                        cursor.execute(f'DELETE FROM {table_name}')
                    except Exception:
                        pass  # Skip if table doesn't exist or has issues

        self.stdout.write(self.style.SUCCESS('✓ Database cleared'))
