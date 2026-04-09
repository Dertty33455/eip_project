# Frontend-Backend API Integration Guide

## Overview

This guide explains how the Next.js frontend connects to the Django backend REST API.

## Setup

### 1. Environment Configuration

Create a `.env.local` file in the frontend root directory:

```bash
# Copy the example file
cp .env.local.example .env.local
```

Configure it with your Django backend URL:

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Production
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

### 2. Install Dependencies

The frontend already includes required packages:
- **axios**: HTTP client
- **@tanstack/react-query**: Data fetching and caching
- **zustand**: State management (for auth token storage)

### 3. API Client Setup

The API client is configured in `src/lib/api/`:

- **config.ts**: Base URL and endpoint definitions
- **client.ts**: Axios instance with interceptors (auth, error handling)
- **services/**: API service functions for each module

## Architecture

### Directory Structure

```
frontend/src/
├── lib/api/
│   ├── config.ts              # API endpoints and base URL
│   ├── client.ts              # Axios client with interceptors
│   └── services/
│       ├── auth.ts            # Authentication services
│       ├── wallet.ts          # Wallet & payment services
│       ├── orders.ts          # Orders services
│       ├── cart.ts            # Cart services
│       ├── messaging.ts       # Messaging services
│       └── index.ts           # Favorites & reviews services
└── hooks/
    ├── useAuth.ts             # Auth hooks (if exists)
    ├── useWallet.ts           # Wallet hooks with React Query
    ├── useOrders.ts           # Orders hooks
    ├── useCart.ts             # Cart hooks (if exists)
    └── useMessaging.ts        # Messaging hooks
```

## API Services

### Authentication Service

```typescript
import { authService } from '@/lib/api/services/auth';

// Register user
await authService.register({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
});

// Login user
await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

// Get current user
await authService.getMe();

// Logout
await authService.logout();

// Update profile
await authService.updateProfile({
  firstName: 'Jane',
  avatar: 'https://...',
});

// Request verification token
await authService.requestVerificationToken('EMAIL');

// Verify token
await authService.verifyToken('token_string');
```

### Wallet Service

```typescript
import { walletService } from '@/lib/api/services/wallet';

// Get wallet balance
await walletService.getBalance();

// Get wallet stats
await walletService.getStats();

// Get transaction history
await walletService.getTransactions({ limit: 20 });

// Get payment methods
await walletService.getPaymentMethods();

// Create payment method
await walletService.createPaymentMethod({
  method_type: 'credit_card',
  details: { /* ... */ },
});

// Process deposit
await walletService.deposit({
  amount: 100,
  payment_method_id: 'method-id',
});

// Get subscription pricing
await walletService.getSubscriptionPricing();
```

### Orders Service

```typescript
import { ordersService } from '@/lib/api/services/orders';

// Get my orders (as buyer)
await ordersService.getMyOrders();

// Get selling orders (as seller)
await ordersService.getSellingOrders();

// Create order
await ordersService.createOrder({
  items: [...],
  shipping_address: '...',
  /* ... */
});

// Mark order as paid
await ordersService.markPaid(orderId);

// Mark order as shipped
await ordersService.markShipped(orderId, {
  tracking_number: 'TRACK123',
});

// Mark order as delivered
await ordersService.markDelivered(orderId);

// Cancel order
await ordersService.cancelOrder(orderId);
```

### Cart Service

```typescript
import { cartService } from '@/lib/api/services/cart';

// Get cart
await cartService.getCart();

// Add item to cart
await cartService.addItem({
  book_id: 'book-uuid',
  quantity: 1,
});

// Remove from cart
await cartService.removeItem(itemId);

// Update item quantity
await cartService.updateItem(itemId, 2);

// Clear cart
await cartService.clearCart();

// Checkout
await cartService.checkout({
  shipping_address: '...',
  /* ... */
});
```

### Messaging Service

```typescript
import { messagingService } from '@/lib/api/services/messaging';

// Get conversations
await messagingService.getConversations();

// Start new conversation
await messagingService.startConversation({
  user_ids: ['user-id-1', 'user-id-2'],
});

// Get messages in conversation
await messagingService.getMessages(conversationId);

// Send message
await messagingService.sendMessage(conversationId, {
  content: 'Hello!',
  attachment_url: null,
});

// Mark as read
await messagingService.markAsRead(conversationId);
```

### Favorites Service

```typescript
import { favoritesService } from '@/lib/api/services';

// Get all favorites
await favoritesService.getFavorites();

// Add book to favorites
await favoritesService.addBook(bookId);

// Add audiobook to favorites
await favoritesService.addAudiobook(audiobookId);

// Remove from favorites
await favoritesService.remove(bookId);
```

### Reviews Service

```typescript
import { reviewsService } from '@/lib/api/services';

// Get reviews for product
await reviewsService.getReviews({ book_id: bookId });

// Get user's reviews
await reviewsService.getMyReviews();

// Create book review
await reviewsService.createBookReview({
  book_id: bookId,
  rating: 5,
  title: 'Great book!',
  content: 'This is a fantastic book...',
});

