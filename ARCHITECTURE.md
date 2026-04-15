# FitMeat Authentication Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND (React + Vite)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Pages:                                                          │
│  ├─ LoginPage         → authClient.login()                       │
│  ├─ RegisterPage      → authClient.signup()                      │
│  ├─ ProfilePage       → useAuth() + apiClient.get('/orders')    │
│  ├─ CheckoutPage      → apiClient.post('/orders')               │
│  └─ SuccessPage       → (no auth needed)                         │
│                                                                  │
│  Components:                                                     │
│  ├─ Navbar            → useAuth() for session check             │
│  ├─ CartDropdown      → useAuth() for user check                │
│  └─ Footer            → (static)                                │
│                                                                  │
│  Services:                                                       │
│  ├─ authClient.ts     → signup, login, refresh, getMe           │
│  └─ apiClient.ts      → Generic HTTP + auto auth injection      │
│                                                                  │
│  State:                                                          │
│  └─ AuthContext       → user, profile, orders, tokens, loading  │
│                                                                  │
│  Storage:                                                        │
│  └─ localStorage      → accessToken, refreshToken               │
│                                                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS (in production)
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                       BACKEND (Node/Express)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Routes: /api/auth/                                             │
│  ├─ POST   /signup       → Validate, hash, send email           │
│  ├─ POST   /login        → Validate, return tokens              │
│  ├─ GET    /me           → Get user + profile + orders          │
│  ├─ POST   /refresh      → Generate new accessToken             │
│  ├─ GET    /verify-email → Mark account as verified             │
│  └─ POST   /forgot-password → Send reset link                   │
│                                                                  │
│  Routes: /api/                                                  │
│  └─ POST   /orders       → Create new order (protected)         │
│                                                                  │
│  Middleware:                                                     │
│  ├─ CORS (allow frontend)                                       │
│  ├─ authMiddleware (require JWT)                                │
│  └─ validationMiddleware (Zod)                                  │
│                                                                  │
│  Services:                                                       │
│  ├─ authService.ts      → Auth logic & JWT management           │
│  ├─ userService.ts      → User operations                       │
│  ├─ orderService.ts     → Order creation                        │
│  ├─ emailService.ts     → Email sending via SMTP                │
│  └─ tokenService.ts     → Token generation & validation         │
│                                                                  │
│  Models (Database Queries):                                     │
│  ├─ userModel.ts        → User CRUD                             │
│  ├─ profileModel.ts     → Profile CRUD                          │
│  ├─ orderModel.ts       → Order operations                      │
│  ├─ tokenModel.ts       → Token storage                         │
│  └─ emailModel.ts       → Email token operations                │
│                                                                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │ TCP (localhost:5432, Docker, or remote)
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                   PostgreSQL Database                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tables:                                                         │
│  ├─ users                      (id, email, password_hash)       │
│  ├─ profiles                   (id, name, phone, address)       │
│  ├─ orders                     (id, user_id, items, total)      │
│  ├─ email_verification_tokens  (token, user_id, expires)        │
│  ├─ password_reset_tokens      (token, user_id, expires)        │
│  └─ refresh_tokens             (token, user_id, expires)        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                       │
                       │ SMTP (localhost:1025 for dev)
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                     MailHog (Development)                       │
├─────────────────────────────────────────────────────────────────┤
│       Captures emails sent by backend                           │
│       UI: http://localhost:8025                                 │
│       For production: use SendGrid, AWS SES, etc.               │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow Sequence

```
User Registration:
───────────────────

User fills form                    Frontend
    ↓
POST /api/auth/signup              Frontend → Backend
    {email, password, name, ...}
    ↓
Validate input                     Backend
    ↓
Hash password (bcrypt)             Backend
    ↓
Create user in DB                  Backend → Database
    ↓
Generate verification token        Backend
    ↓
Send email with link               Backend → MailHog
    ↓
Show "Check email" message         Frontend
    ↓
User clicks email link             User
    ↓
GET /api/auth/verify-email?token=  Frontend → Backend
    ↓
Verify token matches DB            Backend → Database
    ↓
Mark user as verified              Backend → Database
    ↓
Redirect to login                  Frontend
    ↓
Ready to log in!


User Login:
──────────

User enters credentials            Frontend
    ↓
POST /api/auth/login               Frontend → Backend
    {email, password}
    ↓
Validate input (Zod)               Backend
    ↓
Find user in DB                    Backend → Database
    ↓
Compare password with hash         Backend
    ↓
Generate JWT tokens                Backend
  - accessToken (1 hour)
  - refreshToken (7 days)
    ↓
Return tokens                      Backend → Frontend
    ↓
Store in localStorage              Frontend
    ↓
GET /api/auth/me with JWT          Frontend → Backend
    ↓
Return user + profile + orders     Backend → Database → Frontend
    ↓
Update AuthContext                 Frontend
    ↓
Redirect to profile                Frontend
    ↓
User logged in!


Making Protected Request:
─────────────────────────

POST /api/orders                   Frontend
  Headers: {Authorization: Bearer <accessToken>}
    ↓
Middleware verifies JWT            Backend
    ↓
Extract user ID from token         Backend
    ↓
Process request                    Backend
    ↓
Return response                    Backend → Frontend
    ↓
If 401: Auto-refresh token         Frontend
  POST /api/auth/refresh
    ↓
Retry original request             Frontend → Backend
    ↓
Success!


Logout:
───────

User clicks logout                 Frontend
    ↓
Clear localStorage tokens          Frontend
    ↓
Clear AuthContext state            Frontend
    ↓
Redirect to login                  Frontend
    ↓
Backend: Token no longer valid     (No action needed)
    ↓
Logged out!
```

