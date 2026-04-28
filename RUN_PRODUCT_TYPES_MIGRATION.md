# Fix Product Creation - Run This Migration

## Problem
Product creation is failing with 500 errors because the database is missing the new product type columns.

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
-- Add product_type column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'everyday' 
CHECK (product_type IN ('editorial', 'everyday'));

-- Add editorial-specific fields
ALTER TABLE products
ADD COLUMN IF NOT EXISTS editorial_note TEXT,
ADD COLUMN IF NOT EXISTS external_link TEXT,
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available' 
CHECK (availability_status IN ('available', 'limited', 'reference', 'sold_out'));

-- Add everyday-specific fields
ALTER TABLE products
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS shipping_info TEXT,
ADD COLUMN IF NOT EXISTS return_policy TEXT,
ADD COLUMN IF NOT EXISTS care_instructions TEXT;

-- Create index for product type filtering
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_products_type_active ON products(product_type, active);
CREATE INDEX IF NOT EXISTS idx_products_type_featured ON products(product_type, featured);

-- Update existing products to be 'everyday' by default
UPDATE products 
SET product_type = 'everyday' 
WHERE product_type IS NULL;
```

5. **Run the Query**
   - Click "Run" or press Cmd/Ctrl + Enter

6. **Verify Success**
   - You should see "Success. No rows returned"
   - Try creating a product again - it should work now!

## What This Does

- Adds `product_type` column (editorial or everyday)
- Adds editorial fields: `editorial_note`, `external_link`, `availability_status`
- Adds everyday fields: `variants`, `shipping_info`, `return_policy`, `care_instructions`
- Creates indexes for better query performance
- Sets existing products to 'everyday' type

## After Running

Restart your backend server and try creating products again. The 500 errors should be gone!
