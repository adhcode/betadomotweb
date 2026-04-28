-- Step 4: Seed Default Categories and Collections
-- Run after Steps 1, 2, and 3

-- Insert main categories
INSERT INTO product_categories (slug, name, description, display_order, is_featured) VALUES
('furniture', 'Furniture', 'Thoughtfully designed furniture for every room in your home', 1, true),
('lighting', 'Lighting', 'Illuminate your space with carefully selected lighting', 2, true),
('decor', 'Decor', 'Decorative pieces that add character to your home', 3, true),
('textiles', 'Textiles', 'Soft furnishings and textiles for comfort and style', 4, true),
('storage', 'Storage', 'Practical storage solutions that don''t compromise on design', 5, false),
('outdoor', 'Outdoor', 'Furniture and decor for outdoor living spaces', 6, false)
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories (using DO block for safety)
DO $$
DECLARE
  furniture_id UUID;
  lighting_id UUID;
  decor_id UUID;
  textiles_id UUID;
BEGIN
  -- Get parent IDs
  SELECT id INTO furniture_id FROM product_categories WHERE slug = 'furniture';
  SELECT id INTO lighting_id FROM product_categories WHERE slug = 'lighting';
  SELECT id INTO decor_id FROM product_categories WHERE slug = 'decor';
  SELECT id INTO textiles_id FROM product_categories WHERE slug = 'textiles';
  
  -- Furniture subcategories
  IF furniture_id IS NOT NULL THEN
    INSERT INTO product_categories (slug, name, description, parent_id, display_order) VALUES
    ('seating', 'Seating', 'Chairs, sofas, and benches', furniture_id, 1),
    ('tables', 'Tables', 'Dining, coffee, and side tables', furniture_id, 2),
    ('storage-furniture', 'Storage', 'Shelving, cabinets, and storage units', furniture_id, 3),
    ('beds', 'Beds', 'Bed frames and bedroom furniture', furniture_id, 4)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
  
  -- Lighting subcategories
  IF lighting_id IS NOT NULL THEN
    INSERT INTO product_categories (slug, name, description, parent_id, display_order) VALUES
    ('ceiling-lights', 'Ceiling Lights', 'Pendants, chandeliers, and ceiling fixtures', lighting_id, 1),
    ('floor-lamps', 'Floor Lamps', 'Standing lamps for ambient lighting', lighting_id, 2),
    ('table-lamps', 'Table Lamps', 'Desk and bedside lamps', lighting_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
  
  -- Decor subcategories
  IF decor_id IS NOT NULL THEN
    INSERT INTO product_categories (slug, name, description, parent_id, display_order) VALUES
    ('wall-art', 'Wall Art', 'Prints, paintings, and wall decorations', decor_id, 1),
    ('vases', 'Vases & Vessels', 'Decorative vases and containers', decor_id, 2),
    ('mirrors', 'Mirrors', 'Wall and standing mirrors', decor_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
  
  -- Textiles subcategories
  IF textiles_id IS NOT NULL THEN
    INSERT INTO product_categories (slug, name, description, parent_id, display_order) VALUES
    ('rugs', 'Rugs', 'Area rugs and runners', textiles_id, 1),
    ('cushions', 'Cushions', 'Throw pillows and cushions', textiles_id, 2),
    ('throws', 'Throws & Blankets', 'Cozy throws and blankets', textiles_id, 3)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- Insert default collections
INSERT INTO product_collections (slug, name, description, is_featured, display_order) VALUES
('scandinavian-living', 'Scandinavian Living', 'Clean lines, natural materials, and functional beauty', true, 1),
('minimalist-essentials', 'Minimalist Essentials', 'Less is more—pieces that matter', true, 2),
('new-arrivals', 'New Arrivals', 'The latest additions to our collection', true, 3),
('bestsellers', 'Bestsellers', 'Our most loved products', true, 4),
('under-50k', 'Under ₦50,000', 'Quality pieces at accessible prices', false, 5),
('workspace', 'Work from Home', 'Everything you need for a productive home office', false, 6)
ON CONFLICT (slug) DO NOTHING;

-- Verify data inserted
SELECT 'Categories' as type, COUNT(*) as count FROM product_categories
UNION ALL
SELECT 'Collections', COUNT(*) FROM product_collections;

-- Show category hierarchy
SELECT 
  COALESCE(p.name, 'ROOT') as parent,
  c.name as category,
  c.slug
FROM product_categories c
LEFT JOIN product_categories p ON c.parent_id = p.id
ORDER BY COALESCE(p.display_order, 0), c.display_order;
