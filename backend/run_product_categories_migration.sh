#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "Running product categories migration..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL is not set in .env file"
    echo ""
    echo "Please add your Supabase database connection string to backend/.env:"
    echo "DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
    echo ""
    echo "You can find this in your Supabase project settings under Database > Connection String"
    exit 1
fi

echo "Database: $DATABASE_URL"

# Run the migration
psql "$DATABASE_URL" -f create_product_categories_table.sql

if [ $? -eq 0 ]; then
    echo "✅ Product categories migration completed successfully!"
    echo ""
    echo "Categories created:"
    echo "  1. Home Tech"
    echo "  2. Furniture"
    echo "  3. Organization"
    echo "  4. Health & Comfort"
    echo "  5. Lighting"
    echo "  6. Decor"
else
    echo "❌ Migration failed!"
    exit 1
fi
