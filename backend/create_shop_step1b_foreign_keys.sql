-- Step 1b: Add Foreign Keys (Run AFTER Step 1)
-- This adds the relationships between tables

-- Check if parent_id column exists first
DO $$ 
BEGIN
  -- Add foreign key for product_categories.parent_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'product_categories' AND column_name = 'parent_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_parent_category'
  ) THEN
    ALTER TABLE product_categories
    ADD CONSTRAINT fk_parent_category 
    FOREIGN KEY (parent_id) REFERENCES product_categories(id) ON DELETE SET NULL;
    RAISE NOTICE 'Added fk_parent_category constraint';
  END IF;

  -- Add foreign keys for product_collection_items
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_collection_items_collection') THEN
    ALTER TABLE product_collection_items
    ADD CONSTRAINT fk_collection_items_collection
    FOREIGN KEY (collection_id) REFERENCES product_collections(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added fk_collection_items_collection constraint';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_collection_items_product') THEN
    ALTER TABLE product_collection_items
    ADD CONSTRAINT fk_collection_items_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added fk_collection_items_product constraint';
  END IF;

  -- Add foreign key for product_reviews
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_reviews_product') THEN
    ALTER TABLE product_reviews
    ADD CONSTRAINT fk_reviews_product
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added fk_reviews_product constraint';
  END IF;
END $$;

-- Verify foreign keys added
SELECT 
  conname as constraint_name,
  conrelid::regclass as table_name
FROM pg_constraint
WHERE conname LIKE 'fk_%category' OR conname LIKE 'fk_%collection%' OR conname LIKE 'fk_%review%'
ORDER BY table_name, constraint_name;
