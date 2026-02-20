# BookShell Backend & Frontend Detailed Documentation

This document provides a comprehensive overview of the BookShell monorepo, covering both the Laravel backend and the Next.js frontend. It's intended to serve as an in-repository reference for developers.

---

## 🔧 Repository Structure

```
README.md               ← main overview
frontend/               ← Next.js 14 application (UI + API routes)
backend/                ← Laravel 12 REST API service
```

Each subdirectory contains its own README with setup instructions; this file augments them with deeper insights.

---

## 📁 Backend (Laravel 12)

### 🌱 Setup

1. `composer install` (and `npm install` if building assets)
2. Copy `.env.example` to `.env` and configure database
3. Generate application key: `php artisan key:generate`
4. Run migrations: `php artisan migrate --force`
5. Seed data (optional): `php artisan db:seed`
6. Start server: `php artisan serve` (`http://127.0.0.1:8000`)

### 🧠 Models & Relationships

Models in `app/Models` represent database tables using Eloquent. They generally expose:

- `$fillable` fields for mass assignment.
- Relationship methods (`hasMany`, `belongsTo`, `belongsToMany`, etc.).
- Accessors/mutators for camelCase or virtual fields.
- `$appends` to include computed attributes (e.g. `User::firstName`, `Audiobook::allRelated`).

Noteworthy examples:

| Model | Key Fields (fillable) | Relations |
|-------|-----------------------|-----------|
| `User` | first_name, last_name, email, password, role, ... | books, ordersAsBuyer/seller, wallet, transactions, posts, comments, ... |
| `Book` | title, author, price, category_id, seller_id, condition, ... | category, seller (User), reviews, orderItems, cartItems, favorites |
| `Audiobook` | title, author, narrator, description, total_duration, category_id, ... | category, chapters, reviews, favorites, progress, relatedAudiobooks/relatedBy |
| `AudioChapter` | audiobook_id, title, chapter_number, duration, audio_url, is_free | audiobook, progress |
| `Order`, `OrderItem`, `Wallet`, `Transaction`, `Category`, `Post`, `Comment`, `Like`, `Share`, `Subscription`, `SubscriptionPricing`, `Notification`, `Favorite`, `Report`, `Follow`, `Message`, `Conversation`, `ConversationParticipant`, `Invoice`, `Setting`, `Analytics`, etc. | appropriate links |

Relations of interest:

- **Self-referential many-to-many** in `Audiobook` using `audiobook_relations` pivot and computed `allRelated` attribute merging both directions.
- **HasManyThrough** in `User::transactions` via `Wallet`.
- Accessors that expose camelCase (`firstName`, `lastName`) for JS clients.

### 🎯 Controllers

API controllers live under `app/Http/Controllers/Api`. They either extend `CrudController` or implement custom logic.

#### 🔁 `CrudController`

General-purpose base for CRUD operations. Provides:

- `index` with pagination (`limit` query, 1–100) and optional eager-loading via `withRelations()`.
- `store`/`update` with validation rules defined in subclass.
- `show` and `destroy` with not-found handling.

Subclasses merely specify the model class and validation rules; some override `withRelations()`.

Examples:
- `AudioChapterController` – rules for chapters, relation `['audiobook','progress']`.
- `AudioProgressController`, `CategoryController`, `CartController`, etc.

#### 🗝 AuthController

Handles:

- Registration (accepts camelCase or snake_case names), hashing passwords, generating Sanctum tokens, returning user with related data.
- Login with email/password, token creation.
- `me` endpoint returning authenticated user data.
- Logout by deleting current access token.
- Profile updates with unique validations and camel/snake case mapping.

#### 📘 BookController & AudiobookController

Added search and filter capabilities (`search`, `category_id`), pagination, and counts for reviews/favorites. Validate data on create/update, manage not-found responses, and support full CRUD.

#### ✅ Other controllers

`AudiobookRelationController` (manage pivot), `OrderController`, `WalletController`, payment-related logic, social features controllers (`PostController`, `CommentController`, etc.), analytics, settings, and more.

### 🔐 Routes

Defined in `routes/api.php` with public and protected sections:

```php
Route::post('/auth/register', [AuthController::class,'register']);
Route::post('/auth/login', [AuthController::class,'login']);

Route::apiResource('books', BookController::class, ['only'=>['index','show']]);
Route::apiResource('audiobooks', AudiobookController::class);
// ... more public resources ...

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me',[AuthController::class,'me']);
    Route::post('/auth/logout',[AuthController::class,'logout']);
    Route::patch('/auth/me',[AuthController::class,'updateProfile']);
    // protected resources (books create/update/destroy, orders, wallets, etc.)
    Route::post('audiobooks/{id}/related', [AudiobookRelationController::class,'store']);
    Route::delete('audiobooks/{id}/related/{relatedId}', [AudiobookRelationController::class,'destroy']);
});
```