## Component Dependency Tree

```
App
├─ AuthProvider
│  └─ Router
│     ├─ LoginPage
│     │  └─ useAuth() → login()
│     ├─ RegisterPage
│     │  └─ useAuth() → signup()
│     ├─ ProfilePage
│     │  └─ useAuth() → user, profile, orders, logout
│     ├─ CheckoutPage
│     │  ├─ useAuth() → user
│     │  └─ apiClient.post('/orders')
│     └─ SuccessPage
│
├─ Navbar
│  ├─ useAuth() → user, logout
│  └─ CartDropdown
│     └─ useAuth() → user
│
└─ Footer
```

## Token Lifecycle

```
User logs in
    ↓
Backend: Generate JWT tokens
    ├─ Access Token: {user_id, email, exp: now + 1h}
    └─ Refresh Token: {user_id, exp: now + 7d}
    ↓
Frontend: Store in localStorage
    ├─ localStorage['fitmeat_access_token'] = accessToken
    └─ localStorage['fitmeat_refresh_token'] = refreshToken
    ↓
Use for API requests
    └─ Authorization: Bearer <accessToken>
    ↓
Token expires after 1 hour
    ↓
Any API request with expired token gets 401
    ↓
Frontend: Auto-refresh
    └─ POST /api/auth/refresh
       Body: {refreshToken}
    ↓
Backend: Validate refresh token, generate new access token
    ↓
Frontend: Update localStorage, retry request
    ↓
Success! (No user action needed)
    ↓
Repeat for next 7 days
    ↓
Refresh token expires
    ↓
Frontend: Force logout, redirect to login
    └─ User must log in again
```

## File Structure with Dependencies

```
src/
├─ context/
│  └─ AuthContext.tsx           [exports AuthProvider, useAuth]
│     └─ imports: authClient, useState, useContext
│
├─ services/
│  ├─ authClient.ts             [signup, login, refresh, getMe]
│  │  └─ imports: apiClient
│  │
│  └─ apiClient.ts              [get, post, put, delete]
│     └─ imports: fetch, JWT handling
│
├─ pages/
│  ├─ LoginPage.tsx
│  │  └─ imports: useAuth, authClient
│  ├─ RegisterPage.tsx
│  │  └─ imports: useAuth, authClient
│  ├─ ProfilePage.tsx
│  │  └─ imports: useAuth, apiClient, Navigate
│  ├─ CheckoutPage.tsx
│  │  └─ imports: useAuth, apiClient, Navigate
│  └─ SuccessPage.tsx
│
├─ components/
│  ├─ Navbar.tsx
│  │  └─ imports: useAuth
│  ├─ CartDropdown.tsx
│  │  └─ imports: useAuth
│  └─ ... other components
│
└─ App.tsx
   ├─ imports: AuthProvider, Router, Pages
   └─ wraps app in AuthProvider
```

## Environment Variables Flow

```
Frontend:
  .env.local
  └─ VITE_API_URL=http://localhost:4000
     └─ used in apiClient.ts baseUrl
        └─ used in every API call

Backend:
  .env
  ├─ DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
  │  └─ used in config.ts
  │     └─ used in db.ts connection
  │        └─ used in every database query
  ├─ JWT_SECRET, JWT_REFRESH_SECRET
  │  └─ used in authService.ts
  │     └─ used in signing and verifying tokens
  ├─ SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
  │  └─ used in emailService.ts
  │     └─ used for sending verification emails
  └─ PORT, NODE_ENV, FRONTEND_URL
     └─ used in server startup and CORS config
```

## Error Handling Flow

```
Frontend Error:
  User enters invalid email
    ↓
Frontend validation
  formValidator.email()
    ↓
Show error to user
  "Invalid email format"
    ↓
User corrects and retries

Backend Error:
  User not found
    ↓
Backend returns 404
    ↓
Frontend catches in try/catch
    ↓
Show error to user
  "Invalid credentials"
    ↓
User retries

Network Error:
  Backend not running
    ↓
apiClient catches error
    ↓
Show error to user
  "Cannot connect to server"
    ↓
User checks backend is running

Token Error:
  Access token expired
    ↓
API gets 401
    ↓
Frontend auto-refresh refresh token
    ↓
If refresh fails: logout, redirect to login
    ↓
User logs in again
```

---

This architecture provides:
- ✅ Secure JWT-based authentication
- ✅ Email verification requirement
- ✅ Automatic token refresh
- ✅ Protected API routes
- ✅ User profile + order history
- ✅ Clean separation of concerns
- ✅ Type-safe endpoints and state
- ✅ Proper error handling
