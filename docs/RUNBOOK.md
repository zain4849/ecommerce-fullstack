# Runbook

## Deploy and Rollback

- Backend deploy is handled by `.github/workflows/deploy.yml`.
- Frontend deploy is handled by Vercel GitHub integration.
- If backend release fails after migration:
  - fix migration issue in a hotfix PR
  - re-run deploy workflow after merge
  - if needed, run a manual rollback migration from Prisma migration history

## Incident Checks

- Check API health: `GET /api/health`
- Inspect Railway logs for backend request id and error details.
- Inspect Vercel logs for frontend runtime errors.
- Inspect Sentry issue feed for stack traces and affected routes.

## Secret Rotation

- Rotate `JWT_SECRET`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET`.
- Update secrets in Railway/Vercel/GitHub Actions and redeploy.
- Invalidate active sessions after JWT secret rotation.

## Branch Protection (GitHub)

- Require passing checks: `frontend`, `backend`, `e2e`.
- Require at least one approving review on `main`.
- Disable direct pushes and force pushes to `main`.
