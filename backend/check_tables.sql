-- Check if tables exist and what columns they have

-- Check product_categories table
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'product_categories'
ORDER BY ordinal_position;

-- Check if table exists at all
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'product_categories'
) as table_exists;

-- List all tables that start with 'product'
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'product%'
ORDER BY table_name;
