# Deployment guide

## GitHub
Upload the contents of this folder to the root of the `ZEB-Construction-Managemant` repository. `package.json` must be at repository root.

## Supabase
Run `supabase/schema.sql` in SQL Editor. Create an Auth user, then add its profile using the SQL comment at the bottom of the schema file. This starter schema/policy set requires further security review before production financial use.

## Vercel
Import the GitHub repository. Set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase publishable key)

Framework preset: Next.js. Build command: `npm run build`. Deploy only after database schema and environment variables are configured.

## Smoke test
- Visit `/login` and sign in.
- Visit `/dashboard`.
- Create a test project.
- Refresh and confirm the project remains listed.
- Sign out and sign in again.

Do not delete existing Supabase projects or Vercel deployments until a new deployment and backup are verified.
