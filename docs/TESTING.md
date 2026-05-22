# Testing Strategy

## Pyramid

1. Unit tests (fast, deterministic): validators, helpers, reducers, service pure logic.
2. Integration tests: backend API endpoints with Postgres test DB.
3. E2E tests: user flows in browser with Playwright.

## Commands

- Backend unit+integration:
  - `cd backend && npm test`
  - `cd backend && npm run test:coverage`
- Frontend unit/component:
  - `cd frontend && npm test`
- E2E:
  - `npm run e2e`

## Coverage Gate

- Backend Jest coverage threshold is enforced in `backend/package.json`.
- Raise thresholds gradually as tests are expanded.

## CI Execution

- `.github/workflows/ci.yml` runs frontend, backend, and e2e jobs.
- `.github/workflows/security.yml` runs security scans weekly and on PR.
