# Frontend-Backend Integration Quick Start

## Pre-requisites

- Django backend running at `http://localhost:8000`
- Next.js frontend running at `http://localhost:3000`
- Both projects in the same workspace

## Step 1: Configure Environment

```bash
# In frontend directory
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Step 2: Start Both Servers

### Terminal 1 - Django Backend

```bash
cd django_backend

# Create virtual environment (if not exists)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

The backend will be at: `http://localhost:8000`

### Terminal 2 - Next.js Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be at: `http://localhost:3000`

## Step 3: Test the Connection

### Test Login

Create a test user in Django admin:
1. Go to `http://localhost:8000/admin`
2. Create a user with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `testpass123`

### Test Frontend Login

1. Go to `http://localhost:3000/login`
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `testpass123`
3. Check browser console (DevTools) for API calls

## Common API Calls to Test

### 1. Authentication

```typescript
// In browser console while logged in
const token = localStorage.getItem('auth_token');
console.log('Token:', token);

// Fetch current user
fetch('http://localhost:8000/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log);
```

### 2. Wallet

```typescript
// Get wallet balance
fetch('http://localhost:8000/api/wallet/balance/', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log);
```

### 3. Orders

```typescript
// Get user's orders
fetch('http://localhost:8000/api/orders/orders/my_orders/', {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log);
```

## Verify Integration

Check Django logs:
```
GET /api/auth/me HTTP/1.1" 200
GET /api/wallet/balance/ HTTP/1.1" 200
```

Check browser Network tab:
- All requests should go to `http://localhost:8000/api/*`
- Auth header should be `Authorization: Bearer <token>`
- Status should be 200 for successful requests

## Example Component

```typescript
// components/Dashboard.tsx
import { useGetUser } from '@/hooks/useAuth';
import { useGetBalance } from '@/hooks/useWallet';

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useGetUser();
  const { data: balance, isLoading: balanceLoading } = useGetBalance();

  if (userLoading || balanceLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <p>Balance: ${balance?.balance}</p>
    </div>
  );
}
```

## Troubleshooting

### Issue: 401 Unauthorized

**Solution**: 
- Check token is stored: `localStorage.getItem('auth_token')`
- Verify user credentials
- Ensure Django is running

### Issue: CORS Error

**Solution**:
- Add to Django `settings.py`:
  ```python
  CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
  ```
- Restart Django server

### Issue: Network Timeout

**Solution**:
- Ensure Django server is running
- Check `NEXT_PUBLIC_API_URL` matches Django URL
- Check firewall settings

### Issue: 404 Not Found

**Solution**:
- Verify API endpoint exists in Django
- Check URL patterns in `bookshell_backend/urls.py`
- Check app is in INSTALLED_APPS

## Next Steps

1. ✅ Environment setup
2. ✅ Start servers
3. ✅ Test login
4. 📝 Build dashboard using hooks
5. 📝 Implement order management
6. 📝 Implement wallet features
7. 📝 Add real-time messaging

## Resources

- [API Integration Guide](./API_INTEGRATION.md)
- [Django REST API Docs](http://localhost:8000/api)
- [React Query Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/)

## Getting Help

1. Check browser console for errors
2. Check Django server logs
3. Check Network tab in DevTools
4. Review API_INTEGRATION.md for service usage
