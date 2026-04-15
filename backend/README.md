# FitMeat Auth Backend

A custom authentication backend for FitMeat using PostgreSQL, JWT, bcrypt, and SMTP email delivery.

## Setup

1. Copy `.env.example` to `.env` and fill in your values.
2. Run `npm install` inside `backend`.
3. Start MailHog locally:
   - SMTP: `localhost:1025`
   - UI: `http://localhost:8025`
4. Run the backend:
   - `npm run dev`

## API endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/verify-email?token=...`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
