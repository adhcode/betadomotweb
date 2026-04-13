-- Blog-Product Links Module
-- This table allows linking blog posts to products for future integration

CREATE TABLE IF NOT EXISTS blog_product_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_slug TEXT NOT NULL,
    product_slug TEXT NOT NULL,
    link_type TEXT DEFAULT 'related', -- 'related', 'featured', 'mentioned'
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_slug, product_slug)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_blog_product_links_post ON blog_product_links(post_slug);
CREATE INDEX IF NOT EXISTS idx_blog_product_links_product ON blog_product_links(product_slug);
CREATE INDEX IF NOT EXISTS idx_blog_product_links_type ON blog_product_links(link_type);

-- Optional: Add foreign key constraints if you want referential integrity
-- ALTER TABLE blog_product_links 
--   ADD CONSTRAINT fk_post FOREIGN KEY (post_slug) REFERENCES posts(slug) ON DELETE CASCADE;
-- ALTER TABLE blog_product_links 
--   ADD CONSTRAINT fk_product FOREIGN KEY (product_slug) REFERENCES products(slug) ON DELETE CASCADE;
