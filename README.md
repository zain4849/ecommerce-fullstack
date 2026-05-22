# ShopHub — Full-Stack E-Commerce Platform

A production-ready e-commerce web application built with **Next.js 15**, **Express 5**, **PostgreSQL + Prisma**, and **Stripe**. Features a complete shopping experience: product browsing, cart management, secure checkout, and order tracking.

> **Demo Credentials**: `demo@example.com` / `password123`

![CI](https://github.com/<you>/ecommerce-fullstack/actions/workflows/ci.yml/badge.svg)

<img width="1460" height="1170" alt="ecommerce" src="https://github.com/user-attachments/assets/60fb46f2-2b60-42d2-88c4-eec6ee1c643e" />

---

## Features

- **JWT Authentication** — Register, login, protected routes with role-based access (customer / admin)
- **Product Catalog** — Browse by category, search by name, featured products carousel
- **Shopping Cart** — Add/remove items, adjust quantities, persistent cart per user
- **Stripe Checkout** — Secure payment processing with Payment Intents, webhook confirmation
- **Order History** — View past orders with status badges and payment info
- **Responsive UI** — Mobile-first design with Tailwind CSS and shadcn/ui components
- **Auto-Seeding** — Prisma seed script with demo users/products/carts/orders
- **Security** — Helmet headers, CORS, rate limiting (general + auth-specific), input validation with Joi

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS, Redux Toolkit, shadcn/ui |
| **Backend** | Express 5, Node.js, TypeScript, Prisma ORM, Joi validation |
| **Database** | PostgreSQL |
| **Payments** | Stripe (Payment Intents + Webhooks) |
| **Auth** | JWT, bcrypt |
| **Security** | Helmet, CORS, express-rate-limit |
| **DevOps** | Docker, GitHub Actions, Turbopack |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app config & middleware
│   │   ├── server.js           # Entry point, DB connection, auto-seed
│   │   ├── seed.js             # Database seeder (products, users, carts, orders)
│   │   ├── config/             # Stripe configuration
│   │   ├── controllers/        # Route handlers (auth, cart, order, product, stripe)
│   │   ├── middlewares/        # Auth guard, admin guard, validation
│   │   ├── models/             # Mongoose schemas (User, Product, Cart, Order)
│   │   ├── routes/             # Express route definitions
│   │   └── validators/         # Joi validation schemas
│   └── tests/                  # API tests (auth, cart, order, products)
│
├── frontend/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/               # Login & Register
│   │   ├── products/           # Product listing & detail pages
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Stripe checkout flow
│   │   └── orders/             # Order history & success
│   ├── components/             # Reusable UI components
│   ├── store/                  # Redux slices (auth, cart)
│   ├── lib/                    # API client, utilities, Stripe config
│   └── types/                  # TypeScript type definitions
│
└── diagrams/                   # Architecture & sequence diagrams (Mermaid)
```

## Getting Started

### Quickstart (Docker + Prisma)

```bash
# Start local postgres
docker compose up -d postgres

# Backend
cd backend
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev

# Frontend (new terminal)
cd ../frontend
npm install
npm run dev
```

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL (local Docker or managed provider)
- (Optional) Stripe account for payment testing

### 1. Clone & Install

```bash
git clone https://github.com/your-username/ecommerce-fullstack.git
cd ecommerce-fullstack

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment

**Backend** — create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000  # Must match your frontend URL for CORS
STRIPE_SECRET_KEY=sk_test_...       # Optional: Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...     # Optional: Stripe webhook secret
```

**Frontend** — create `frontend/.env.local` (optional, defaults work for local dev):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Run

```bash
# Terminal 1 — Backend (auto-seeds products + users + carts + orders)
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with `demo@example.com` / `password123`.

### Seed Data

The database can be seeded manually against Postgres with:

```bash
cd backend && npm run seed
```

This creates:
- **18 products** across 6 categories (Laptops, Mobile, Cameras, Smart Home, Gaming, Audio)
- **6 users** (1 admin + 5 customers)
- **3 carts** with varied cart states
- **12 orders** with paid/pending/failed statuses across recent months
- **Demo user**: `demo@example.com` / `password123`
- **Admin user**: `admin@example.com` / `admin12345`

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | List all products (supports `?category=` and `?featured=true`) |
| GET | `/api/products/:id` | Public | Get product details |
| POST | `/api/products` | Admin | Create a product |
| PUT | `/api/products/:id` | Admin | Update a product |
| DELETE | `/api/products/:id` | Admin | Delete a product |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | User | Get current cart |
| POST | `/api/cart` | User | Add item to cart |
| PATCH | `/api/cart/:productId` | User | Update item quantity |
| DELETE | `/api/cart/:productId` | User | Remove item from cart |
| DELETE | `/api/cart` | User | Clear entire cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/orders` | User | Get order history |
| POST | `/api/orders` | User | Create an order |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhook/stripe` | Stripe payment webhook |
| GET | `/api/health` | Health check for deployment monitoring |

## Security

- **Helmet** — Sets secure HTTP headers
- **CORS** — Restricts origins to configured frontend URL(s), with optional Vercel preview support
- **Rate Limiting** — 100 req/15min general, 5 failed req/15min on auth endpoints
- **JWT** — Stateless auth with expiry, role-based access control
- **bcrypt** — Password hashing with salt rounds
- **Joi Validation** — Server-side request validation on all mutating endpoints
- **Stripe Webhooks** — Signature verification for payment events

## Deploy (Beginner Friendly): Railway + Vercel

Use this exact order to avoid common first-deployment issues.

### Step 1: Deploy Backend API to Railway

1. Push your code to GitHub.
2. In Railway, create a new project from this repo and set root directory to `backend`.
3. Set these Railway environment variables:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=<your postgres connection string>
JWT_SECRET=<long random secret>
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
ALLOW_VERCEL_PREVIEWS=true
```

4. Deploy and open:
   - `https://<your-backend-domain>/api/health` (must return `{"status":"ok"}`)

### Step 2: Deploy Frontend to Vercel

1. In Vercel, import the same GitHub repo and set root directory to `frontend`.
2. Set these Vercel environment variables:

```env
NEXT_PUBLIC_API_URL=https://<your-backend-domain>/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Deploy frontend and note your production URL:
   - `https://<your-frontend>.vercel.app`

### Step 3: Lock Backend CORS to Real Frontend URL

Update Railway env var:

```env
FRONTEND_URL=http://localhost:3000,https://<your-frontend>.vercel.app
```

Keep `ALLOW_VERCEL_PREVIEWS=true` if you want Vercel preview deployments to work.

### Step 4: Configure Stripe Test Mode

1. Ensure both keys are from Stripe **test mode**.
2. In Stripe dashboard, create/confirm webhook endpoint:
   - `https://<your-backend-domain>/api/webhook/stripe`
3. Subscribe at least to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy signing secret into Railway as `STRIPE_WEBHOOK_SECRET`.

### Step 5: Smoke Test Checklist (Before Interviews)

- Register a new user and login.
- Verify products render on home and products pages.
- Add products to cart and adjust quantities.
- Complete a test checkout (Stripe test card).
- Confirm orders appear in user order history.
- Login as admin and verify analytics/top products/revenue are not empty.
- Re-open `GET /api/health` after changes to ensure API is healthy.

## Architecture

- Backend route/middleware flow and data lifecycle diagrams are in [diagrams/](diagrams).
- Use these during interviews to explain request flow, auth boundaries, and checkout/webhook state transitions.

## License

[MIT](LICENSE)
