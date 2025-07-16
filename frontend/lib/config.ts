// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
};

// App Configuration
export const APP_CONFIG = {
  name: 'BetaDomot',
  description: 'Your Home, Your Story',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};