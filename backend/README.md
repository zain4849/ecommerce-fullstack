# Backend (Prisma + Postgres)

## Commands

- `npm run dev` - start backend with tsx watch
- `npm run build` - compile TypeScript
- `npm run start` - run compiled server
- `npm run db:migrate` - create/apply migration in development
- `npm run db:deploy` - apply committed migrations (CI/prod)
- `npm run db:reset` - reset local database
- `npm run prisma:generate` - regenerate Prisma client
- `npm run seed` - seed database with demo data
- `npm run db:studio` - open Prisma Studio

## Environment

Copy `.env.example` and set:

- `DATABASE_URL`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
