# Admin Login Setup Guide

## What Changed

### 1. Login Page Design
- Added the BetaDomot logo at the top
- Removed default credentials display for security
- Clean, minimalist design with white background
- Simple form with username, password, remember me, and sign-in button

### 2. Environment Variables Setup

#### Backend (`backend/.env`)
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
```

#### Frontend (`frontend/.env.local`)
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
```

## How to Change Admin Credentials

### Option 1: Update Environment Variables (Recommended)
1. Edit `backend/.env` and change:
   ```env
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_secure_password
   ```

2. Restart the backend server for changes to take effect

### Option 2: Set Environment Variables Directly
When running the backend, you can set them directly:
```bash
ADMIN_USERNAME=myuser ADMIN_PASSWORD=mypass go run main.go
```

## Current Default Credentials
- **Username:** `admin`
- **Password:** `password`

⚠️ **Important:** Change these credentials before deploying to production!

## Testing the Login
1. Start the backend server: `cd backend && go run main.go`
2. Start the frontend: `cd frontend && npm run dev`
3. Navigate to: `http://localhost:3000/admin/login`
4. Use the credentials set in your `.env` file

## Security Notes
- The backend uses Basic Authentication
- Credentials are stored in localStorage (if "Remember me" is checked) or sessionStorage
- For production, consider implementing:
  - JWT tokens
  - Password hashing
  - Rate limiting
  - HTTPS only
  - Session expiration
