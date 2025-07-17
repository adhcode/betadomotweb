# Frontend Deployment Guide

This guide explains how to deploy the frontend to Vercel and connect it to the backend on Railway.

## Prerequisites

- A Vercel account
- The backend deployed on Railway (https://betadomotweb-production.up.railway.app/)
- Cloudinary account (for image uploads)

## Step 1: Set up Environment Variables in Vercel

When deploying to Vercel, you need to set the following environment variables:

```
NEXT_PUBLIC_API_URL=https://betadomotweb-production.up.railway.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ddh44ruog
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=betadomot
NEXT_PUBLIC_APP_URL=https://your-vercel-app-url.vercel.app
```

## Step 2: Deploy to Vercel

1. Push your code to GitHub
2. Log in to Vercel and create a new project
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: .next
5. Add the environment variables from Step 1
6. Deploy!

## Step 3: Update CORS Configuration (if needed)

The backend is already configured to accept requests from any origin (`*`). If you need to restrict this to only your Vercel domain, update the CORS middleware in `backend/middleware/cors.go`:

```go
w.Header().Set("Access-Control-Allow-Origin", "https://your-vercel-app-url.vercel.app")
```

## Step 4: Test the Connection

1. Visit your Vercel app URL
2. The frontend should connect to the backend at https://betadomotweb-production.up.railway.app
3. Check the browser console for any CORS errors

## Troubleshooting

- **CORS Errors**: Make sure the backend CORS configuration allows requests from your Vercel domain
- **API Connection Issues**: Check that NEXT_PUBLIC_API_URL is set correctly in Vercel
- **404 Errors**: Ensure the API endpoints match what the frontend is expecting