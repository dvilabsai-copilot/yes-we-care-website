# YWC CMS API

This is a local-first NestJS CMS API for the existing Yes We Care static website. The static frontend is intentionally unchanged; the CMS exposes the same DOCX-aligned content for admin editing and future frontend integration.

## Local PostgreSQL

Create a PostgreSQL database named `ywc_cms`, then set `DATABASE_URL` in `.env`. The example uses the standard PostgreSQL port `5432`; the current local test database uses a temporary UTF-8 cluster on port `55433`.

```powershell
npm install
npx prisma generate
npx prisma migrate deploy
node --env-file=.env -r ts-node/register prisma/seed.ts
npm run build
npm run start
```

The API runs at `http://127.0.0.1:4102` by default. The admin editor is at `http://127.0.0.1:4102/admin.html`.

The local seeded administrator is `admin@ywc.com` with initial password `admin123`. After signing in, use the **Change password** form at the top of the admin panel.

## Test commands

```powershell
npm test
npm run build
```

The local smoke checks cover health, public seeded pages/services/FAQs, admin authentication, WYSIWYG sanitization, enquiry persistence, dry-run email delivery, validation, and unauthorised admin access.

## API highlights

- `GET /health`
- `GET /api/public/pages/:slug`
- `GET /api/public/services`
- `GET /api/public/faqs`
- `POST /api/admin/auth/login`
- `GET /api/admin/pages`
- `GET /api/admin/pages/:id`
- `PATCH /api/admin/sections/:id`
- `GET /api/admin/enquiries`
- `POST /ywc/api/enquiry`
