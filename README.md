# School Clubs Directory (Tailwind + MySQL + Formstack)

## What it does
- **Public directory** with subject → subfields, search, and multi-day filtering.
- **Presidents** submit via **Formstack**; your **webhook** upserts into **MySQL**.
- **Admin** approves/edits/deletes; once approved, entries publish to the directory.

## Quick start
1) Create database and user, then run `schema.sql`.
2) Copy `.env.example` to `.env` and fill values.
3) `npm i`
4) `npm run dev`
5) Open `http://localhost:5173`

## Formstack setup
- Build a form with fields:
  - `club_name`, `subject`, `subfields` (multi), `meeting_days` (checkboxes Mon–Fri),
    `meeting_time`, `prerequisites`, `description`,
    `president_name`, `president_email`, `president_code`.
- Add a **Webhook** pointing to `POST /webhooks/formstack` on your server.
- (Optional) Add a Webhook secret, set `FORMSTACK_SECRET` in `.env`.

## Editing by presidents
- Resubmit the form with the same **club_name** + **president_code**.
- The entry upserts and becomes `pending`. Approve it in `/admin.html`.

## Admin auth
- Code-only (demo). Enter `ADMIN_CODE` at `/admin.html`.
- For production, add sessions/JWT and role checks.

## Deploy tips
- Put the server behind a reverse proxy (Nginx).
- Use HTTPS for Formstack webhook endpoint.
- Lock CORS to your domains if you expose the API.
