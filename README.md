# FitMeat - Premium Fresh Meat Delivery

A React + Vite frontend marketplace with a custom Node/Express authentication backend for premium quality meat delivery to fitness enthusiasts.

## Features

- User authentication with JWT tokens
- Email verification and password reset
- Browse and add meals to cart
- Secure checkout with multiple payment options
- Order history and tracking
- Profile management
- Responsive design with Tailwind CSS

## Quick Start

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete setup instructions including:
- Frontend & backend installation
- Database setup
- Email configuration
- Running services

## Project Structure

- **Frontend**: React + Vite + TypeScript in `src/`
- **Backend**: Node/Express + PostgreSQL in `backend/`
- **Database**: PostgreSQL with schema in `data.sql`

## Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup and deployment guide
- [FRONTEND_AUTH_GUIDE.md](./FRONTEND_AUTH_GUIDE.md) - Frontend authentication architecture
- [backend/README.md](./backend/README.md) - Backend API details

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for bundling
- React Router for navigation
- Tailwind CSS for styling
- Custom AuthContext for state management

### Backend
- Node.js + Express
- PostgreSQL database
- bcryptjs for password hashing
- jsonwebtoken for JWT tokens
- nodemailer for email delivery
- Zod for input validation

### Tools & Services
- MailHog for email testing (dev)
- Git for version control

## Running the App

```bash
# 1. Setup (see SETUP_GUIDE.md for details)
cp backend/.env.example backend/.env   # Update with your DB credentials
cp .env.example .env.local              # Update with backend URL

# 2. Start MailHog (Terminal 1)
mailhog

# 3. Start Backend (Terminal 2)
cd backend && npm run dev

# 4. Start Frontend (Terminal 3)
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoints

See [backend/README.md](./backend/README.md) for full API documentation.

### Key Endpoints
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile & orders
- `POST /api/orders` - Create order

## Database

The database schema includes:
- Users (authentication)
- Profiles (user info)
- Orders (order history)
- Token tables (verification, password reset, refresh)

Initialize with:
```bash
psql -U postgres -d fitmeat < data.sql
```

## Development

### Frontend Scripts
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

### Backend Scripts
```bash
cd backend
npm run dev      # Start dev server
npm run build    # Compile TypeScript
npm test         # Run tests
```

## Authentication

The app uses JWT tokens for authentication:
- **Access Token**: 1 hour validity, used for API requests
- **Refresh Token**: 7 days validity, used to get new access tokens
- Tokens stored in localStorage
- Automatic token refresh on expiry

See [FRONTEND_AUTH_GUIDE.md](./FRONTEND_AUTH_GUIDE.md) for architecture details.

## Environment Variables

### Frontend `.env.local`
```env
VITE_API_URL=http://localhost:4000
```

### Backend `.env`
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=fitmeat
PORT=4000
JWT_SECRET=your-secret-key
SMTP_HOST=localhost
SMTP_PORT=1025
```

## Troubleshooting

Common issues and solutions:

1. **Database connection fails**
   - Check PostgreSQL is running
   - Verify credentials in `backend/.env`

2. **Email verification not received**
   - Check MailHog UI at `http://localhost:8025`
   - Verify SMTP config in `backend/.env`

3. **Frontend can't connect to backend**
   - Check backend is running on port 4000
   - Verify `VITE_API_URL` in `.env.local`

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting.

## Production Deployment

Before deploying to production:
1. Update all environment variables
2. Enable HTTPS
3. Configure CORS properly
4. Use strong, random JWT secrets
5. Set up proper email service
6. Enable database backups

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for production checklist.

## License

MIT

## Support

For issues or questions, refer to:
1. Troubleshooting section above
2. [SETUP_GUIDE.md](./SETUP_GUIDE.md)
3. [FRONTEND_AUTH_GUIDE.md](./FRONTEND_AUTH_GUIDE.md)
4. [backend/README.md](./backend/README.md)
