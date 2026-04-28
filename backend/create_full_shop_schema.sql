-- Full-Scale E-Commerce Shop Schema
-- Run this migration to enable full commerce capabilities

-- ============================================================================
-- PRODUCT CATEGORIES (Hierarchical)
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  product_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON product_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_featured ON product_categories(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_order ON product_categories(display_order);

-- ============================================================================
-- PRODUCT COLLECTIONS (For merchandising)
-- ============================================================================

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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_collections_slug ON product_collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_featured ON product_collections(is_featured);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON product_collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_product ON product_collection_items(product_id);

-- ============================================================================
-- PRODUCT REVIEWS
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON product_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON product_reviews(rating);

-- ============================================================================
-- ENHANCE PRODUCTS TABLE
-- ============================================================================

-- Add new columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES product_categories(id),
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS material TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS rating_average DECIMAL(2,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS sales_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_on_sale BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create indexes for filtering and sorting
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

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(search_vector);

-- Function to update search vector
CREATE OR REPLACE FUNCTION products_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.brand, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Trigger to auto-update search vector
DROP TRIGGER IF EXISTS products_search_vector_trigger ON products;
CREATE TRIGGER products_search_vector_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION products_search_vector_update();

-- Update existing products' search vectors
UPDATE products SET updated_at = updated_at WHERE id IS NOT NULL;

-- ============================================================================
-- SEED DATA: Default Categories
-- ============================================================================

INSERT INTO product_categories (slug, name, description, display_order, is_featured) VALUES
('furniture', 'Furniture', 'Thoughtfully designed furniture for every room in your home', 1, true),
('lighting', 'Lighting', 'Illuminate your space with carefully selected lighting', 2, true),
('decor', 'Decor', 'Decorative pieces that add character to your home', 3, true),
('textiles', 'Textiles', 'Soft furnishings and textiles for comfort and style', 4, true),
('storage', 'Storage', 'Practical storage solutions that don''t compromise on design', 5, false),
('outdoor', 'Outdoor', 'Furniture and decor for outdoor living spaces', 6, false)
ON CONFLICT (slug) DO NOTHING;

-- Furniture subcategories
DO $$
DECLARE
  furniture_id UUID;
  lighting_id UUID;
  decor_id UUID;
  textiles_id UUID;
BEGIN
  -- Get parent category IDs
  SELECT id INTO furniture_id FROM product_categories WHERE slug = 'furniture';
  SELECT id INTO lighting_id FROM product_categories WHERE slug = 'lighting';
  SELECT id INTO decor_id FROM product_categories WHERE slug = 'decor';
  SELECT id INTO textiles_id FROM product_categories WHERE slug = 'textiles';
  
  -- Insert furniture subcategories
  IF furniture_id IS NOT NULL THEN
    INSERT INTO product_categories (slug, name, description, parent_id, display_order) VALUES
    ('seating', 'Seating', 'Chairs, sofas, and benches', furniture_id, 1),
    ('tables', 'Tables', 'Dining, coffee, and side tables', furniture_id, 2),
    ('storage-furniture', 'Storage', 'Shelving, cabinets, and storage units', furniture_id, 3),
    ('beds', 'Beds', 'Bed frames and bedroom furniture', furniture_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
  
  -- Insert lighting subcategories
  IF lighting_id IS NOT NULL THEN
    INSERT INTO product_categories (slug, name, description, parent_id, display_order) VALUES
    ('ceiling-lights', 'Ceiling Lights', 'Pendants, chandeliers, and ceiling fixtures', lighting_id, 1),
    ('floor-lamps', 'Floor Lamps', 'Standing lamps for ambient lighting', lighting_id, 2),
    ('table-lamps', 'Table Lamps', 'Desk and bedside lamps', lighting_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
  
  -- Insert decor subcategories
  IF decor_id IS NOT NULL THEN
    INSERT INTO product_categories (slug, name, description, parent_id, display_order) VALUES
    ('wall-art', 'Wall Art', 'Prints, paintings, and wall decorations', decor_id, 1),
    ('vases', 'Vases & Vessels', 'Decorative vases and containers', decor_id, 2),
    ('mirrors', 'Mirrors', 'Wall and standing mirrors', decor_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
  
  -- Insert textiles subcategories
  IF textiles_id IS NOT NULL THEN
    INSERT INTO product_categories (slug, name, description, parent_id, display_order) VALUES
    ('rugs', 'Rugs', 'Area rugs and runners', textiles_id, 1),
    ('cushions', 'Cushions', 'Throw pillows and cushions', textiles_id, 2),
    ('throws', 'Throws & Blankets', 'Cozy throws and blankets', textiles_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- ============================================================================
-- SEED DATA: Default Collections
-- ============================================================================

INSERT INTO product_collections (slug, name, description, is_featured, display_order) VALUES
('scandinavian-living', 'Scandinavian Living', 'Clean lines, natural materials, and functional beauty', true, 1),
('minimalist-essentials', 'Minimalist Essentials', 'Less is more—pieces that matter', true, 2),
('new-arrivals', 'New Arrivals', 'The latest additions to our collection', true, 3),
('bestsellers', 'Bestsellers', 'Our most loved products', true, 4),
('under-50k', 'Under ₦50,000', 'Quality pieces at accessible prices', false, 5),
('workspace', 'Work from Home', 'Everything you need for a productive home office', false, 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to update category product counts
CREATE OR REPLACE FUNCTION update_category_product_count() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE product_categories 
    SET product_count = (
      SELECT COUNT(*) FROM products 
      WHERE category_id = NEW.category_id AND active = true
    )
    WHERE id = NEW.category_id;
  END IF;
  
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.category_id != NEW.category_id) THEN
    UPDATE product_categories 
    SET product_count = (
      SELECT COUNT(*) FROM products 
      WHERE category_id = OLD.category_id AND active = true
    )
    WHERE id = OLD.category_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_category_count_trigger ON products;
CREATE TRIGGER update_category_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_category_product_count();

-- Function to update collection product counts
CREATE OR REPLACE FUNCTION update_collection_product_count() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE product_collections 
    SET product_count = product_count + 1
    WHERE id = NEW.collection_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE product_collections 
    SET product_count = product_count - 1
    WHERE id = OLD.collection_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_collection_count_trigger ON product_collection_items;
CREATE TRIGGER update_collection_count_trigger
  AFTER INSERT OR DELETE ON product_collection_items
  FOR EACH ROW
  EXECUTE FUNCTION update_collection_product_count();

-- Function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating() RETURNS trigger AS $$
BEGIN
  UPDATE products 
  SET 
    rating_average = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM product_reviews 
      WHERE product_id = NEW.product_id AND is_approved = true
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM product_reviews 
      WHERE product_id = NEW.product_id AND is_approved = true
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM product_reviews 
      WHERE product_id = NEW.product_id AND is_approved = true
    )
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_product_rating_trigger ON product_reviews;
CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE ON product_reviews
  FOR EACH ROW
  WHEN (NEW.is_approved = true)
  EXECUTE FUNCTION update_product_rating();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE product_categories IS 'Hierarchical product categories for shop organization';
COMMENT ON TABLE product_collections IS 'Curated product collections for merchandising';
COMMENT ON TABLE product_reviews IS 'Customer reviews and ratings for products';
COMMENT ON COLUMN products.category_id IS 'Link to product category';
COMMENT ON COLUMN products.search_vector IS 'Full-text search index';
COMMENT ON COLUMN products.rating_average IS 'Average customer rating (1-5)';
COMMENT ON COLUMN products.is_bestseller IS 'Manually marked as bestseller';
COMMENT ON COLUMN products.is_new_arrival IS 'Marked as new arrival (auto-expire after 30 days)';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify tables were created
SELECT 
  'product_categories' as table_name,
  COUNT(*) as row_count
FROM product_categories
UNION ALL
SELECT 
  'product_collections',
  COUNT(*)
FROM product_collections
UNION ALL
SELECT 
  'product_reviews',
  COUNT(*)
FROM product_reviews;

-- Verify new product columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('category_id', 'brand', 'rating_average', 'search_vector')
ORDER BY column_name;
