# Cloudinary Setup Guide

## Overview

The shop admin now uses Cloudinary for image uploads **through the backend**. Users just drag & drop or click to upload - no Cloudinary modal popup!

## How It Works

1. User drags/drops image or clicks to browse
2. Frontend sends image to backend endpoint
3. Backend uploads to Cloudinary via API
4. Cloudinary returns the secure URL
5. Backend returns URL to frontend
6. URL is saved with the product
7. Clean, seamless experience!

## Setup Steps

### 1. Get Cloudinary Account

1. Go to https://cloudinary.com
2. Sign up for free account
3. Go to Dashboard

### 2. Get Your Credentials

From your Cloudinary Dashboard, you'll need:

- **Cloud Name**: Found at the top of dashboard
- **API Key**: Found in the dashboard
- **API Secret**: Found in dashboard (click "Reveal" to see it)

### 3. Update Backend Environment

Edit `backend/.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

**Example**:
```env
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### 4. Rebuild and Restart Backend

```bash
cd backend
go build -o blog-api
./blog-api
```

## Testing

1. Go to http://localhost:3000/admin/login
2. Login with admin credentials
3. Navigate to Products
4. Click "+ Add Product"
5. Drag & drop an image or click to browse
6. You should see "Uploading to Cloudinary..."
7. Image appears in preview grid
8. URL is automatically saved

## Features

✅ **Drag & Drop**: Just drop images
✅ **Click to Browse**: Traditional file picker
✅ **Multiple Images**: Upload several at once
✅ **Progress Indicator**: Shows "Uploading..."
✅ **No Modal**: Clean, seamless experience
✅ **Backend Integration**: Secure, no frontend API keys
✅ **Automatic URLs**: Cloudinary URLs saved automatically
✅ **Fallback**: Can still add URLs manually if needed

## Troubleshooting

### Upload Fails

**Check**:
1. Cloudinary credentials are correct in `backend/.env`
2. Backend was rebuilt after adding credentials: `go build -o blog-api`
3. Backend is running: `./blog-api`
4. You're logged in as admin

### "Failed to upload to Cloudinary" Error

**Check**:
1. Cloud name, API key, and API secret are all correct
2. No typos in credentials
3. Cloudinary account is active
4. Check backend logs for detailed error

### Images Don't Appear

**Check**:
1. Upload succeeded (check browser console)
2. URL was returned from backend
3. URLs are valid (test in browser)
4. Cloudinary account is active

## Environment Variables

### Backend (.env)

```env
# Required for image upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Production

Add the same variables to your production environment:
- Railway: Add to environment variables
- Heroku: Use `heroku config:set`
- Docker: Add to docker-compose.yml or .env file

## Security Notes

- ✅ Upload endpoint requires admin authentication
- ✅ Cloudinary credentials stored in backend only
- ✅ No frontend exposure of API keys
- ✅ Signed uploads with API secret
- ✅ Secure file handling

## Free Tier Limits

Cloudinary free tier includes:
- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month

This is plenty for most small to medium shops!

## Alternative: Manual URL

If you don't want to use Cloudinary, users can still:
1. Click "Add Image from URL"
2. Enter any image URL
3. Works with any image host

---

**That's it!** Once configured, image uploads are seamless and automatic.
