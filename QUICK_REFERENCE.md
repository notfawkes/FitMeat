# FitMeat Auth Quick Reference

## Quick Start (5 minutes)

```bash
# Terminal 1: Start MailHog
mailhog

# Terminal 2: Start Backend
cd backend && npm run dev

# Terminal 3: Start Frontend  
npm run dev
```

Then visit `http://localhost:5173`

## Key Files

| File | Purpose |
|------|---------|
| `src/context/AuthContext.tsx` | Global auth state & hooks |
| `src/services/authClient.ts` | Auth API calls |
| `src/services/apiClient.ts` | Generic HTTP client |
| `src/pages/LoginPage.tsx` | Login page |
| `src/pages/RegisterPage.tsx` | Register page |
| `src/pages/ProfilePage.tsx` | Profile with orders |
| `backend/src/routes/authRoutes.ts` | Backend auth endpoints |

## Using Auth in Components

```typescript
import { useAuth } from '../context/AuthContext';

export function MyComponent() {
  const { user, profile, orders, logout, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return (
    <div>
      <h1>Welcome, {profile?.name}</h1>
      <p>Orders: {orders.length}</p>
      <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
    </div>
  );
}
```

## API Calls with Auth

```typescript
import { apiClient } from '../services/apiClient';

// GET request (auto includes JWT)
const data = await apiClient.get('/api/orders');

// POST request (auto includes JWT)
const response = await apiClient.post('/api/orders', {
  total_amount: 500,
  items: [...],
  status: 'completed'
});

// Token automatically refreshed on 401
// No extra code needed!
```

## Environment Variables

### Frontend
```env
VITE_API_URL=http://localhost:4000
```

### Backend
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=fitmeat
PORT=4000
JWT_SECRET=your-secret-key-here
SMTP_HOST=localhost
SMTP_PORT=1025
```

## Common Tasks

### Protect a Route
```typescript
if (!user) {
  return <Navigate to="/login" replace />;
}
```

### Access Current User
```typescript
const { user, profile } = useAuth();
console.log(user?.email);      // User email
console.log(profile?.name);    // User name
```

### Make API Request
```typescript
const { accessToken } = useAuth();
const response = await apiClient.get('/api/something');
// Token auto-included!
```

### Handle Login
```typescript
const { login } = useAuth();
await login({ email: 'user@example.com', password: 'pass' });
// Redirect after successful login
```

### Logout
```typescript
const { logout } = useAuth();
const handleLogout = () => {
  logout();
  navigate('/login');
};
```

## Debugging

### Check Tokens
```javascript
// In browser console (F12)
localStorage.getItem('fitmeat_access_token');
localStorage.getItem('fitmeat_refresh_token');
```

### Check Auth State
```javascript
// Cannot log from console, but in component:
const { user, profile, orders } = useAuth();
console.log({ user, profile, orders });
```

### Check Backend Request
```bash
# In backend terminal, add logging:
console.log('Request:', req.body);
console.log('User:', req.user);
```

### Check Emails
```
Open http://localhost:8025
Look for emails from noreply@fitmeat.com
```

## Common Errors

| Error | Solution |
|-------|----------|
| 401 Unauthorized | Token expired - will auto-refresh |
| 422 Invalid Email | Check email format |
| Cannot find module | Run `npm install` in backend |
| Cannot connect to DB | Check PostgreSQL running |
| Email not received | Check MailHog at :8025 |

## File Locations Quick Reference

```
Frontend:
├── src/context/AuthContext.tsx       ← Auth state
├── src/services/authClient.ts         ← Auth API
├── src/services/apiClient.ts          ← HTTP client
└── src/pages/
    ├── LoginPage.tsx
    ├── RegisterPage.tsx
    ├── ProfilePage.tsx
    └── CheckoutPage.tsx

Backend:
├── backend/src/routes/authRoutes.ts   ← Auth endpoints
├── backend/src/services/authService.ts ← Auth logic
├── backend/src/models/userModel.ts     ← User queries
└── backend/.env                         ← Config

Database:
└── data.sql                             ← Schema + seed
```

## Database Tables

```sql
-- Users & Auth
users                       -- User accounts
email_verification_tokens  -- Email verification
password_reset_tokens      -- Password reset
refresh_tokens             -- Token storage

-- Business
profiles                   -- User profile info
orders                     -- Order history
```

## Token Details

**Access Token**
- Size: ~1KB JWT
- Valid: 1 hour
- Used: API requests
- Storage: localStorage

**Refresh Token**
- Size: ~500B JWT
- Valid: 7 days
- Used: Get new access token
- Storage: localStorage

## Monitoring

### See Backend Logs
```bash
cd backend && npm run dev
# Watch logs in terminal
```

### See Frontend Errors
```
Open http://localhost:5173
Press F12 to open Developer Tools
Watch Console tab
```

### See All Emails
```
Open http://localhost:8025
See all sent emails in MailHog UI
```

## Performance Tips

1. **Minimize API Calls**
   - useAuth() provides profile + orders
   - Don't make extra /auth/me calls

2. **Cache User Data**
   - useAuth() auto-caches in state
   - Clear on logout only

3. **Lazy Load**
   - Profile loads on component mount
   - Orders included in /auth/me

## Security Checklist

- ✅ Tokens in localStorage (can move to cookies)
- ✅ HTTPS in production only
- ✅ JWT secrets are random
- ✅ Passwords hashed with bcrypt
- ✅ Email verification required
- ✅ Token expiry enforced
- ✅ CORS configured
- ✅ Input validated

## More Help

1. See `SETUP_GUIDE.md` for full setup
2. See `FRONTEND_AUTH_GUIDE.md` for architecture
3. See `backend/README.md` for API docs
4. See `MIGRATION_COMPLETE.md` for status

---
Last updated: January 2024
Status: Production Ready ✅
