# Shop Admin - Quick Start Guide

## Start Everything

```bash
# Terminal 1 - Backend
cd backend
./blog-api

# Terminal 2 - Frontend (Blog Admin)
cd frontend
npm run dev

# Terminal 3 - Shop
cd shop
npm run dev
```

## Access Points

- **Blog Admin**: http://localhost:3000/admin/login
- **Shop Admin**: http://localhost:3000/admin/dashboard/shop
- **Shop Frontend**: http://localhost:3001

## Login Credentials

Check `backend/.env` for:
```
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
```

## Create Your First Category

1. Login at http://localhost:3000/admin/login
2. Click "Shop" in sidebar
3. Click "Manage Categories"
4. Click "+ New Category"
5. Fill in:
   ```
   Name: Furniture
   Slug: furniture
   Description: Quality furniture for your home
   Image URL: (paste any image URL)
   ✓ Featured Category
   ```
6. Click "Create"

## Create Your First Collection

1. Click "Manage Collections"
2. Click "+ New Collection"
3. Fill in:
   ```
   Name: Living Room Essentials
   Slug: living-room-essentials
   Description: Everything you need for a beautiful living room
   Image URL: (paste any image URL)
   Display Order: 1
   ✓ Featured on Homepage
   ```
4. Click "Create"

## Add Products to Collection

1. In Collections list, find your collection
2. Click "Add Products"
3. Click "Add to Collection" on products you want
4. Done!

## View on Shop

Visit http://localhost:3001 to see:
- Your featured collections in "Curated Collections" section
- Your featured categories in "Shop by category" section

---

**That's it!** You now have a fully functional shop admin.
