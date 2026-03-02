# BookShell Monorepo

Welcome to the **BookShell** monorepo. This project consists of two
separate services that together power a digital bookstore application:

- `frontend/` – a Next.js 14 application written in TypeScript. It contains
the user interface, client‑side logic, and some built‑in API routes.
- `backend/` – a standalone Laravel 12 REST service exposing the same
API surface. It can be deployed independently and is useful for
integrations or when a PHP backend is preferred.

> 🚀 The two parts are developed side‑by‑side in this repository but
> behave like independent projects. You can work on just one or run both
> together, depending on your needs.

---

## 🧱 Prerequisites

Make sure you have the following tools installed globally on your
machine:

1. **Git** (for version control)
2. **PHP 8.3+** with the following extensions: `pdo`, `pdo_sqlite`,
   `mbstring`, `openssl`, `curl`.
3. **Composer** (PHP dependency manager).
4. **Node.js 20+** and **npm** or **yarn**.
5. Optionally, **Docker/Compose** if you prefer containerised databases
   or full-stack development.

> For a quick setup you can use the provided `docker-compose.yml` in the
> `frontend/` folder which also exposes a PostgreSQL instance.

---

## 📁 Repository layout

```text
/
├── frontend/       # Next.js application (UI)
└── backend/        # Laravel REST API service
```

Each side has its own `README.md` with more granular instructions. See
those when you start working on a specific area.

---

## 🛠 Common setup steps

These steps assume you're at the repository root (`/home/oscar/ME/eip_project`).

1. **Clone & install sub‑project dependencies**

   ```bash
   # already in root after cloning
   cd backend && composer install && npm install
   cd ../frontend && npm install
   ```

2. **Environment configuration**

   - Copy `.env.example` to `.env` in **both** `frontend/` and `backend/`.
   - Adjust the environment variables (database credentials, API URLs,
     OAuth keys, etc.).

3. **Database**

   - The backend supports SQLite, MySQL and PostgreSQL. Update
     `DB_CONNECTION` in `backend/.env` accordingly and run:

     ```bash
     cd backend
     php artisan key:generate
     php artisan migrate
     # optionally seed: php artisan db:seed
     ```

   - If you use Docker, start the database service defined in
     `frontend/docker-compose.yml` and point the backend to
     `DB_HOST=localhost` (or the container name).

4. **Start development servers**

   ```bash
   # backend
   cd backend && php artisan serve               # http://127.0.0.1:8000

   # frontend (in a separate terminal)
   cd frontend && npm run dev                   # http://localhost:3000
   ```

   The frontend automatically proxies API requests to
   `http://127.0.0.1:8000` when `NEXT_PUBLIC_API_URL` is unset.

5. **Google OAuth & Socialite**

   If you plan to test the Google login flow, obtain credentials from
   Google Cloud and set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and
   `GOOGLE_REDIRECT_URL` in the backend `.env` file. Set `FRONTEND_URL`
   as well so callbacks can redirect correctly.

---

## 🔍 Development notes

- **Frontend API hooks** live in `frontend/src/lib/useApi.ts` and are
  configured to use the `NEXT_PUBLIC_API_URL` environment variable.
- The Laravel backend mimics the Prisma schema from the Next.js
  version; adding a new model generally involves creating an Eloquent
  model and migration under `backend/app/Models` + `database/migrations`.
- Tests for the backend are in `backend/tests`; run them with
  `cd backend && ./vendor/bin/phpunit`.
- Frontend unit/feature tests use Jest/Playwright (`npm run test`).

---

## 📦 Deployment

Each project can be deployed independently:

- **Frontend**: built with `npm run build` and served by Vercel, Netlify,
  or any Node hosting provider.
- **Backend**: standard Laravel deployments (Forge, Vapor, Docker
  images, etc.). Ensure the `APP_URL` environment variable points to the
  correct host and that the database is properly configured.

> When deploying both, update the frontend's `NEXT_PUBLIC_API_URL` to
> the hosted backend URL.

---

## 📚 Additional resources

- [`frontend/README.md`](frontend/README.md) – frontend-specific setup.
- [`backend/README.md`](backend/README.md) – backend-specific instructions.
- [`/backend/DETAILED_DOCUMENTATION.md`](backend/DETAILED_DOCUMENTATION.md)
  – more in-depth API and architecture notes.

---

Happy hacking! 🎉

*This README is meant to help new contributors and provide a single
reference for getting started with the BookShell monorepo.*
