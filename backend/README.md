# Laravel Backend for BookShell

This folder contains a _stand-alone_ Laravel 12 application that can serve as the external backend
service for the BookShell front-end. It exposes a simple REST API and uses
Eloquent models to mirror the Prisma schema used by the Next.js version.

## 🚀 Getting started

1. **Install dependencies**
   ```bash
   cd backend          # workspace root already inside backend when running this README
   composer install
   npm install        # not strictly required for API-only work
   ```

2. **Copy environment file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to configure your database and other credentials. Example:
   ```env
   APP_NAME=BookShell
   APP_ENV=local
   APP_KEY=base64:...
   APP_URL=http://localhost:8000

   DB_CONNECTION=sqlite    # or pgsql, mysql
   DB_DATABASE=/full/path/to/database.sqlite
   # or for Postgres
   # DB_CONNECTION=pgsql
   # DB_HOST=127.0.0.1
   # DB_PORT=5432
   # DB_DATABASE=BookShell
   # DB_USERNAME=...
   # DB_PASSWORD=...
   ```

   Make sure to run `php artisan key:generate` if the key is not set.

3. **Run migrations** (already executed in this workspace, but run again if you change them):
   ```bash
   php artisan migrate --force
   ```

4. **Start the development server**
   ```bash
   php artisan serve
   ```
   The API will be available at `http://127.0.0.1:8000`.

## 🌐 Routes
- `POST /api/register` – create a new user
- `POST /api/login` – obtain a Sanctum token
- `GET /api/books` – list books with optional query filters
- `POST /api/books` – create a book (requires `Authorization: Bearer <token>`)

Additional routes and controllers can be added under `app/Http/Controllers/Api`.

## 📁 Database structure
The migrations in `database/migrations` currently include a subset of the
Prisma schema (users, categories, books, orders, wallets). Translate the
remaining models by generating new migrations with
`php artisan make:model <Name> -m` and editing the generated files using the
Prisma schema as a reference. Seeders can be added in `database/seeders`.

## 🔐 Authentication
Laravel Sanctum is installed and provides token-based authentication. The
`User` model uses the `HasApiTokens` trait, and the `auth:sanctum` middleware
is applied to protected routes in `routes/api.php`.

### Google OAuth (Socialite)
A simple OAuth flow has been added so that users can sign in with Google.
The controller methods `redirectToGoogle` and `handleGoogleCallback` live in
`App\Http\Controllers\Api\AuthController`.  When the callback is hit the
backend creates or updates a user record, issues a Sanctum token and
redirects to the frontend `
/auth/callback?token=<token>` page (see frontend code).

To enable this flow:

1. Run `composer require laravel/socialite` (already added to `composer.json`).
2. Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and
   `GOOGLE_REDIRECT_URL` to your `.env` file (see `.env.example`).
3. Optionally set `FRONTEND_URL` so the callback knows where to send the user.
4. Register your OAuth credentials in Google Cloud Console and include the
   redirect URL (`http://localhost:8000/api/auth/google/callback` by default)
   as an authorised URI.

The front-end portion is handled by the Next.js project; it simply redirects
users to `/api/auth/google/redirect` and then reads the returned token at
`/auth/callback`.

## 🧩 Extending the service
To fully replace the existing Next.js backend you will need to implement:

1. The remaining Eloquent models and migrations (reviews, posts, wallet
   transactions, webhooks, etc.).
2. Controllers and request validation for each API endpoint.
3. Integration with MTN/Moov payment APIs (see `src/lib/payments` in the
   front-end for reference).
4. Policies or middleware for authorization (e.g. seller vs. admin roles).

This repository simply provides a starting point. Feel free to reorganize
and modularise as your architecture requires.

---

*This backend is intentionally completely separate from the Next.js project –
call it from the front-end by changing `useApi.ts` endpoints or setting
`NEXT_PUBLIC_API_URL` to point at `http://localhost:8000`.*

