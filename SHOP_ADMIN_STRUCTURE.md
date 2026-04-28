# Shop Admin - Structure Overview

## 📁 Admin Navigation Structure

```
Admin Dashboard
├── Dashboard (Overview)
├── Posts (Blog management)
├── Guides (Guide management)
├── Shop ⭐ (Shop management)
│   ├── Shop Dashboard
│   ├── Products Management
│   ├── Categories Management
│   └── Collections Management
├── Comments
├── Newsletter
└── Analytics
```

## 🏪 Shop Admin Pages

### 1. Shop Dashboard
**URL**: `/admin/dashboard/shop`

```
┌─────────────────────────────────────────────────────────┐
│  Shop Management                                         │
│  Manage products, categories, and collections           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📊 STATS                                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Products │ │Categories│ │Collections│ │  Orders  │  │
│  │    42    │ │    6     │ │     4     │ │    0     │  │
│  │ 12 edit  │ │          │ │           │ │          │  │
│  │ 30 every │ │          │ │           │ │          │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                          │
│  🎯 QUICK ACTIONS                                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │   Manage     │ │   Manage     │ │   Manage     │   │
│  │   Products   │ │  Categories  │ │  Collections │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                          │
│  ℹ️ INFO CARDS                                           │
│  ┌─────────────────────┐ ┌─────────────────────┐       │
│  │ Product Types       │ │ Quick Links         │       │
│  │ • Editorial         │ │ → Add Product       │       │
│  │ • Everyday          │ │ → Create Category   │       │
│  └─────────────────────┘ └─────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

### 2. Products Management
**URL**: `/admin/dashboard/products`

```
┌─────────────────────────────────────────────────────────┐
│  [Refresh] [+ New Product]                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  CREATE/EDIT FORM (when active)                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Product Name: [________________]  Category: [____] │ │
│  │ Description: [_________________________________]   │ │
│  │ Price: [____] Sale Price: [____] Stock: [____]    │ │
│  │ SKU: [____] Tags: [____]                          │ │
│  │ Weight: [____] Dimensions: [____]                 │ │
│  │                                                    │ │
│  │ Images:                                            │ │
│  │ [Cloudinary Upload] [+ Add URL]                   │ │
│  │ [Image Preview 1] [Image Preview 2]               │ │
│  │                                                    │ │
│  │ ☑ Featured  ☑ Active                              │ │
│  │                                                    │ │
│  │ [Cancel] [Create Product]                         │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  SEARCH                                                  │
│  🔍 [Search products by name, category, or SKU...]      │
│                                                          │
│  PRODUCTS LIST                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ All Products (42)                                  │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ [img] Modern Chair                    [👁️][✏️][🗑️] │ │
│  │       Comfortable modern chair...                  │ │
│  │       $299.00 | Stock: 15 | SKU: MC001            │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ [img] Desk Lamp [Featured]            [👁️][✏️][🗑️] │ │
│  │       Minimalist desk lamp...                      │ │
│  │       $89.00 | Sale: $69.00 | Stock: 8            │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 3. Categories Management
**URL**: `/admin/dashboard/shop/categories`

```
┌─────────────────────────────────────────────────────────┐
│  Categories                          [+ New Category]    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  CREATE/EDIT FORM (when active)                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Name: [________________]                           │ │
│  │ Slug: [________________]                           │ │
│  │ Description: [_________________________________]   │ │
│  │ Image URL: [___________________________________]   │ │
│  │ ☑ Featured Category                               │ │
│  │ [Create]                                           │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  CATEGORIES TABLE                                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Name      │ Slug      │ Featured │ Products │ Actions│
│  ├────────────────────────────────────────────────────┤ │
│  │ Furniture │ furniture │ [Featured]│    24    │ [✏️][🗑️]│
│  │ Lighting  │ lighting  │          │    12    │ [✏️][🗑️]│
│  │ Decor     │ decor     │ [Featured]│     6    │ [✏️][🗑️]│
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 4. Collections Management
**URL**: `/admin/dashboard/shop/collections`

```
┌─────────────────────────────────────────────────────────┐
│  Collections                        [+ New Collection]   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  CREATE/EDIT FORM (when active)                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Name: [________________]                           │ │
│  │ Slug: [________________]                           │ │
│  │ Description: [_________________________________]   │ │
│  │ Image URL: [___________________________________]   │ │
│  │ Display Order: [1]                                 │ │
│  │ ☑ Featured on Homepage                            │ │
│  │ [Create]                                           │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  PRODUCT SELECTOR (when active)                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Add Products to Living Room Essentials            │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐           │ │
│  │ │ Chair    │ │ Lamp     │ │ Table    │           │ │
│  │ │ $299     │ │ $89      │ │ $499     │           │ │
│  │ │ [Add]    │ │ [Add]    │ │ [Add]    │           │ │
│  │ └──────────┘ └──────────┘ └──────────┘           │ │
│  │ [Close]                                            │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  COLLECTIONS TABLE                                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Name      │ Slug  │ Featured │ Order │ Actions     │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ Living Rm │ living│[Featured]│   1   │[+][✏️][🗑️]  │ │
│  │ Bedroom   │bedroom│          │   2   │[+][✏️][🗑️]  │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 🔄 User Flow

### Creating a Product
```
1. Click "Shop" in sidebar
2. Click "Manage Products" or go to Products page
3. Click "+ New Product"
4. Fill in form:
   - Name (required)
   - Price (required)
   - Description, images, category, etc.
5. Upload images via Cloudinary or add URLs
6. Set product type (Editorial/Everyday)
7. Mark as featured if desired
8. Click "Create Product"
9. Product appears in list
```

### Creating a Collection
```
1. Go to Collections page
2. Click "+ New Collection"
3. Fill in form:
   - Name, slug (required)
   - Description, image URL
   - Display order
4. Check "Featured on Homepage"
5. Click "Create"
6. Click "Add Products" button
7. Select products from grid
8. Products added to collection
9. Collection appears on shop homepage
```

### Managing Categories
```
1. Go to Categories page
2. Click "+ New Category"
3. Fill in name, slug, description
4. Add image URL
5. Check "Featured" for homepage display
6. Click "Create"
7. Category appears in list
8. Edit/delete as needed
```

## 🎨 Design Elements

### Color Coding
- **Blue**: Products (primary action)
- **Green**: Categories (organization)
- **Purple**: Collections (curation)
- **Orange**: Orders (transactions)
- **Yellow**: Featured badges
- **Gray**: Inactive items
- **Red**: Delete actions

### Icons
- 📦 Package: Products
- 🗂️ Folder: Categories
- 📚 Layers: Collections
- 🛒 Cart: Orders
- 👁️ Eye: View
- ✏️ Pencil: Edit
- 🗑️ Trash: Delete
- ➕ Plus: Add/Create
- 🔍 Search: Search
- 🔄 Refresh: Reload

### Status Badges
- **Featured**: Yellow background, yellow text
- **Inactive**: Gray background, gray text
- **Sale**: Green text

## 📱 Responsive Design

All pages are responsive and work on:
- Desktop (1920px+)
- Laptop (1280px-1920px)
- Tablet (768px-1280px)
- Mobile (< 768px) - with mobile menu

## 🔐 Authentication

All shop admin pages require authentication:
- Login at `/admin/login`
- Credentials from `backend/.env`
- Session stored in localStorage
- Automatic redirect if not authenticated

---

## ✨ Summary

The shop admin is fully structured, organized, and ready to use. Every page has a clear purpose, clean design, and all necessary functionality. The user can manage their entire shop from one cohesive admin interface.
