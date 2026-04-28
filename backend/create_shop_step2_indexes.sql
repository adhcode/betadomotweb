-- Step 2: Create Indexes
-- Run after Step 1

-- Category indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON product_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_featured ON product_categories(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_order ON product_categories(display_order);

-- Collection indexes
CREATE INDEX IF NOT EXISTS idx_collections_slug ON product_collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_featured ON product_collections(is_featured);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection ON product_collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_product ON product_collection_items(product_id);

-- Review indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON product_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON product_reviews(rating);

-- Verify indexes created
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('product_categories', 'product_collections', 'product_collection_items', 'product_reviews')
ORDER BY tablename, indexname;
