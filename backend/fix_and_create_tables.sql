-- Fix and Create Shop Tables
-- This will work even if tables partially exist

-- Drop existing tables if they're incomplete (be careful!)
-- Comment out these lines if you have data you want to keep
DROP TABLE IF EXISTS product_collection_items CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS product_collections CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;

-- Now create fresh tables
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  product_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_collections (
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

CREATE TABLE product_collection_items (
  collection_id UUID,
  product_id UUID,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, product_id)
);

CREATE TABLE product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign keys
ALTER TABLE product_categories
ADD CONSTRAINT fk_parent_category 
FOREIGN KEY (parent_id) REFERENCES product_categories(id) ON DELETE SET NULL;

ALTER TABLE product_collection_items
ADD CONSTRAINT fk_collection_items_collection
FOREIGN KEY (collection_id) REFERENCES product_collections(id) ON DELETE CASCADE;

ALTER TABLE product_collection_items
ADD CONSTRAINT fk_collection_items_product
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE product_reviews
ADD CONSTRAINT fk_reviews_product
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Create indexes
CREATE INDEX idx_categories_slug ON product_categories(slug);
CREATE INDEX idx_categories_parent ON product_categories(parent_id);
CREATE INDEX idx_categories_featured ON product_categories(is_featured);
CREATE INDEX idx_categories_order ON product_categories(display_order);

CREATE INDEX idx_collections_slug ON product_collections(slug);
CREATE INDEX idx_collections_featured ON product_collections(is_featured);
CREATE INDEX idx_collection_items_collection ON product_collection_items(collection_id);
CREATE INDEX idx_collection_items_product ON product_collection_items(product_id);

CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_reviews_approved ON product_reviews(is_approved);
CREATE INDEX idx_reviews_rating ON product_reviews(rating);

-- Verify
SELECT 'Tables created successfully!' as status;

SELECT table_name, 
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('product_categories', 'product_collections', 'product_collection_items', 'product_reviews')
ORDER BY table_name;
