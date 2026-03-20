# Django Backend API Documentation

## Overview
This document describes Django REST API endpoints implemented for the BookShell project.

## Base URL
```
http://localhost:8000/api/
```

## Authentication
All endpoints except public ones require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 1. Categories API (`/api/categories/`)

### Endpoints:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories/` | List all categories (with filtering) | No |
| POST | `/api/categories/create/` | Create new category | Yes |
| GET | `/api/categories/tree/` | Get hierarchical category tree | No |
| GET | `/api/categories/featured/` | Get featured categories | No |
| GET | `/api/categories/type/<str:category_type>/` | Get categories by type | No |
| GET | `/api/categories/<uuid:pk>/` | Get category details | No |
| PUT | `/api/categories/<uuid:pk>/update/` | Update category | Yes |
| DELETE | `/api/categories/<uuid:pk>/delete/` | Delete category (soft delete) | Yes |
| GET | `/api/categories/<uuid:category_id>/images/` | Get category images | Yes |
| POST | `/api/categories/<uuid:category_id>/images/` | Add category image | Yes |
| GET | `/api/categories/images/<uuid:pk>/` | Get image details | Yes |
| PUT | `/api/categories/images/<uuid:pk>/` | Update image | Yes |
| DELETE | `/api/categories/images/<uuid:pk>/` | Delete image | Yes |
| POST | `/api/categories/<uuid:category_id>/images/<uuid:image_id>/set-primary/` | Set primary image | Yes |

### Query Parameters for List View:
- `type` - Filter by category type (BOOK, AUDIOBOOK, BOTH)
- `parent` - Filter by parent category
- `search` - Search in name and description
- `ordering` - Order by sort_order, name, created_at

### Category Types:
- `BOOK` - For physical books only
- `AUDIOBOOK` - For audiobooks only
- `BOTH` - For both books and audiobooks

### Category Fields:
- `name` - Category name (unique)
- `description` - Category description
- `type` - BOOK, AUDIOBOOK, or BOTH
- `parent` - Parent category (for hierarchical structure)
- `icon` - Icon URL
- `color` - Hex color code
- `is_active` - Whether category is active
- `is_featured` - Whether category is featured
- `sort_order` - Display order

## 2. Notifications API (`/api/notifications/`)

### Endpoints:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications/` | Get user's notifications | Yes |
| POST | `/api/notifications/create/` | Create a new notification | Yes |
| GET | `/api/notifications/unread-count/` | Get unread notification count | Yes |
| POST | `/api/notifications/mark-all-read/` | Mark all notifications as read | Yes |
| POST | `/api/notifications/<uuid:notification_id>/mark-read/` | Mark specific notification as read | Yes |
| GET | `/api/notifications/<uuid:pk>/` | Get specific notification details | Yes |
| PUT | `/api/notifications/<uuid:pk>/` | Update notification | Yes |

### Notification Types:
- `LIKE` - When a post/book is liked
- `COMMENT` - When a comment is made
- `FOLLOW` - When someone follows the user
- `PURCHASE` - When a book is purchased
- `MESSAGE` - When a message is received
- `SYSTEM` - System notifications

## 3. Audiobooks API (`/api/audiobooks/`)

### Endpoints:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/audiobooks/` | List all audiobooks (with filtering) | No |
| POST | `/api/audiobooks/create/` | Create new audiobook | Yes |
| GET | `/api/audiobooks/featured/` | Get featured audiobooks | No |
| GET | `/api/audiobooks/my-audiobooks/` | Get user's audiobooks | Yes |
| GET | `/api/audiobooks/<uuid:pk>/` | Get audiobook details | No |
| PUT | `/api/audiobooks/<uuid:pk>/update/` | Update audiobook | Yes |
| DELETE | `/api/audiobooks/<uuid:pk>/delete/` | Delete audiobook | Yes |
| GET | `/api/audiobooks/<uuid:audiobook_id>/progress/` | Get user's progress | Yes |
| PUT | `/api/audiobooks/<uuid:audiobook_id>/progress/` | Update progress | Yes |
| POST | `/api/audiobooks/<uuid:audiobook_id>/play/` | Record play action | Yes |
| GET | `/api/audiobooks/<uuid:audiobook_id>/ratings/` | Get audiobook ratings | No |
| POST | `/api/audiobooks/<uuid:audiobook_id>/ratings/create/` | Create rating | Yes |

