# FitMeat Integration Testing Guide

## Pre-Integration Checklist

### Backend
- [ ] PostgreSQL database running
- [ ] `data.sql` schema imported
- [ ] `backend/.env` configured with correct DB credentials
- [ ] `npm install` completed in backend
- [ ] Backend compiles: `npx tsc --noEmit`
- [ ] MailHog configured for SMTP

### Frontend
- [ ] `npm install` completed
- [ ] `.env.local` with `VITE_API_URL=http://localhost:4000`
- [ ] All pages compile without errors
- [ ] No Supabase auth calls in code

## Step-by-Step Integration Testing

### Phase 1: Service Startup (5 minutes)

#### Terminal 1: MailHog
```bash
mailhog
# Output should show:
# MailHog version ...
# SMTP listening on 0.0.0.0:1025
# UI listening on 0.0.0.0:8025
```

#### Terminal 2: Backend
```bash
cd backend
npm run dev

# Output should show:
# Listening on port 4000
# Connected to PostgreSQL
# JWT configured
# SMTP configured
```

#### Terminal 3: Frontend
```bash
npm run dev

# Output should show:
# VITE v... ready in XXX ms
# Local: http://localhost:5173/
```

### Phase 2: Registration Flow Testing (5 minutes)

#### Test 2.1: Navigate to Register
```
1. Open http://localhost:5173
2. Click "Register" button
3. Should see registration form
4. Verify form has: Email, Password, Name, Phone, Address fields
```

#### Test 2.2: Invalid Email
```
1. Enter: abc (invalid email)
2. Enter password: Test123!
3. Enter name: Test User
4. Click Register
5. Expected: Error message "Invalid email"
```

#### Test 2.3: Successful Registration
```
1. Email: testuser@example.com
2. Password: Test123456
3. Name: Test User
4. Phone: 9876543210
5. Address: 123 Main St, City
6. Click Register
7. Expected: "Check your email to verify" message
8. Check MailHog UI (http://localhost:8025)
9. Should see email from noreply@fitmeat.com
10. Click verification link in email
11. Should redirect to login page
```

### Phase 3: Login Flow Testing (5 minutes)

#### Test 3.1: Wrong Password
```
1. Navigate to /login
2. Email: testuser@example.com
3. Password: wrongpassword
4. Click Login
5. Expected: Error "Invalid credentials"
```

#### Test 3.2: Successful Login
```
1. Email: testuser@example.com
2. Password: Test123456
3. Click Login
4. Expected: Redirect to /profile
5. Should see user name "Test User"
6. Should see email "testuser@example.com"
7. Should see phone and address
8. Should see empty orders list
```

### Phase 4: Protected Route Testing (5 minutes)

#### Test 4.1: Access Protected Route Without Login
```
1. Logout if logged in
2. Navigate directly to /profile
3. Expected: Redirect to /login
```

#### Test 4.2: Access Checkout Without Login
```
1. Clear browser cache/localStorage
2. Navigate directly to /checkout
3. Expected: Redirect to /login
```

#### Test 4.3: Navbar Shows Correct State
```
Without login:
  - Should show "Login" button
  - Should show "Register" button
  - Should NOT show "Profile" link
  - Should NOT show "Logout" button

After login:
  - Should show "Profile" link
  - Should show "Logout" button
  - Should NOT show "Login" button
  - Should NOT show "Register" button
```

### Phase 5: Session Management Testing (10 minutes)

#### Test 5.1: Token Storage
```
1. Login with testuser@example.com
2. Open browser DevTools (F12)
3. Go to Application → Local Storage
4. Should see:
   - fitmeat_access_token (long JWT)
   - fitmeat_refresh_token (long JWT)
5. Tokens should NOT be empty
```

#### Test 5.2: Token Format
```
1. Copy accessToken value
2. Go to https://jwt.io
3. Paste token in "Encoded" field
4. Should decode to show:
   - iss: backend URL
   - sub: user_id
   - email: testuser@example.com
   - exp: future timestamp
```

#### Test 5.3: Auto-Refresh (Optional - Advanced)
```
1. Login and note the access token
2. Wait 1+ hour (or modify JWT_EXPIRY in backend to 10 seconds for testing)
3. Make API request (e.g., add to cart and visit /checkout)
4. Token should auto-refresh behind scenes
5. No error should show to user
```

#### Test 5.4: Logout Clears Session
```
1. Login to get tokens
2. Verify tokens in localStorage
3. Click Logout
4. Verify localStorage is empty
5. Verify redirect to /login
6. Try to access /profile
7. Should redirect to /login (no session)
```

### Phase 6: Cart & Checkout Flow (10 minutes)

#### Test 6.1: Add to Cart
```
1. Login as testuser@example.com
2. On home page, find a meal
3. Add to cart
4. Cart count should increase
5. Verify: /components/CartDropdown shows item
```

#### Test 6.2: Proceed to Checkout
```
1. Have item in cart
2. Click cart icon
3. Click "Checkout" button
4. Should redirect to /checkout
5. First page shows: Cart items, delivery time, payment options
```

#### Test 6.3: Create Order
```
1. On checkout page
2. Select delivery time (e.g., "5:00 PM - 6:00 PM")
3. Select payment method (e.g., "Card")
4. Click "Place Order" button
5. Should show processing
6. Should redirect to /success page
7. Expected: "Order Placed Successfully" message
```

