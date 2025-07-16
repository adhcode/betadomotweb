# Cloudinary Integration Setup

This guide will help you set up Cloudinary for image uploads in the admin dashboard.

## 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com) and sign up for a free account
2. After signing up, you'll get your **Cloud Name**, **API Key**, and **API Secret**

## 2. Configure Environment Variables

1. Copy the example environment file:

   ```bash
   cp cloudinary.env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
   ```

## 3. Create Upload Preset

1. In your Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Set **Preset name** (e.g., `ml_default`)
5. Set **Signing Mode** to **Unsigned** (for client-side uploads)
6. Configure any additional settings (folder, transformations, etc.)
7. Click **Save**

## 4. Usage

Once configured, you can:

### Upload Images for Products

1. Go to the admin dashboard → Products
2. Click "Create Product" or edit an existing product
3. Use the "Click to upload images" button to upload images via Cloudinary
4. Images will be automatically added to your product

### Features

- **Multiple image upload**: Upload several images at once
- **Image preview**: See uploaded images with thumbnails
- **Drag & drop**: Drag images directly into the upload area
- **Manual URL fallback**: Still supports adding image URLs manually
- **Image cropping**: Crop images before upload
- **Format support**: JPG, PNG, GIF, WebP

## 5. Security Notes

- The upload preset should be set to **Unsigned** for client-side uploads
- You can restrict uploads by file size, format, and dimensions in the upload preset
- Consider setting up folder organization in your upload preset
- For production, consider implementing server-side upload signatures for additional security

## 6. Troubleshooting

### Images not uploading

- Check that your Cloudinary credentials are correct in `.env.local`
- Ensure the upload preset is set to "Unsigned"
- Check browser console for any JavaScript errors

### Images not displaying

- Verify that `res.cloudinary.com` is in your Next.js config (already configured)
- Check that the image URLs are being saved correctly in the database

### Upload widget not loading

- Ensure the Cloudinary script is loading (check network tab)
- Verify that your cloud name is correct
