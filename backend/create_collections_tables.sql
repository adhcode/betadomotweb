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

-- Verify tables
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('product_collections', 'product_collection_items')
ORDER BY table_name;
