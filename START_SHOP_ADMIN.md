# Start Shop Admin - Quick Guide

## 🚀 Quick Start (3 Steps)

### 1. Start Backend
```bash
cd backend
./blog-api
```
Wait for: `✅ Blog API running on http://localhost:8080`

### 2. Start Frontend  
```bash
cd frontend
npm run dev
```
Wait for: `Ready on http://localhost:3000`

### 3. Login & Use
1. Go to: **http://localhost:3000/admin/login**
2. Enter credentials from `backend/.env`:
   - Username: `ADMIN_USERNAME`
   - Password: `ADMIN_PASSWORD`
3. Click **"Shop"** in sidebar

## 📍 Admin URLs

- **Login**: http://localhost:3000/admin/login
- **Shop Dashboard**: http://localhost:3000/admin/dashboard/shop
- **Products**: http://localhost:3000/admin/dashboard/products
- **Categories**: http://localhost:3000/admin/dashboard/shop/categories
- **Collections**: http://localhost:3000/admin/dashboard/shop/collections

## ✨ What You Can Do

### Products
- ✅ Add new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ Upload images (Cloudinary)
- ✅ Set product type (Editorial/Everyday)
- ✅ Manage stock, pricing, SKU
- ✅ Search and filter

### Categories
- ✅ Create categories
- ✅ Edit categories
- ✅ Delete categories
- ✅ Mark as featured (shows on homepage)
- ✅ Add images and descriptions

### Collections
- ✅ Create collections
- ✅ Edit collections
- ✅ Delete collections
- ✅ Add products to collections
- ✅ Mark as featured (shows on homepage)
- ✅ Set display order

## 🎯 Quick Actions

### Create Your First Product
1. Go to Products page
2. Click "+ New Product"
3. Fill in name and price (required)
4. Upload image or add URL
5. Choose product type
6. Click "Create Product"

### Create Your First Collection
1. Go to Collections page
2. Click "+ New Collection"
3. Fill in name and slug
4. Check "Featured on Homepage"
5. Click "Create"
6. Click "Add Products" to add items

### View on Frontend
- Shop: http://localhost:3001
- Featured collections appear on homepage
- Featured categories in "Shop by Category"

## 📖 Full Documentation

See `SHOP_ADMIN_COMPLETE_GUIDE.md` for detailed documentation.

---

**Everything is ready!** Just start the servers and login.
