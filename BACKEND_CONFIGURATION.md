# Django Backend Configuration for Frontend Integration

## CORS Configuration

Cross-Origin Resource Sharing (CORS) must be configured for the frontend to communicate with the backend.

### 1. Install Django CORS Package

The package is already included in `requirements.txt`:

```python
django-cors-headers==4.3.1
```

### 2. Update settings.py

Verify these settings in `django_backend/bookshell_backend/settings.py`:

```python
INSTALLED_APPS = [
    ...
    'corsheaders',  # Add this
    ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this FIRST
    'django.middleware.security.SecurityMiddleware',
    ...
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',      # Next.js dev server
    'http://127.0.0.1:3000',
    'http://localhost:8100',      # If using different port
]

# For production, use specific domains:
# CORS_ALLOWED_ORIGINS = [
#     'https://yourdomain.com',
#     'https://www.yourdomain.com',
# ]

# Allow credentials (cookies, auth headers)
CORS_ALLOW_CREDENTIALS = True

# Allow all methods
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Allow necessary headers
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

## API Base URL Setup

Make sure Django is accessible at `http://localhost:8000`:

```bash
# Run Django with exposed URL
python manage.py runserver 0.0.0.0:8000

# Or update settings.py
ALLOWED_HOSTS = ['*']  # Development only
```

## URL Configuration

The backend URLs are configured in `bookshell_backend/urls.py`:

```python
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include('users.urls')),
    path("api/wallet/", include('wallet.urls')),
    path("api/orders/", include('orders.urls')),
    path("api/cart/", include('cart.urls')),
    path("api/messages/", include('messaging.urls')),
    path("api/favorites/", include('favorites.urls')),
    path("api/reviews/", include('reviews.urls')),
    path("api/books/", include('books.urls')),
    path("api/audiobooks/", include('audiobooks.urls')),
    path("api/categories/", include('categories.urls')),
]
```

## API Routes Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `PATCH /api/auth/profile/` - Update profile

### Wallet
- `GET /api/wallet/` - Get wallet details
- `GET /api/wallet/balance/` - Get balance
- `GET /api/wallet/stats/` - Get wallet statistics
- `GET /api/wallet/transactions/` - Get transaction history
- `POST /api/wallet/payment-methods/create/` - Add payment method
- `POST /api/wallet/deposit/` - Process deposit
- `POST /api/wallet/pay/` - Process payment

### Orders
- `GET /api/orders/orders/` - List all orders
- `POST /api/orders/orders/` - Create order
- `GET /api/orders/orders/{id}/` - Get order details
- `GET /api/orders/orders/my_orders/` - Get user's orders
- `POST /api/orders/orders/{id}/mark_paid/` - Mark as paid
- `POST /api/orders/orders/{id}/mark_shipped/` - Mark as shipped

### Cart
- `GET /api/cart/carts/my_cart/` - Get user's cart
- `POST /api/cart/carts/add_item/` - Add item to cart
- `POST /api/cart/carts/remove_item/` - Remove item
- `POST /api/cart/carts/update_item/` - Update item quantity

### Messages
- `GET /api/messages/conversations/` - List conversations
- `POST /api/messages/conversations/start_conversation/` - Start conversation
- `POST /api/messages/conversations/{id}/send_message/` - Send message
- `GET /api/messages/conversations/{id}/messages/` - Get messages

### Favorites
- `GET /api/favorites/favorites/my_favorites/` - Get favorites
- `POST /api/favorites/favorites/add_book/` - Add book to favorites
- `POST /api/favorites/favorites/add_audiobook/` - Add audiobook to favorites
- `POST /api/favorites/favorites/remove/` - Remove from favorites

### Reviews
- `GET /api/reviews/reviews/` - List reviews
- `POST /api/reviews/reviews/create_book_review/` - Create book review
- `POST /api/reviews/reviews/create_audiobook_review/` - Create audiobook review

## Testing API Endpoints

### Using cURL

```bash
# Test API is running
curl http://localhost:8000/api/

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Get current user (with token)
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Python

```python
import requests

BASE_URL = 'http://localhost:8000/api'

# Login
response = requests.post(
    f'{BASE_URL}/auth/login',
    json={'email': 'test@example.com', 'password': 'password'}
)
token = response.json()['token']

# Get user
response = requests.get(
    f'{BASE_URL}/auth/me',
    headers={'Authorization': f'Bearer {token}'}
)
print(response.json())
```

### Using Postman

1. Open Postman
2. Create new request
3. Set URL: `http://localhost:8000/api/auth/login`
4. Set method: `POST`
5. Add header: `Content-Type: application/json`
6. Add body:
   ```json
   {
     "email": "test@example.com",
     "password": "password"
   }
   ```
7. Send request
8. Extract token from response
9. Use token in Authorization header for subsequent requests

## Database Setup

Ensure database is initialized:

```bash
cd django_backend

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

## Running Tests

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test wallet

# With verbose output
python manage.py test -v 2
```

## Debugging

### Enable Django Debug Toolbar

Add to `requirements.txt`:
```
django-debug-toolbar==4.2.0
```

Add to `settings.py`:
```python
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
    INTERNAL_IPS = ['127.0.0.1']
```

### View API Logs

Check Django console output for:
```
GET /api/auth/me HTTP/1.1" 200
POST /api/auth/login HTTP/1.1" 200
```

## Production Deployment

### Update settings.py for production:

```python
DEBUG = False

ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

CORS_ALLOWED_ORIGINS = [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
]

# Use environment variables for sensitive data
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}
```

### Using Docker

```dockerfile
# Dockerfile
FROM python:3.11

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "bookshell_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## Common Issues

### CORS Error: "Access to XMLHttpRequest blocked by CORS policy"

**Solution**: 
- Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Ensure `corsheaders` is installed and in MIDDLEWARE
- Restart Django server

### 404 on API endpoint

**Solution**:
- Check URL pattern in app's `urls.py`
- Verify app is in INSTALLED_APPS
- Check spelling of endpoint

### 401 Unauthorized on protected endpoints

**Solution**:
- Verify token is valid
- Check token format: `Bearer <token>`
- Verify `DjangoSelectquery` permission classes are correct

### Database errors

**Solution**:
- Run migrations: `python manage.py migrate`
- Check database connection in settings
- Verify database is running

## Next Steps

1. ✅ Configure CORS
2. ✅ Start Django server
3. ✅ Verify API endpoints work
4. ✅ Connect frontend
5. 📝 Implement WebSocket for real-time features
6. 📝 Set up Celery for async tasks
7. 📝 Deploy to production
