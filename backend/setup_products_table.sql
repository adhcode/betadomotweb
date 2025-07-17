-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    sale_price DECIMAL(10,2) CHECK (sale_price >= 0),
    images JSONB DEFAULT '[]'::jsonb,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    sku TEXT UNIQUE,
    weight DECIMAL(8,2) DEFAULT 0 CHECK (weight >= 0),
    dimensions TEXT,
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample products for testing
INSERT INTO products (slug, name, description, price, category, tags, stock, sku, weight, dimensions, featured, active) VALUES
(
    'modern-ergonomic-chair',
    'Modern Ergonomic Chair',
    'A beautifully designed ergonomic chair that combines style with comfort. Perfect for your home office or workspace.',
    299.99,
    'Furniture',
    ARRAY['modern', 'ergonomic', 'office', 'comfortable'],
    15,
    'SKU-CHAIR-001',
    12.5,
    '60 x 65 x 120 cm',
    true,
    true
),
(
    'minimalist-coffee-table',
    'Minimalist Coffee Table',
    'Clean lines and elegant design make this coffee table the perfect centerpiece for your living room.',
    199.99,
    'Furniture',
    ARRAY['minimalist', 'coffee-table', 'living-room', 'elegant'],
    8,
    'SKU-TABLE-001',
    8.2,
    '120 x 60 x 45 cm',
    true,
    true
),
(
    'smart-led-lamp',
    'Smart LED Table Lamp',
    'Modern smart lamp with adjustable brightness and color temperature. Control via app or voice commands.',
    89.99,
    'Lighting',
    ARRAY['smart', 'led', 'lamp', 'adjustable'],
    25,
    'SKU-LAMP-001',
    2.1,
    '25 x 15 x 45 cm',
    false,
    true
),
(
    'storage-basket-set',
    'Woven Storage Basket Set',
    'Set of 3 beautifully crafted storage baskets perfect for organizing your home. Made from natural materials.',
    49.99,
    'Storage',
    ARRAY['storage', 'basket', 'woven', 'natural'],
    30,
    'SKU-BASKET-001',
    1.8,
    'Various sizes',
    false,
    true
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access" ON products
    FOR SELECT USING (active = true);

-- Create policies for admin full access (you'll need to adjust this based on your auth setup)
CREATE POLICY "Admin full access" ON products
    FOR ALL USING (true); -- This is a simple policy - you may want to make it more secure 