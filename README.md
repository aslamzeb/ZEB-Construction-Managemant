# ZEB-Construction Managemant

**Building Better Spaces for a Stronger Tomorrow**

A multi-project construction management application for ZEB Construction.

## Current included functionality
- Supabase email/password authentication
- Multi-project workspace
- Create and select construction projects
- Initial database tables for profiles, project membership, vendors, materials, contractors, transactions, daily progress and vouchers
- Project-scoped starter row-level security policies
- Responsive navy, champagne and ivory interface

## Important implementation status
This release is a working application foundation, not a fully completed production system. Detailed CRUD screens for every module, vendor delivery confirmation, approval workflows, custom permission editor, payroll, room/floor measurement tools, photo storage, printable vouchers, complete financial reports and security audit remain to be implemented and tested. Do not use it as the sole accounting record or expose real financial data until those workflows and policies have been completed and independently tested.

## Requirements
- Node.js 20+
- Supabase project
- Vercel account (optional for hosting)

## Local setup
1. Copy `.env.example` to `.env.local`.
2. Add your Supabase Project URL and publishable key.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.

## Supabase setup
1. Open Supabase SQL Editor.
2. Run `supabase/schema.sql`.
3. Create the first user in Authentication.
4. Copy that user's UUID and run the profile insert shown at the bottom of `schema.sql`, replacing `AUTH_USER_UUID`.
5. Sign in at `/login`.

Never put a Supabase service-role key in browser environment variables.
