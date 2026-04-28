# Fix Collections - Run This Migration

## Problem
Collection creation is failing because the `product_collections` and `product_collection_items` tables don't exist in the database.

## Solution
Run the migration in Supabase SQL Editor:

### Steps:

1. **Go to Supabase Dashboard**
   - Open: https://supabase.com/dashboard/project/amqfaxpexigofotoandv

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar

3. **Create New Query**
   - Click "New Query"

4. **Copy and Paste This SQL:**

```sql
-- Create product collections tables

CREATE TABLE IF NOT EXISTS product_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_collection_items (
  collection_id UUID REFERENCES product_collections(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, product_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_collections_slug ON product_collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_featured ON product_collections(is_featured);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON product_collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_product ON product_collection_items(product_id);
```

5. **Run the Query**
   - Click "Run" or press Cmd/Ctrl + Enter

6. **Verify Success**
   - You should see "Success. No rows returned"
   - Try creating a collection again - it should work now!

## What This Does

- Creates `product_collections` table for storing collections
- Creates `product_collection_items` junction table for linking products to collections
- Creates indexes for better query performance
- Sets up foreign key relationships

## After Running

Restart your backend server and try creating collections again. The 500 errors should be gone!
