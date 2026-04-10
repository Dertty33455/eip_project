from django.contrib.auth import get_user_model
from wallet.models import Wallet

User = get_user_model()


def seed_users():
    """Seed demo users"""
    admin_data = {
        'username': 'admin',
        'email': 'admin@test.com',
        'first_name': 'Admin',
        'last_name': 'User',
        'phone': '+22500000000',
        'role': 'ADMIN',
        'status': 'ACTIVE',
        'isEmailVerified': True,
        'isPhoneVerified': True,
        'bio': 'Administrateur de la plateforme BookShell',
        'location': 'Abidjan, Côte d\'Ivoire',
        'country': 'Côte d\'Ivoire',
    }

    admin, created = User.objects.get_or_create(
        username=admin_data['username'],
        defaults={
            'email': admin_data['email'],
            'first_name': admin_data['first_name'],
            'last_name': admin_data['last_name'],
            'phone': admin_data['phone'],
            'role': admin_data['role'],
            'status': admin_data['status'],
            'isEmailVerified': admin_data['isEmailVerified'],
            'isPhoneVerified': admin_data['isPhoneVerified'],
            'bio': admin_data['bio'],
            'location': admin_data['location'],
            'country': admin_data['country'],
        }
    )
    
    # Always update admin fields (in case admin already existed)
    admin.email = admin_data['email']
    admin.role = admin_data['role']  # Ensure role is ADMIN
    admin.status = admin_data['status']
    admin.isEmailVerified = admin_data['isEmailVerified']
    admin.isPhoneVerified = admin_data['isPhoneVerified']
    
    # Always set password for admin
    admin.set_password('Test123!')
    admin.save()

    # Create wallet for admin
    Wallet.objects.get_or_create(
        user=admin,
        defaults={'balance': 0, 'currency': 'XOF', 'status': 'ACTIVE'}
    )

    # Demo sellers
    sellers = [
        {
            'username': 'seller1',
            'email': 'ahmad.d@example.com',
            'first_name': 'Ahmad',
            'last_name': 'Diop',
            'phone': '+221761234567',
            'role': 'SELLER',
            'status': 'ACTIVE',
        },
        {
            'username': 'seller2',
            'email': 'fatou.b@example.com',
            'first_name': 'Fatou',
            'last_name': 'Ba',
            'phone': '+221781234567',
            'role': 'SELLER',
            'status': 'ACTIVE',
        },
        {
            'username': 'kofi_mensah',
            'email': 'kofi@example.com',
            'first_name': 'Kofi',
            'last_name': 'Mensah',
            'phone': '+22501234567',
            'bio': 'Passionné de littérature africaine et de développement personnel. 📚',
            'location': 'Accra, Ghana',
            'country': 'Ghana',
            'role': 'SELLER',
            'isVerifiedSeller': True,
        },
        {
            'username': 'chidi_books',
            'email': 'chidi@example.com',
            'first_name': 'Chidi',
            'last_name': 'Okonkwo',
            'phone': '+22509876543',
            'bio': 'Libraire passionné, je vends des livres rares et d\'occasion.',
            'location': 'Lagos, Nigeria',
            'country': 'Nigeria',
            'role': 'SELLER',
            'isVerifiedSeller': True,
        },
    ]

    for seller_data in sellers:
        user, _ = User.objects.get_or_create(
            username=seller_data['username'],
            defaults={
                'email': seller_data['email'],
                'first_name': seller_data['first_name'],
                'last_name': seller_data['last_name'],
                'phone': seller_data.get('phone', ''),
                'role': seller_data['role'],
                'status': seller_data.get('status', 'ACTIVE'),
                'bio': seller_data.get('bio', ''),
                'location': seller_data.get('location', ''),
                'country': seller_data.get('country', ''),
                'isVerifiedSeller': seller_data.get('isVerifiedSeller', False),
            }
        )
        user.set_password('Seller123!')
        user.save()

        # Create wallet for seller
        Wallet.objects.get_or_create(
            user=user,
            defaults={'balance': 0, 'currency': 'XOF', 'status': 'ACTIVE'}
        )

    # Demo regular users
    users = [
        {
            'username': 'user1',
            'email': 'moussa.f@example.com',
            'first_name': 'Moussa',
            'last_name': 'Fall',
            'phone': '+221771234568',
            'role': 'USER',
        },
        {
            'username': 'user2',
            'email': 'aminata.s@example.com',
            'first_name': 'Aminata',
            'last_name': 'Sow',
            'phone': '+221761234568',
            'role': 'USER',
        },
        {
            'username': 'user3',
            'email': 'ibrahim.n@example.com',
            'first_name': 'Ibrahim',
            'last_name': 'Ndiaye',
            'phone': '+221781234568',
            'role': 'USER',
        },
        {
            'username': 'aminata_d',
            'email': 'aminata@example.com',
            'first_name': 'Aminata',
            'last_name': 'Diallo',
            'phone': '+22507654321',
            'bio': 'Lectrice avide, j\'aime partager mes découvertes littéraires. ✨',
            'location': 'Dakar, Sénégal',
            'country': 'Sénégal',
            'role': 'USER',
        },
    ]

    for user_data in users:
        user, _ = User.objects.get_or_create(
            username=user_data['username'],
            defaults={
                'email': user_data['email'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'phone': user_data.get('phone', ''),
                'role': user_data.get('role', 'USER'),
                'status': user_data.get('status', 'ACTIVE'),
                'bio': user_data.get('bio', ''),
                'location': user_data.get('location', ''),
                'country': user_data.get('country', ''),
            }
        )
        user.set_password('User123!')
        user.save()

        # Create wallet for user
        Wallet.objects.get_or_create(
            user=user,
            defaults={'balance': 0, 'currency': 'XOF', 'status': 'ACTIVE'}
        )

    print("✓ Seeded users and wallets")
