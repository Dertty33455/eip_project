# Database Seeders

All seeders have been converted from Laravel PHP to Django Python management commands.

## Available Seeders

1. **Categories Seeder** - Seeds 12 book categories
   - Roman, Littérature Africaine, Business, Développement Personnel, etc.

2. **Users Seeder** - Seeds demo users (admin, sellers, regular users)
   - Creates wallets for each user
   - Sets up verified sellers

3. **Books Seeder** - Seeds ~18 demo books across multiple categories
   - Uses real seller and category data
   - Includes African literature, business, and educational books
   - Books from multiple seeders: BookSeeder, AfricanLiteratureBooksSeeder, BusinessBooksSeeder

4. **Audiobooks Seeder** - Seeds 3 demo audiobooks with chapters
   - Creates audio chapters automatically
   - Covers different categories

5. **Settings Seeder** - Seeds core platform settings
   - Commission rate, currency, withdrawal limits, etc.

6. **Posts Seeder** - Seeds social media posts
   - Reviews, recommendations, and text posts

7. **Subscription Seeder** - Seeds subscription pricing plans
   - Monthly (2,500 XOF)
   - Quarterly (6,000 XOF)
   - Yearly (20,000 XOF)

## Usage

### Run all seeders
```bash
python manage.py seed
```

### Run specific seeder
```bash
python manage.py seed --seeder categories
python manage.py seed --seeder users
python manage.py seed --seeder books
python manage.py seed --seeder audiobooks
python manage.py seed --seeder settings
python manage.py seed --seeder posts
python manage.py seed --seeder subscriptions
```

### Clear and reseed (be careful!)
```bash
python manage.py seed --clear
```

## Demo Accounts

After seeding, you can login with:

### Admin
- Username: `admin`
- Password: `Admin@123`
- Email: `admin@bookshell.com`

### Sellers
- Username: `seller1` / `seller2` / `kofi_mensah` / `chidi_books`
- Password: `Seller123!`

### Regular Users
- Username: `user1` / `user2` / `user3` / `aminata_d`
- Password: `User123!`

## Notes

- Each user gets a wallet created automatically
- All verified sellers are marked as `isVerifiedSeller = True`
- Books are distributed among sellers
- All currencies default to XOF (West African CFA Franc)
- Audiobooks include sample chapters with proper durations