#### Test 6.4: Verify Order in Profile
```
1. From success page, click "Back to Home"
2. Click Profile link in navbar
3. Should see order in "Order History"
4. Check: Order ID, date, total amount, items list
```

### Phase 7: Navigation Testing (5 minutes)

#### Test 7.1: Desktop Navigation
```
1. Login
2. Click Home link - should go to home
3. Click About link - should scroll to about
4. Click Meals link - should scroll to meals
5. Click Profile link - should go to profile
6. Click Logout - should logout and redirect
```

#### Test 7.2: Mobile Navigation (if responsive)
```
1. Open DevTools (F12)
2. Toggle device toolbar (Cmd+Shift+M)
3. Click menu button (hamburger)
4. Should show navigation menu
5. All links should work
```

### Phase 8: Error Handling Testing (10 minutes)

#### Test 8.1: Network Errors
```
1. Stop backend server
2. Try to login
3. Should show error: "Cannot connect to server"
4. Restart backend
5. Login should work
```

#### Test 8.2: Invalid Credentials
```
1. Try login with:
   - Email: nonexistent@example.com
   - Password: anypassword
2. Should show error: "Invalid credentials"
```

#### Test 8.3: Server Errors
```
1. Backend: Stop PostgreSQL
2. Try to login
3. Should show error about database
4. Restart PostgreSQL
5. Login should work
```

#### Test 8.4: Missing Environment Variables
```
1. Remove VITE_API_URL from .env.local
2. Refresh frontend
3. Should show error during API call
4. Add VITE_API_URL back
5. Should work
```

## Automated Testing Checklist

Run through complete user journey:

```
[ ] Registration
  - [ ] Invalid email rejected
  - [ ] Password validated
  - [ ] Verification email sent
  - [ ] Email link works
  - [ ] Account activated

[ ] Login
  - [ ] Wrong password rejected  
  - [ ] Correct credentials accepted
  - [ ] Tokens stored in localStorage
  - [ ] Profile page loaded
  - [ ] User data displayed

[ ] Protected Routes
  - [ ] Cannot access without login
  - [ ] Auto-redirect to login
  - [ ] After login, can access

[ ] Session Management
  - [ ] Tokens present in localStorage
  - [ ] Logout clears tokens
  - [ ] Cannot use old tokens after logout
  - [ ] Can login again after logout

[ ] Checkout Flow
  - [ ] Add items to cart
  - [ ] Cart count updates
  - [ ] Checkout loads
  - [ ] Order created
  - [ ] Order appears in profile

[ ] Navigation
  - [ ] All links work
  - [ ] Correct pages load
  - [ ] Mobile menu works

[ ] Error Handling
  - [ ] Network errors caught
  - [ ] Validation errors shown
  - [ ] User-friendly messages
  - [ ] Can recover from errors
```

## Performance Testing

### Load Times
```
- Initial page load:      < 2 seconds
- Login API call:         < 1 second
- Profile load:           < 500ms
- Checkout load:          < 500ms
- Order creation:         < 2 seconds
```

### Memory Usage
```
- Initial load:           < 20 MB
- After login:            < 25 MB
- localStorage usage:     < 5 KB
```

## Debugging Guide

### If Login Fails
```
1. Check backend is running (port 4000)
2. Check PostgreSQL is running
3. Check .env in backend has correct DB credentials
4. Check frontend .env.local has VITE_API_URL=http://localhost:4000
5. Check browser console (F12) for errors
6. Check backend logs for error messages
```

### If Email Not Received
```
1. Check MailHog is running (port 1025)
2. Check MailHog UI: http://localhost:8025
3. Check backend .env has SMTP_HOST=localhost, SMTP_PORT=1025
4. Try registration again
5. Check "Inbox" in MailHog UI
```

### If Profile Doesn't Load
```
1. Verify JWT token exists in localStorage
2. Try logout and login again
3. Check backend logs for /auth/me errors
4. Check database has user and profile records:
   psql -U postgres -d fitmeat -c "SELECT * FROM users;"
   psql -U postgres -d fitmeat -c "SELECT * FROM profiles;"
```

### If Order Won't Create
```
1. Verify logged in (user in localStorage)
2. Verify delivery time selected
3. Check backend /api/orders endpoint
4. Check database orders table
5. Check backend logs for errors
```

## Sign-Off Checklist

Before marking integration complete:

- [ ] All 7+ phases tested successfully
- [ ] No critical errors found
- [ ] All happy path flows work
- [ ] Error handling works properly
- [ ] Performance acceptable
- [ ] Code compiles without critical errors
- [ ] Documentation understood
- [ ] Team trained on new auth system

## Success Criteria

Integration is successful when:

✅ User can register with verification email  
✅ User can login with credentials  
✅ Profile displays user data  
✅ Orders are saved and displayed  
✅ Checkout completes successfully  
✅ Logout clears session  
✅ All routes protected appropriately  
✅ Error messages are helpful  
✅ No breaking changes from Supabase  

## Next Steps

1. **Fix any issues** found during testing
2. **Update documentation** based on learnings
3. **Code review** with team
4. **Merge to main** branch
5. **Deploy to staging** for UAT
6. **Deploy to production** with database backup

---

**Integration Status**: Ready to Begin  
**Expected Duration**: 2-4 hours for full testing  
**Difficulty**: Medium (straightforward flows)  
**Risk Level**: Low (isolated auth system)