### Query Parameters for List View:
- `genre` - Filter by genre
- `language` - Filter by language
- `is_free` - Filter by free status
- `is_premium` - Filter by premium status
- `search` - Search in title, author, narrator
- `ordering` - Order by created_at, title, author, average_rating, price

### Audiobook Genres:
- FICTION, NON_FICTION, BIOGRAPHY, BUSINESS, SELF_HELP
- ROMANCE, THRILLER, SCIFI, FANTASY, HISTORY
- EDUCATION, CHILDREN

### Languages:
- EN (English), FR (French), AR (Arabic), SW (Swahili)
- HA (Hausa), YO (Yoruba), IG (Igbo), ZH (Chinese)
- ES (Spanish), PT (Portuguese)

## 5. Wallet API (`/api/wallet/`)

### Endpoints:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/wallet/` | Get user's wallet details | Yes |
| GET | `/api/wallet/balance/` | Get user's wallet balance only | Yes |
| GET | `/api/wallet/stats/` | Get wallet statistics | Yes |
| GET | `/api/wallet/transactions/` | Get transaction history | Yes |
| GET | `/api/wallet/transactions/<uuid:pk>/` | Get specific transaction | Yes |
| POST | `/api/wallet/deposit/` | Deposit funds to wallet | Yes |
| POST | `/api/wallet/pay/` | Make payment for books/audiobooks | Yes |
| GET | `/api/wallet/payment-methods/` | Get user's payment methods | Yes |
| POST | `/api/wallet/payment-methods/create/` | Add new payment method | Yes |
| GET | `/api/wallet/payment-methods/<uuid:pk>/` | Get payment method details | Yes |
| PUT | `/api/wallet/payment-methods/<uuid:pk>/` | Update payment method | Yes |
| DELETE | `/api/wallet/payment-methods/<uuid:pk>/` | Delete payment method | Yes |
| GET | `/api/wallet/withdrawals/` | Get withdrawal requests | Yes |
| POST | `/api/wallet/withdrawals/create/` | Create withdrawal request | Yes |
| GET | `/api/wallet/admin/withdrawals/` | Admin: Get all withdrawal requests | Admin |
| POST | `/api/wallet/admin/withdrawals/<uuid:withdrawal_id>/process/` | Admin: Process withdrawal | Admin |

### Query Parameters for Transaction List:
- `type` - Filter by transaction type (DEPOSIT, WITHDRAWAL, PAYMENT, REFUND, COMMISSION, BONUS)
- `status` - Filter by status (PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED)
- `search` - Search in reference, description, external_reference
- `ordering` - Order by created_at, amount

### Transaction Types:
- `DEPOSIT` - Adding funds to wallet
- `WITHDRAWAL` - Removing funds from wallet
- `PAYMENT` - Purchasing books/audiobooks
- `REFUND` - Refunding purchases
- `COMMISSION` - Platform commission (5% for sellers)
- `BONUS` - Bonus credits

### Payment Method Types:
- `MOBILE_MONEY` - Mobile money (MTN, Moov, Orange, Airtel)
- `BANK_TRANSFER` - Bank transfer
- `CREDIT_CARD` - Credit/Debit cards

### Mobile Money Providers:
- `MTN` - MTN Mobile Money
- `MOOV` - Moov Money
- `ORANGE` - Orange Money
- `AIRTEL` - Airtel Money

### Withdrawal Process:
1. User creates withdrawal request
2. Admin reviews and approves/rejects
3. If approved, funds are deducted from wallet
4. Minimum withdrawal: 100 XOF

### Commission Structure:
- **Sellers**: 5% commission on all sales
- **Buyers**: No commission on purchases

### Security Features:
- All operations require authentication
- Users can only access their own wallet
- Withdrawal requests require admin approval
- Transaction history with detailed tracking

## 6. Books API (`/api/books/`)

