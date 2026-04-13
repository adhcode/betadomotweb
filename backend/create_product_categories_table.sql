-- Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert the official product categories
INSERT INTO product_categories (name, slug, description, display_order) VALUES
    ('Home Tech', 'home-tech', 'Smart home devices, gadgets, and technology for modern living', 1),
    ('Furniture', 'furniture', 'Quality furniture pieces for every room in your home', 2),
    ('Organization', 'organization', 'Storage solutions and organizational tools', 3),
    ('Health & Comfort', 'health-comfort', 'Products for wellness, comfort, and healthy living', 4),
    ('Lighting', 'lighting', 'Lamps, fixtures, and lighting solutions', 5),
    ('Decor', 'decor', 'Decorative items and home accessories', 6)
ON CONFLICT (slug) DO NOTHING;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_categories_display_order ON product_categories(display_order);
