# Test Shop Categories - Quick Start

## What We Just Built

✅ Backend category routes added to `main.go`
✅ Category API functions added to `shop/lib/api-client.ts`
✅ Shop landing page created: `shop/app/shop/page.tsx`
✅ Category page created: `shop/app/shop/[category]/page.tsx`

## How to Test

### Step 1: Start Backend

Open a terminal and run:

```bash
cd backend
./blog-api
```

The backend should start on `http://localhost:8080`

### Step 2: Test Category API

Open another terminal and test the endpoints:

```bash
# Get all categories
curl http://localhost:8080/categories

# Get featured categories only
curl http://localhost:8080/categories?featured=true

# Get specific category
curl http://localhost:8080/categories/furniture

# Get products in category
curl http://localhost:8080/categories/furniture/products
```

### Step 3: Start Shop Frontend

Open another terminal:

```bash
cd shop
npm run dev
```

The shop should start on `http://localhost:3001`

### Step 4: Visit Shop Pages

1. Go to `http://localhost:3001/shop` - You should see the shop landing page with category grid
2. Click on any category - You should see the category page with products

## Expected Behavior

**Shop Landing Page** (`/shop`):
- Shows 6 featured categories in a grid
- Each category shows name and product count
- Clicking a category takes you to that category page

**Category Page** (`/shop/furniture`):
- Shows breadcrumb navigation
- Shows category name and description
- Shows all products in that category
- Uses existing ProductGrid component

## Troubleshooting

**If categories are empty:**
- Check that Step 4 migration ran successfully
- Run this in Supabase SQL Editor to verify:
  ```sql
  SELECT * FROM product_categories;
  ```

**If products don't show:**
- Products need to have `category_id` set
- You'll need to update existing products or create new ones with categories

**If backend won't start:**
- Check `.env` file has correct Supabase credentials
- Make sure port 8080 is not already in use

## Next Steps

Once this works:
1. Update existing products to have category_id
2. Add filters sidebar to category pages
3. Add search functionality
4. Add sort dropdown
5. Link shop from homepage

---

**Start testing now!** Open 2 terminals and run the backend and shop.