// Mark as helpful
await reviewsService.markHelpful(reviewId);
```

## React Query Hooks

### Authentication Hooks

```typescript
import { useGetUser, useLogin, useRegister, useLogout, useUpdateProfile } from '@/hooks/useAuth';

function MyComponent() {
  const { data: user, isLoading } = useGetUser();
  const loginMutation = useLogin();
  
  const handleLogin = async () => {
    await loginMutation.mutateAsync({
      email: 'user@example.com',
      password: 'password',
    });
  };

  return (
    <div>
      {isLoading ? <p>Loading...</p> : <p>User: {user?.username}</p>}
    </div>
  );
}
```

### Wallet Hooks

```typescript
import {
  useGetBalance,
  useGetWallet,
  useDeposit,
  usePayment,
  useGetSubscriptionPricing,
} from '@/hooks/useWallet';

function WalletComponent() {
  const { data: balance } = useGetBalance();
  const depositMutation = useDeposit();

  const handleDeposit = async () => {
    await depositMutation.mutateAsync({
      amount: 100,
      payment_method_id: 'method-id',
    });
  };

  return (
    <div>
      <p>Balance: ${balance?.balance}</p>
      <button onClick={handleDeposit}>Deposit</button>
    </div>
  );
}
```

### Orders Hooks

```typescript
import { useGetMyOrders, useCreateOrder, useMarkOrderPaid } from '@/hooks/useOrders';

function OrdersComponent() {
  const { data: orders } = useGetMyOrders();
  const createOrderMutation = useCreateOrder();

  return (
    <div>
      {orders?.map(order => (
        <div key={order.id}>{order.order_number}</div>
      ))}
    </div>
  );
}
```

### Cart Hooks

```typescript
import { useGetCart, useAddToCart, useRemoveFromCart } from '@/hooks/useCart';

function CartComponent() {
  const { data: cart } = useGetCart();
  const addToCartMutation = useAddToCart();

  return (
    <div>
      <p>Items: {cart?.total_items}</p>
      <p>Subtotal: ${cart?.subtotal}</p>
    </div>
  );
}
```

### Messaging Hooks

```typescript
import { useGetConversations, useSendMessage } from '@/hooks/useMessaging';

function MessagingComponent() {
  const { data: conversations } = useGetConversations();
  const sendMessageMutation = useSendMessage();

  return (
    <div>
      {conversations?.map(conv => (
        <div key={conv.id}>{conv.last_message}</div>
      ))}
    </div>
  );
}
```

## Authentication Flow

### Token Management

Tokens are stored in `localStorage`:

```typescript
// After login
localStorage.setItem('auth_token', response.token);
localStorage.setItem('refresh_token', response.refresh);

// Token automatically added to all requests
// Authorization: Bearer {token}

// On logout
localStorage.removeItem('auth_token');
localStorage.removeItem('refresh_token');
```

### Token Refresh

The axios client automatically handles token refresh:

1. When a 401 response is received
2. It attempts to refresh using the refresh token
3. If successful, retries the original request
4. If failed, redirects to login

## Error Handling

All API errors are caught and formatted as `ApiError`:

```typescript
interface ApiError {
  message: string;
  status: number;
  data?: any;
}

try {
  await authService.login({ /* ... */ });
} catch (error: ApiError) {
  console.error(`${error.status}: ${error.message}`);
}
```

## CORS Configuration

The Django backend needs to allow requests from the frontend. Ensure `CORS_ALLOWED_ORIGINS` is configured in `django_backend/config/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',  # Development
    'https://yourdomain.com',  # Production
]
```

## Best Practices

1. **Always use hooks**: Use the provided React Query hooks instead of directly calling services
2. **Handle loading states**: Check `isLoading` and `isPending` states
3. **Handle errors**: Use `error` property from hooks to display error messages
4. **Cache data**: React Query automatically caches data based on query keys
5. **Invalidate on mutations**: After mutations, related queries are automatically invalidated
6. **Type safety**: All responses are properly typed

## Debugging

Enable debug logging in `.env.local`:

```env
NEXT_PUBLIC_DEBUG=true
```

This will log all API requests and responses to the console.

## Common Issues

### 401 Unauthorized

- Check if token is stored in localStorage
- Verify token is valid and not expired
- Try logging out and logging in again

### CORS Errors

- Ensure Django backend has `cors` installed
- Check `CORS_ALLOWED_ORIGINS` in Django settings
- Check that the `NEXT_PUBLIC_API_URL` matches the Django server URL

### Network Errors

- Ensure Django backend is running
- Check the API URL in `.env.local`
- Check browser Network tab for actual API requests

## Next Steps

1. Set up `.env.local` with your API URL
2. Test authentication flow
3. Implement components using the provided hooks
4. Add error handling and loading states
5. Test all features in development:
   - Run Django: `python manage.py runserver`
   - Run Next.js: `npm run dev`
   - Visit `http://localhost:3000`