### Endpoints:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/books/` | List all available books (with filtering) | No |
| POST | `/api/books/create/` | Create new book listing | Yes |
| GET | `/api/books/featured/` | Get featured books | No |
| GET | `/api/books/my-books/` | Get user's book listings | Yes |
| GET | `/api/books/<uuid:pk>/` | Get book details | No |
| PUT | `/api/books/<uuid:pk>/update/` | Update book listing | Yes |
| DELETE | `/api/books/<uuid:pk>/delete/` | Delete book listing | Yes |
| GET | `/api/books/favorites/` | Get user's favorite books | Yes |
| POST | `/api/books/<uuid:book_id>/favorite/` | Add book to favorites | Yes |
| DELETE | `/api/books/<uuid:book_id>/unfavorite/` | Remove from favorites | Yes |
| GET | `/api/books/inquiries/` | Get book inquiries | Yes |
| POST | `/api/books/inquiries/create/` | Create book inquiry | Yes |
| PUT | `/api/books/inquiries/<uuid:pk>/respond/` | Respond to inquiry | Yes |
| GET | `/api/books/<uuid:book_id>/ratings/` | Get book ratings | No |
| POST | `/api/books/<uuid:book_id>/ratings/create/` | Create book rating | Yes |

### Query Parameters for List View:
- `genre` - Filter by genre
- `language` - Filter by language
- `condition` - Filter by condition
- `is_featured` - Filter featured books
- `is_verified` - Filter verified books
- `search` - Search in title, author, publisher, description
- `ordering` - Order by created_at, title, author, price, view_count, favorite_count

### Book Conditions:
- NEW, LIKE_NEW, VERY_GOOD, GOOD, ACCEPTABLE, POOR

### Book Genres:
- FICTION, NON_FICTION, BIOGRAPHY, BUSINESS, SELF_HELP
- ROMANCE, THRILLER, SCIFI, FANTASY, HISTORY
- EDUCATION, CHILDREN, ACADEMIC, RELIGIOUS, COMICS

### Book Status:
- AVAILABLE, SOLD, RESERVED, PENDING, REMOVED

## Response Format

### Success Response (200/201):
```json
{
    "id": "uuid",
    "title": "Book Title",
    "author": "Author Name",
    // ... other fields
}
```

### Error Response (400/401/404/500):
```json
{
    "error": "Error message",
    "details": "Additional error details"
}
```

### List Response:
```json
{
    "count": 10,
    "next": "http://localhost:8000/api/books/?page=2",
    "previous": null,
    "results": [
        // ... book objects
    ]
}
```

## Features Implemented

### Categories:
- Hierarchical category structure (parent-child relationships)
- Category types (BOOK, AUDIOBOOK, BOTH)
- Category images with primary image support
- Featured categories
- Soft delete functionality
- Color and icon customization

### Notifications:
- User-specific notifications
- Mark as read/unread functionality
- Unread count tracking
- Multiple notification types

### Audiobooks:
- Full CRUD operations
- Progress tracking per user
- Rating system
- Play statistics
- Genre and language filtering
- Search functionality
- Featured audiobooks

### Books:
- Marketplace functionality
- Book condition tracking
- Seller information
- Favorites system
- Inquiry system for buyer-seller communication
- Rating and review system
- View and inquiry statistics
- Shipping and pickup options
- Featured books

## Security Features
- JWT authentication for protected endpoints
- User-specific data filtering
- Seller permissions for their own listings
- CORS enabled for frontend integration

## Database Models Created
1. **Categories**: Category, CategoryImage
2. **Notifications**: Notification, Notification types
3. **Audiobooks**: Audiobook, AudiobookProgress, AudiobookRating
4. **Books**: Book, BookFavorite, BookInquiry, BookRating
5. **Wallet**: Wallet, Transaction, PaymentMethod, WithdrawalRequest

## Testing
Run test script to verify all endpoints:
```bash
cd django_backend
source venv/bin/activate
python3 test_endpoints.py
python3 test_wallet.py
```

## Migration Status
All migrations have been successfully applied:
- ✅ categories.0001_initial
- ✅ notifications.0001_initial
- ✅ audiobooks.0001_initial  
- ✅ books.0001_initial
- ✅ wallet.0001_initial

## Sample Data
Sample categories have been created with:
- 12 categories total
- Hierarchical structure (parent-child relationships)
- Category types (BOOK, AUDIOBOOK, BOTH)
- Sample images
- Featured categories
- Color coding
