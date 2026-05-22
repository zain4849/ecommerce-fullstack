# Security Checklist

## OWASP Top 10 Mapping

- **A01 Broken Access Control**
  - Protected routes use `authMiddleware`; admin routes require `adminMiddleware`.
  - Tests cover customer access denial (`403`) for admin endpoints.
- **A02 Cryptographic Failures**
  - Passwords hashed with bcrypt.
  - JWT required and validated; production secrets must be strong.
  - Auth token stored in `httpOnly` cookie.
- **A03 Injection**
  - Prisma ORM is used for database access.
  - Joi validates user input for auth/cart/order/product flows.
- **A05 Security Misconfiguration**
  - Helmet enabled in backend.
  - Frontend security headers and CSP configured in Next.js.
  - CORS is allowlist-based and supports controlled Vercel previews.
- **A07 Identification and Authentication Failures**
  - Auth endpoints are rate-limited.
  - Generic invalid-credential responses avoid user enumeration detail.
- **A08 Software and Data Integrity Failures**
  - Stripe webhook signature is verified before processing events.
  - CI security workflow runs `npm audit`, `gitleaks`, and CodeQL.
- **A09 Security Logging and Monitoring Failures**
  - Structured logs (`pino` + request ids) and Sentry error capture enabled.

## Operational Security Tasks

- Rotate `JWT_SECRET` and Stripe secrets regularly.
- Never commit `.env` files; use platform secret stores.
- Require CI checks on pull requests before merge.
- Use branch protection for `main`.
