# Run Shop Migration - Step by Step

## Problem

The full migration script fails when RLS is enabled in Supabase. We'll run it in 4 separate steps instead.

## Solution: Run Each Step Separately

### Step 1: Create Tables

**In Supabase Dashboard → SQL Editor:**

1. Click "New Query"
2. Copy/paste content from `backend/create_shop_step1_tables.sql`
3. Click "Run"
4. ✅ Should see: 4 tables created (product_categories, product_collections, product_collection_items, product_reviews)

**What this does:**
- Creates product_categories table
- Creates product_collections table
- Creates product_collection_items table
- Creates product_reviews table

### Step 2: Create Indexes

**In Supabase Dashboard → SQL Editor:**

1. Click "New Query"
2. Copy/paste content from `backend/create_shop_step2_indexes.sql`
3. Click "Run"
4. ✅ Should see: List of indexes created

**What this does:**
- Creates indexes for fast filtering and sorting
- Improves query performance

### Step 3: Add Product Columns

**In Supabase Dashboard → SQL Editor:**

1. Click "New Query"
2. Copy/paste content from `backend/create_shop_step3_product_columns.sql`
3. Click "Run"
4. ✅ Should see: New columns added to products table

**What this does:**
- Adds category_id, brand, material, color to products
- Adds rating_average, rating_count, review_count
- Adds is_bestseller, is_new_arrival, is_on_sale
- Adds search_vector for full-text search
- Creates indexes for filtering

### Step 4: Seed Default Data

**In Supabase Dashboard → SQL Editor:**

1. Click "New Query"
2. Copy/paste content from `backend/create_shop_step4_seed_data.sql`
3. Click "Run"
4. ✅ Should see: 
   - 6 main categories created
   - 13 subcategories created
   - 6 collections created

**What this does:**
- Creates default categories (Furniture, Lighting, Decor, etc.)
- Creates subcategories (Seating, Tables, etc.)
- Creates default collections (Scandinavian Living, Bestsellers, etc.)

## Verification

After running all 4 steps, verify everything worked:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'product_%'
ORDER BY table_name;

-- Check categories created
SELECT name, slug, parent_id IS NOT NULL as has_parent
FROM product_categories
ORDER BY display_order;

-- Check collections created
SELECT name, slug, is_featured
FROM product_collections
ORDER BY display_order;

-- Check new product columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('category_id', 'brand', 'rating_average', 'is_bestseller')
ORDER BY column_name;
```

Expected results:
- ✅ 4 new tables (product_categories, product_collections, product_collection_items, product_reviews)
- ✅ 19 categories total (6 main + 13 subcategories)
- ✅ 6 collections
- ✅ 15+ new columns in products table

## Enable RLS (Optional)

If you want Row Level Security:

```sql
-- Enable RLS on new tables
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read access)
CREATE POLICY "Public can view categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public can view collections" ON product_collections FOR SELECT USING (true);
CREATE POLICY "Public can view collection items" ON product_collection_items FOR SELECT USING (true);
CREATE POLICY "Public can view approved reviews" ON product_reviews FOR SELECT USING (is_approved = true);
```

## Troubleshooting

### "Table already exists"
- This is fine, the scripts use `IF NOT EXISTS`
- Continue to next step

### "Column already exists"
- This is fine, the scripts use `ADD COLUMN IF NOT EXISTS`
- Continue to next step

### "Relation does not exist"
- Make sure you ran previous steps first
- Steps must be run in order (1 → 2 → 3 → 4)

### Still getting errors?
- Try running each SQL statement individually
- Check Supabase logs for detailed error messages
- Ensure you're using the SQL Editor, not the Table Editor

## Next Steps

Once migration is complete:
1. ✅ Backend handlers (categories, filters, search)
2. ✅ Shop landing page
3. ✅ Category pages with filters
4. ✅ Add products to categories

---

**Ready?** Start with Step 1 in Supabase SQL Editor!
