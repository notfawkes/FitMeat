# FitMeat Full-Stack Setup Guide

## Overview

FitMeat is a React + Vite frontend with a custom Node/Express backend for authentication and order management. This guide covers the complete setup.

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- MailHog (for email in development)

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Frontend
cd FitMeat
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Database Setup

Create a PostgreSQL database:
```sql
CREATE DATABASE fitmeat;
```

Then run the schema:
```bash
psql -U postgres -d fitmeat < data.sql
```

This creates:
- `users` table (for auth)
- `profiles` table (for user info)
- `orders` table (for order history)
- Token tables (email_verification_tokens, password_reset_tokens, refresh_tokens)

### 3. Backend Configuration

Create `backend/.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=fitmeat

# Server
PORT=4000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-too
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# Email
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=noreply@fitmeat.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Frontend Configuration

Create `.env.local`:
```env
VITE_API_URL=http://localhost:4000
```

### 5. Start Services

#### Terminal 1: MailHog (Email Delivery)
```bash
# Install mailhog (macOS): brew install mailhog
# Or download from: https://github.com/mailhog/MailHog/releases
mailhog
# SMTP: http://localhost:1025
# UI: http://localhost:8025
```

#### Terminal 2: Backend
```bash
cd backend
npm run dev
# Runs on http://localhost:4000
```

#### Terminal 3: Frontend
```bash
npm run dev
# Runs on http://localhost:5173
```

## Project Structure

```
FitMeat/
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── context/          # AuthContext
│   ├── services/         # API clients (apiClient, authClient)
│   ├── App.tsx           # Main app with router
│   ├── main.tsx          # Entry point
│   └── supabaseClient.ts # Legacy Supabase (not used for auth)
├── backend/
│   ├── src/
│   │   ├── config.ts     # Database & JWT config
│   │   ├── db.ts         # PostgreSQL connection
│   │   ├── models/       # Database queries
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   ├── app.ts        # Express app setup
│   │   └── server.ts     # Server entry point
│   ├── .env.example      # Environment template
│   ├── package.json
│   └── tsconfig.json
├── data.sql              # Database schema & seed data
└── FRONTEND_AUTH_GUIDE.md
```

## Authentication Flow

### Signup
```
User fills form
↓
POST /api/auth/signup (email, password, name)
↓
Backend: hash password, create user, send verification email
↓
Frontend: redirect to verify email page
↓
User clicks email link → Backend verifies email
↓
User logs in with credentials
```

### Login
```
User enters email/password
↓
POST /api/auth/login
↓
Backend: verify credentials, return tokens
↓
Frontend: save tokens to localStorage
↓
GET /api/auth/me (get profile + orders)
↓
Frontend: display profile page
```

### Logout
```
User clicks logout
↓
Frontend: clear localStorage tokens
↓
Frontend: redirect to login
```

### Token Refresh
```
API request gets 401
↓
Frontend: POST /api/auth/refresh with refreshToken
↓
Backend: validate refresh token, return new accessToken
↓
Retry original request with new token
```

## Testing the Setup

### 1. Test Backend Compilation
```bash
cd backend
npx tsc --noEmit
# Should show no errors
```

### 2. Test Database Connection
```bash
cd backend
npm run dev
# Should show "Connected to PostgreSQL" in logs
```

### 3. Test Frontend
```bash
npm run dev
# Open http://localhost:5173
# Click Register → fill form → should see "verification email sent"
```

### 4. Check Verification Email
```
Open http://localhost:8025 (MailHog UI)
Look for email from noreply@fitmeat.com
Click verification link
Should be redirected to login
```

### 5. Test Login
```
Use email/password from signup
Should be redirected to profile page
```

## API Endpoints

### Authentication

```
POST /api/auth/signup
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}

Response:
{ "message": "Signup successful. Please verify your email." }
```

```
POST /api/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

```
GET /api/auth/me
Authorization: Bearer <accessToken>

Response:
{
  "user": { "id": "...", "email": "..." },
  "profile": { "name": "...", "address": "..." },
  "orders": [...]
}
```

```
POST /api/auth/refresh
Content-Type: application/json
{ "refreshToken": "eyJhbGc..." }

Response:
{ "accessToken": "eyJhbGc..." }
```

### Orders

```
POST /api/orders
Authorization: Bearer <accessToken>
Content-Type: application/json
{
  "order_date": "2024-01-01T12:00:00Z",
  "total_amount": 500,
  "items": [...],
  "status": "completed"
}

Response:
{ "orderId": "..." }
```

## Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf backend/node_modules
cd backend && npm install
```

### Database connection fails
```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Check DB credentials in .env match PostgreSQL setup
# Default: postgres/password, database: fitmeat
```

### MailHog not receiving emails
```bash
# Verify MailHog is running on port 1025
lsof -i :1025

# Check SMTP_HOST=localhost in .env
# Check MailHog UI at http://localhost:8025
```

### Frontend can't connect to backend
```bash
# Verify backend is running
curl http://localhost:4000/api/health

# Check VITE_API_URL in .env.local
# Should be http://localhost:4000

# Check CORS is enabled in backend (app.ts)
```

### Login returns 401
```bash
# Verify user exists in database
psql -U postgres -d fitmeat -c "SELECT * FROM users;"

# Check password hash is valid
# Verify JWT_SECRET matches between requests
```

## Production Deployment

### Environment Variables

Set these on your production server:
```env
NODE_ENV=production
JWT_SECRET=<very-long-random-secret>
JWT_REFRESH_SECRET=<very-long-random-secret>
SMTP_HOST=<your-email-service>
SMTP_PORT=<your-email-port>
SMTP_USER=<your-email-user>
SMTP_PASSWORD=<your-email-password>
FRONTEND_URL=https://yourdomain.com
```

### Security Checklist

- [ ] All environment variables set on server
- [ ] JWT secrets are cryptographically random
- [ ] Database has strong password
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Refresh tokens in httpOnly cookies (not localStorage)
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints

### Database Backup

```bash
# Backup
pg_dump -U postgres fitmeat > backup.sql

# Restore
psql -U postgres fitmeat < backup.sql
```

## Useful Commands

```bash
# Backend
cd backend
npm run dev          # Start dev server
npm run build        # Compile TypeScript
npm run start        # Start production
npm test            # Run tests

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Database
psql -U postgres -d fitmeat  # Connect to DB
\dt                           # List tables
\d users                      # Show users table schema
SELECT * FROM users;         # Query users
```

## Support

For issues or questions:
1. Check troubleshooting section
2. Review backend logs during errors
3. Check MailHog UI for email issues
4. Verify database connection with `psql`
