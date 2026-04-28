-- Step 3: Add New Columns to Products Table
-- Run after Step 1 and 2

-- Add new columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID;
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS material TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_average DECIMAL(2,1) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sales_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Add foreign key constraint
ALTER TABLE products
ADD CONSTRAINT fk_product_category 
FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL;

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_material ON products(material) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_color ON products(color) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON products(is_new_arrival) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_on_sale ON products(is_on_sale) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating_average) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_sales ON products(sales_count) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(search_vector);

-- Verify columns added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('category_id', 'brand', 'rating_average', 'search_vector', 'is_bestseller')
ORDER BY column_name;
