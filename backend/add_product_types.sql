-- Migration: Add product type system for Editorial vs Everyday products
-- Run this migration to enable dual-product system

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

-- Add helpful comments
COMMENT ON COLUMN products.product_type IS 'Product type: editorial (inspiration/reference) or everyday (purchasable)';
COMMENT ON COLUMN products.editorial_note IS 'Short editorial explanation for why this product was selected';
COMMENT ON COLUMN products.external_link IS 'External link for editorial products (e.g., manufacturer website)';
COMMENT ON COLUMN products.availability_status IS 'Availability status for editorial products';
COMMENT ON COLUMN products.variants IS 'Product variants (size, color, etc.) as JSON array';
COMMENT ON COLUMN products.shipping_info IS 'Shipping information for everyday products';
COMMENT ON COLUMN products.return_policy IS 'Return policy for everyday products';
COMMENT ON COLUMN products.care_instructions IS 'Care and maintenance instructions';
