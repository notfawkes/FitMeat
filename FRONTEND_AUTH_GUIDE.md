# FitMeat Frontend - Custom Backend Auth Integration

## Overview

The frontend has been migrated from Supabase Auth to a custom JWT-based authentication system using a custom backend. This guide documents the architecture and setup.

## Architecture

### Authentication Flow

1. **Signup**: User registers → Backend sends verification email → User verifies email → Account activated
2. **Login**: User logs in → Backend returns access + refresh tokens → Frontend stores tokens
3. **Session Management**: Access token used for API calls, refresh token handles token rotation
4. **Logout**: Tokens cleared from localStorage

### Key Components

#### Auth Context (`src/context/AuthContext.tsx`)
- Manages global auth state: `user`, `profile`, `orders`, `accessToken`, `refreshToken`
- Provides hooks: `signup()`, `login()`, `logout()`, `reloadProfile()`, `refreshAccessToken()`
- Auto-initializes from localStorage on app start
- Clears session on logout or auth failure

#### Auth Client (`src/services/authClient.ts`)
- API wrapper for all backend auth endpoints
- Handles signup, login, refresh, and password management
- Returns typed responses (user data, tokens, etc.)

#### API Client (`src/services/apiClient.ts`)
- Generic HTTP client for all API requests
- Automatically includes access token in Authorization header
- Handles 401 responses by attempting token refresh
- Base URL configured via `VITE_API_URL` env var

### Pages Updated

#### Login (`src/pages/LoginPage.tsx`)
- Uses `useAuth()` to access login function
- Validates email/password, calls backend login
- Redirects to profile on success

#### Register (`src/pages/RegisterPage.tsx`)
- Uses `useAuth()` to access signup function
- Shows verification email prompt after signup
- Redirects to login after successful registration

#### Profile (`src/pages/ProfilePage.tsx`)
- Protected: redirects to login if no user
- Displays user profile from `useAuth()` context
- Shows order history from context
- Uses logout from context

#### Checkout (`src/pages/CheckoutPage.tsx`)
- Protected: redirects to login if no user
- Creates orders via `apiClient.post('/orders', ...)`
- Navigates to success page after order creation

### Components Updated

#### Navbar (`src/components/Navbar.tsx`)
- Uses `useAuth()` for user state instead of Supabase session
- Logout calls `logout()` from context

#### CartDropdown (`src/components/CartDropdown.tsx`)
- Uses `useAuth()` to check if user is logged in
- Shows checkout button only if user exists

## Environment Setup

### Frontend
```bash
cd src
copy .env.example to .env.local
```

Set these variables:
```
VITE_API_URL=http://localhost:4000
```

### Backend
See `backend/README.md` for backend setup instructions.

## API Endpoints Used

- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get tokens
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user + profile + orders
- `POST /orders` - Create a new order

## Token Management

### Access Token
- Short-lived (typically 1 hour)
- Stored in localStorage
- Included in Authorization header for all requests

### Refresh Token
- Long-lived (typically 7 days or more)
- Stored in localStorage
- Used automatically when access token expires

### Token Refresh Flow
1. API request fails with 401 (unauthorized)
2. Frontend calls `GET /auth/refresh` with refresh token
3. Backend returns new access token
4. Retry original request with new token
5. If refresh fails, clear session and redirect to login

## Local Storage Keys

- `fitmeat_access_token` - JWT access token
- `fitmeat_refresh_token` - JWT refresh token

## Email Verification

After signup:
1. User receives verification email (via MailHog in dev)
2. Email contains verification link with token
3. Clicking link verifies the account
4. User can now log in

## Development

### Running the App
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Key Dependencies
- React + React Router for UI routing
- Custom AuthContext for state management
- Axios (via apiClient) for HTTP requests
- TypeScript for type safety

## Troubleshooting

### "Not authenticated" Error
- Check `VITE_API_URL` matches backend URL
- Verify tokens in localStorage (F12 → Application → Local Storage)
- Check backend is running

### Login/Register Fails with 422
- Check email format
- Verify password meets requirements (if any)
- Check backend logs for details

### Profile Page Shows No Orders
- Orders only appear after successful order creation
- Check backend `/auth/me` endpoint returns orders

### Email Not Received
- In development, check MailHog at http://localhost:1025
- Verify MailHog service is running

## Migration from Supabase

All references to `supabase-js` have been removed from auth flows:
- ❌ `supabase.auth.signUp()` → ✅ `authClient.signup()`
- ❌ `supabase.auth.signInWithPassword()` → ✅ `authClient.login()`
- ❌ `supabase.auth.signOut()` → ✅ `logout()` from context
- ❌ `supabase.auth.getSession()` → ✅ `useAuth().user`

Supabase client is still available (`src/supabaseClient.ts`) if needed for data operations, but all authentication now goes through the custom backend.

## Security Notes

- Access tokens never stored in cookies (localStorage only)
- Refresh tokens also in localStorage (consider httpOnly cookies in production)
- All API requests over HTTPS (in production)
- Token expiration prevents indefinite session access
- Logout clears both tokens immediately

## Future Improvements

1. Move refresh token to httpOnly cookie for better security
2. Add password reset flow UI
3. Add account edit/profile update
4. Add two-factor authentication
5. Add social login providers
