# Shop Admin - Complete Guide

## Overview

The Shop Admin system is fully built and ready to use. It provides complete management for your e-commerce shop including products, categories, and collections.

## ✅ What's Built

### 1. Shop Dashboard (`/admin/dashboard/shop`)
- **Stats Overview**: Products, categories, collections, orders
- **Product Type Breakdown**: Editorial vs Everyday products
- **Quick Actions**: Direct links to manage products, categories, collections
- **Info Cards**: Product type explanations and quick links

### 2. Products Management (`/admin/dashboard/products`)
- **Full CRUD**: Create, Read, Update, Delete products
- **Product Types**: Support for Editorial and Everyday products
- **Image Upload**: Cloudinary integration + manual URL input
- **Rich Fields**:
  - Basic: Name, description, price, sale price
  - Inventory: Stock, SKU
  - Physical: Weight, dimensions
  - Organization: Category, tags
  - Status: Featured, active/inactive
- **Search**: Filter by name, category, or SKU
- **Visual Product List**: Thumbnails, badges, inline actions

### 3. Categories Management (`/admin/dashboard/shop/categories`)
- **Full CRUD**: Create, edit, delete categories
- **Fields**: Name, slug, description, image URL
- **Featured Flag**: Mark categories for homepage display
- **Product Count**: See how many products in each category
- **Inline Editing**: Edit directly from the list

### 4. Collections Management (`/admin/dashboard/shop/collections`)
- **Full CRUD**: Create, edit, delete collections
- **Fields**: Name, slug, description, image URL, display order
- **Featured Flag**: Mark for homepage display
- **Product Assignment**: Add products to collections
- **Display Order**: Control order on homepage

## 🚀 How to Use

### Starting the Admin