Authentication uses Laravel Sanctum tokens; the middleware automatically rejects unauthenticated requests.

### ⚠️ Notes for Development

- **Migrations**: add with `php artisan make:model <Name> -m` and edit to match Prisma schema if needed.
- **Authorization**: current code trusts any authenticated user. Policies/roles should be implemented.
- **Tests**: only `tests/TestCase.php` is present. Add PHPUnit tests per controller/model.
- **API documentation**: consider Swagger/OpenAPI generation.

---

## 💻 Frontend (Next.js 14)

### 🛠 Setup

1. `npm install`
2. Copy `.env.example` → `.env` with database URL and API secrets.
3. `npx prisma generate`
4. `npx prisma db push`
5. `npx prisma db seed` (creates demo data)
6. `npm run dev` → `http://localhost:3000`

### 📁 Directory layout

```
src/
├── app/                    # Router pages
│   ├── api/               # API routes mirroring backend
│   │   ├── auth/          # login, register, me, logout
│   │   ├── books/         # CRUD endpoints
│   │   ├── audiobooks/    # includes related management
│   │   ├── posts/         # social features
│   │   ├── wallet/        # payments
│   │   ├── admin/         # statistics & management
│   │   └── webhooks/      # MTN/Moov callbacks
│   ├── admin/             # admin UI pages
│   ├── books/             # book catalog, details, create
│   ├── audiobooks/        # audio player, subscriptions
│   ├── community/         # feed, posts, comments
│   ├── wallet/            # wallet interface
│   └── subscriptions/     # plan management
├── components/            # shared UI components
├── hooks/                 # custom React hooks
│   ├── useAuth.ts         # authentication logic
│   └── useApi.ts          # API fetch wrapper
├── lib/                   # utilities
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # JWT utilities
│   ├── validations.ts     # Zod schemas
│   ├── utils.ts           # misc helpers
│   └── payments/          # MTN/Moov services
└── middleware.ts          # route protection middleware
```

### 🔄 API interaction

`useApi` provides generic `get/post/put/delete` helpers plus typed
wrappers (`useBooks`, `useAudiobooks`, etc.).

Calls target `/api/...` and may either:

1. Access the database directly through Prisma (when running the Next.js
   server locally); or
2. Proxy the request to the Laravel backend configured via
   `NEXT_PUBLIC_API_URL`.

This design keeps front and back decoupled while allowing easy switching.

### 🔐 Authentication Flow

- Credentials are exchanged via `/api/auth/login` which returns a JWT
  cookie.
- `useAuth` manages user state and exposes `login`, `register`, `logout`,
  and `me`.
- The Edge middleware `middleware.ts` intercepts requests to protected
  pages, validates JWT, and redirects to `/login` if unauthorized.

### 💳 Payment Integration

- Services for MTN and Moov in `src/lib/payments` implement request and
  confirmation logic.
- Webhook routes under `app/api/webhooks` process callbacks and update
  transactions, wallet balances, and send notifications.

### 🎨 UI & Theming

- Tailwind CSS with an African-inspired palette (`#e88c2a`, `#1b5e20`,
  `#f9bc15`, `#1a1a1a`).
- Framer Motion animations and React Icons.

### 📦 Demo Data

Seeds create several accounts and sample data:
- Admin credentials: `admin@BookShell.com` / `AdminPass123!`
- Test users: `user1@test.com`, `user2@test.com`, `user3@test.com`
- Predefined categories, books, audiobooks, posts.

### 📝 Development Notes

- To switch from the internal API to the Laravel service, set
  `NEXT_PUBLIC_API_URL=http://localhost:8000` in `.env`.
- Hooks, validations, and utils are already wired; add new API routes as
  needed to match backend endpoints.
- Use Zustand (if present) for global state (cart, user, etc.).

---

## 🔄 Interactions Between Backend & Frontend

1. **User action** → front-end page/hook triggers API call via `useApi`.
2. **API route** in Next.js either queries Prisma directly or proxies to
   Laravel.
3. **Laravel backend** executes controller logic, interacts with Eloquent
   models, and returns JSON.
4. **Front-end** receives response and renders data or updates state.
5. **Protected endpoints** require valid token; middleware enforces this
   on both sides.

This keeps the front‑end largely agnostic of the actual data source.

---

### 🚀 Future Enhancements

- Complete missing backend models/migrations for all features used in the
  front-end.
- Implement policies/authorization rules based on user roles.
- Add PHPUnit and/or Jest tests to ensure regressions are caught.
- Generate OpenAPI/Swagger docs for backend controllers.
- Refactor the generic `CrudController` into traits or form requests.
- Expand payment support (refunds, subscriptions, seller payouts).
- Add logging/monitoring and deployment scripts.

---

*This documentation is stored in `backend/DETAILED_DOCUMENTATION.md`. It
can be updated as the codebase evolves.*
