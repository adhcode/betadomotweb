# Blog Post Image Upload Updated

## Changes Made

The blog post form (`frontend/components/AdminPostForm.tsx`) has been updated to use **image upload** instead of URL input for the featured image.

## New Features

1. **File Upload Button**: Click to upload images directly from your computer
2. **Image Preview**: See the uploaded image before publishing
3. **Remove Button**: Easy removal of uploaded images
4. **File Validation**: 
   - Only image files (PNG, JPG, WEBP)
   - Max size: 5MB
5. **Upload Progress**: Shows spinner during upload
6. **Cloudinary Integration**: Uses the same upload endpoint as products/collections

## If You Don't See the Upload UI

The browser may have cached the old version. Try these steps:

### Option 1: Hard Refresh
- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`

### Option 2: Clear Cache and Restart Dev Server
```bash
# Stop the frontend server (Ctrl+C)

# Clear Next.js cache
cd frontend
rm -rf .next

# Restart the server
npm run dev
```

### Option 3: Force Browser Cache Clear
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

## How to Use

1. Go to Admin Dashboard → Posts
2. Click "Create New Post" or edit existing post
3. Scroll to "FEATURED IMAGE" section
4. Click the upload area to select an image
5. Image will upload to Cloudinary automatically
6. Preview appears with a "Remove Image" button

## Technical Details

- Upload endpoint: `/admin/upload/image`
- Storage: Cloudinary
- Supported formats: PNG, JPG, WEBP
- Max file size: 5MB
- Returns Cloudinary URL automatically
