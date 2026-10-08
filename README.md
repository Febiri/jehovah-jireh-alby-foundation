# Jehovah Jireh Alby Foundation — Full-Stack Platform + CMS

Christian charitable foundation site (React + Vite + Express) caring for orphans,
street children, vulnerable children and the needy in Ghana.

## Quick start

```bash
cp .env.example .env   # fill in real secrets (never commit .env)
npm install
npm install --prefix client
npm run build --prefix client   # builds client/dist (served by Express in production)
npm start                        # API + static site on $PORT (default 5000)
```

Admin CMS: `/admin/login`. API health: `GET /api/health`.

## Environment

| Key | Required | Notes |
|-----|----------|-------|
| `JWT_SECRET` | yes (32+ chars) | Server refuses to start without it. Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_TTL` | no | Default `8h`. Use `2h` in production. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | fresh installs | Seed the two bootstrap admins. Existing `server/data/database.json` is authoritative afterwards. |
| `FOUNDATION_EMAIL` / `FOUNDATION_PASSWORD` | fresh installs | Second admin seed. |
| `CORS_ORIGINS` | production | Comma-separated origins, e.g. `https://jjafoundation.org,https://www.jjafoundation.org`. Empty = allow all (dev only). |
| `PORT` / `NODE_ENV` | no | Defaults `5000` / `production`. |

## Donations (honest pledge model — no gateway yet)

Online card charging is **not** integrated (planned: Paystack / Hubtel / Flutterwave).
Until then:

- All `POST /api/donations` entries are stored as **`Pending`**.
- The donor completes the transfer manually (MoMo / bank) using the shown instructions + reference.
- An admin verifies receipt and marks the pledge **Completed** (Admin → Donations → Confirm) or **Failed**.
- Never present pledges as completed payments in copy or UI.

## Security model

- `helmet` headers, CORS allowlist, `trust proxy`, 200kb JSON limit.
- Rate limits: global API 600/15min, login 10/15min, public writes 60/hour.
- Account lockout: 5 failed logins → 15min lock.
- Passwords: bcrypt cost 12, min 10 chars with upper + lower + number, change revokes old tokens (`token_version`).
- RBAC: `admin` can create/update; `superadmin` required for deletes, settings, what-we-do, and data export.
- Uploads: JPG/PNG/WebP only (extension AND mimetype), 5MB, served from `/uploads`.
- Validation: amounts 1–10,000,000, enum-checked currency/method/frequency/status, length-capped strings.

## Storage & backups (important)

Default storage is **local** and ephemeral-host unsafe:

- `server/data/database.json` (auto-created; corrupt files are quarantined as `.corrupt.*.bak`, never silently overwritten)
- `server/uploads/` (runtime images)

Take regular backups:

1. Admin → Settings → **Download JSON backup**, or `GET /api/admin/export` (superadmin).
2. Store offsite (dated). To restore, stop the server, replace `server/data/database.json`, restart.
3. Plan the move to Postgres + S3/Cloudinary before serious production use.

## Tests

```bash
npm test   # boots against http://localhost:5000 (set BASE_URL to override)
```

Covers public content APIs, donation/contact submission, auth rejection, admin CRUD,
and donation filtering. Admin credentials come from `.env` (`ADMIN_EMAIL`/`ADMIN_PASSWORD`).

## Project layout

- `server/index.js` — Express API, static serving of `client/dist` + SPA fallback
- `server/auth.js` — JWT + RBAC (fail-fast without `JWT_SECRET`)
- `server/db.js` — JSON store with allowlisted updates, pagination-safe filters, audit log
- `client/src/pages/` — Home, About, WhatWeDo, Projects, Gallery, Donate, Contact, Legal (Privacy/Terms/Safeguarding/Transparency)
- `client/src/pages/admin/` — Dashboard, Projects, Gallery, Donations (pledge verification), Messages, Content, Settings (+ backup)
- `client/public/robots.txt`, `client/public/sitemap.xml` — update domain in `index.html` canonical + JSON-LD before launch
