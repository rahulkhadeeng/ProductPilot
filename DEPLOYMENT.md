# ProductPilot Deployment

## Required Environment Variables

- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `UPLOADTHING_TOKEN`
- `PRODUCTION_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `STRIPE_WEBHOOK_SIGNING_SECRET`

## Before Deploying

1. Run `npx prisma migrate deploy`.
2. Run `npx prisma generate`.
3. Run `npm run lint`.
4. Run `npm run build`.
5. Configure Stripe webhook endpoint: `/api/stripe/webhook`.

## Stripe Webhook Events

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Notes

- `PRODUCTION_URL` must be the deployed app URL with no trailing slash.
- UploadThing v7 requires the dashboard token, not an `sk_*` API key.
- This app requires a Node.js deployment target because it uses auth, Prisma,
  Stripe webhooks, UploadThing, and dynamic product/community routes.