1. **Start Backend**:
   ```bash
   cd backend
   ./blog-api
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Login**:
   - URL: http://localhost:3000/admin/login
   - Credentials: Check `backend/.env` for `ADMIN_USERNAME` and `ADMIN_PASSWORD`

4. **Access Shop Admin**:
   - Click "Shop" in the sidebar
   - Or go to: http://localhost:3000/admin/dashboard/shop

### Creating Products

1. Go to **Products** page
2. Click **"+ New Product"**
3. Fill in the form:
   - **Required**: Name, Price
   - **Optional**: Description, sale price, images, category, tags, stock, SKU, weight, dimensions
   - **Product Type**: Choose Editorial or Everyday
   - **Status**: Mark as featured, set active/inactive
4. **Upload Images**:
   - Use Cloudinary upload button (recommended)
   - Or manually enter image URLs
   - Add multiple images
5. Click **"Create Product"**

### Editing Products

1. Find product in the list
2. Click the **Edit** icon (pencil)
3. Modify fields
4. Click **"Update Product"**

### Deleting Products

1. Find product in the list
2. Click the **Delete** icon (trash)
3. Confirm deletion

### Creating Categories

1. Go to **Categories** page
2. Click **"+ New Category"**
3. Fill in:
   - Name (e.g., "Furniture")
   - Slug (e.g., "furniture")
   - Description
   - Image URL
   - Check "Featured" to show on homepage
4. Click **"Create"**

### Creating Collections

1. Go to **Collections** page
2. Click **"+ New Collection"**
3. Fill in:
   - Name (e.g., "Living Room Essentials")
   - Slug (e.g., "living-room-essentials")
   - Description
   - Image URL
   - Display Order (lower numbers appear first)
   - Check "Featured on Homepage"
4. Click **"Create"**
5. Click **"Add Products"** to add products to the collection

## 📋 Product Types Explained

### Editorial Products
- **Purpose**: Showcase items, inspiration, curation
- **Behavior**: 
  - Cannot be added to cart
  - Display "View Details" instead of "Add to Cart"
  - Show editorial notes and sourcing info
  - Link to external retailers
- **Use Case**: Curated picks, inspiration boards, affiliate products

### Everyday Products
- **Purpose**: Purchasable items
- **Behavior**:
  - Can be added to cart
  - Full e-commerce functionality
  - Stock management
  - Checkout integration
- **Use Case**: Your own inventory, direct sales

## 🎨 Design Philosophy

The admin follows these principles:

1. **Clean & Organized**: Clear sections, good spacing, visual hierarchy
2. **Functional**: All CRUD operations work smoothly
3. **Visual Feedback**: Success/error messages, loading states
4. **Inline Actions**: Edit/delete directly from lists
5. **Search & Filter**: Find products quickly
6. **Responsive**: Works on desktop and tablet

## 🔗 Integration with Shop Frontend

### Homepage Display

**Featured Collections** automatically appear on the shop homepage:
- Mark collection as "Featured on Homepage"
- Set display order (lower = higher on page)
- Collections appear between "Curated Picks" and "Shop by Category"

**Featured Categories** appear in the "Shop by Category" section:
- Mark category as "Featured"
- Up to 6 categories display
- Each links to `/shop/{category-slug}`

### Product Pages

Products are accessible at:
- Editorial: `/products/{slug}` - Shows editorial layout
- Everyday: `/products/{slug}` - Shows e-commerce layout with cart

## 📊 Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| Shop Dashboard | ✅ Complete | Stats, quick actions, info cards |
| Products CRUD | ✅ Complete | Full create, edit, delete |
| Product Types | ✅ Complete | Editorial & Everyday support |
| Image Upload | ✅ Complete | Cloudinary + manual URLs |
| Categories CRUD | ✅ Complete | Full management |
| Collections CRUD | ✅ Complete | Full management |
| Product Assignment | ✅ Complete | Add products to collections |
| Search & Filter | ✅ Complete | Search products |
| Homepage Integration | ✅ Complete | Featured collections/categories |
| Authentication | ✅ Complete | Basic auth with credentials |

## 🎯 Next Steps (Optional Enhancements)

1. **Orders Management**: View and manage customer orders
2. **Bulk Operations**: Bulk edit, bulk delete products
3. **Advanced Filters**: Filter by price range, stock status, product type
4. **Analytics**: Sales charts, popular products
5. **Image Gallery**: Better image management with drag-drop reordering
6. **Inventory Alerts**: Low stock notifications
7. **Product Variants**: Size, color variations
8. **SEO Fields**: Meta titles, descriptions per product

## 🐛 Troubleshooting

### Products Not Showing
- Check backend is running: `curl http://localhost:8080/health`
- Check products endpoint: `curl http://localhost:8080/products`
- Verify database has products

### Can't Login
- Check credentials in `backend/.env`
- Clear browser localStorage
- Try incognito mode

### Images Not Uploading
- Verify Cloudinary credentials in environment
- Check browser console for errors
- Use manual URL input as fallback

### Collections Not on Homepage
- Ensure collection is marked "Featured on Homepage"
- Check shop homepage: http://localhost:3001
- Verify backend collections endpoint returns data

## 📝 API Endpoints Used

### Products
- `GET /admin/products` - List all products
- `POST /admin/products` - Create product
- `PUT /admin/products/{slug}` - Update product
- `DELETE /admin/products/{slug}` - Delete product

### Categories
- `GET /categories` - List categories
- `POST /admin/categories` - Create category
- `PUT /admin/categories/{id}` - Update category
- `DELETE /admin/categories/{id}` - Delete category

### Collections
- `GET /collections` - List collections
- `POST /admin/collections` - Create collection
- `PUT /admin/collections/{id}` - Update collection
- `DELETE /admin/collections/{id}` - Delete collection
- `POST /admin/collections/{id}/products` - Add product to collection
- `DELETE /admin/collections/{id}/products/{productId}` - Remove product

## 🎉 Summary

Your shop admin is **100% complete and functional**. You can:

✅ Manage products (add, edit, delete)
✅ Organize with categories
✅ Create curated collections
✅ Control homepage display
✅ Upload images
✅ Search and filter
✅ Support two product types

Everything is ready to use. Just start the servers and login!
