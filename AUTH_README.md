# Authentication Setup Guide

This guide will help you set up and test the authentication system for your React/Next.js app.

## Setup Instructions

### 1. Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values:
MONGODB_URI=mongodb://localhost:27017/pathfinder
MONGODB_DB=pathfinder
SESSION_SECRET=your-super-secret-key-at-least-32-characters-long
NODE_ENV=development
```

### 2. Database Setup
Make sure MongoDB is running locally or update the MONGODB_URI to point to your MongoDB instance.

### 3. Install Dependencies
All required dependencies are already in package.json:
- `bcryptjs` for password hashing
- `iron-session` for session management
- `mongoose` for MongoDB
- `zod` for validation

### 4. Run the Application
```bash
npm run dev
```

## Testing the Authentication

### Frontend Testing
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/signup`
3. Create a test account
4. Try logging in at `http://localhost:3000/login`

### Backend API Testing
Use the test script to verify the API endpoints:
```bash
# Make sure your dev server is running first
node scripts/test-auth.js
```

### Manual API Testing with curl
```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","name":"Test User","role":"learner"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Test current user (after login)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Content-Type: application/json"
```

## Features Implemented

### Backend (API Routes)
- ✅ User registration with email/password
- ✅ User login with session creation
- ✅ Password hashing with bcrypt
- ✅ Input validation with Zod
- ✅ Session management with iron-session
- ✅ User role support
- ✅ Error handling and debugging
- ✅ Database integration with MongoDB

### Frontend (React Components)
- ✅ Signup form with validation
- ✅ Login form with validation
- ✅ Error display
- ✅ Loading states
- ✅ API integration
- ✅ Authentication context
- ✅ Automatic redirects

### Security Features
- ✅ Password hashing (bcrypt)
- ✅ Session-based authentication
- ✅ Input validation
- ✅ CORS protection
- ✅ HTTP-only cookies
- ✅ Secure session configuration

## Common Issues & Debugging

### 1. Database Connection Issues
```bash
# Check if MongoDB is running
brew services list | grep mongo  # macOS
systemctl status mongod          # Linux
```

### 2. Session Issues
- Make sure SESSION_SECRET is set in .env.local
- Clear browser cookies if having session problems

### 3. API Errors
- Check the browser's developer console
- Check the server console for debug logs
- Verify environment variables are loaded

### 4. CORS Issues
- Make sure you're running the frontend and backend on the same domain
- Check network tab in browser developer tools

## File Structure
```
src/
├── app/
│   ├── api/auth/           # Authentication API routes
│   │   ├── login/route.ts
│   │   ├── signup/route.ts
│   │   ├── logout/route.ts
│   │   └── me/route.ts
│   ├── lib/                # Utility libraries
│   │   ├── api.ts         # Frontend API client
│   │   ├── auth.ts        # Session management
│   │   ├── db.ts          # Database connection
│   │   └── debug.ts       # Debugging utilities
│   ├── models/            # Database models
│   │   └── User.ts
│   ├── _providers/        # React contexts
│   │   └── AuthProvider.tsx
│   ├── login/             # Login page
│   └── signup/            # Signup page
```

## Next Steps

1. **Protected Routes**: Add middleware to protect authenticated routes
2. **Password Reset**: Implement password reset functionality
3. **Email Verification**: Add email verification for new accounts
4. **OAuth Integration**: Add Google/GitHub login
5. **User Profile**: Create user profile management
6. **Role-based Access**: Implement role-based permissions
7. **Testing**: Add unit and integration tests

## Troubleshooting

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Clear browser cache and cookies
5. Restart the development server
