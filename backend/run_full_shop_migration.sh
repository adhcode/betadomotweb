#!/bin/bash

# Full-Scale E-Commerce Shop Migration
# This creates the complete shop infrastructure

set -e

echo "🚀 Starting full-scale shop migration..."
echo ""

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL not set"
    echo "Please set DATABASE_URL in your .env file"
    exit 1
fi

echo "📊 Running migration: create_full_shop_schema.sql"
echo "This will create:"
echo "  - Product categories (hierarchical)"
echo "  - Product collections"
echo "  - Product reviews"
echo "  - Enhanced product fields"
echo "  - Search infrastructure"
echo "  - Helper functions and triggers"
echo ""

# Run migration via psql
psql "$DATABASE_URL" -f create_full_shop_schema.sql

echo ""
echo "✅ Full-scale shop migration completed successfully!"
echo ""
echo "📝 What was created:"
echo "  ✓ product_categories table with 15+ default categories"
echo "  ✓ product_collections table with 6 default collections"
echo "  ✓ product_reviews table"
echo "  ✓ Enhanced products table with:"
echo "    - category_id, brand, material, color"
echo "    - rating_average, rating_count, review_count"
echo "    - view_count, sales_count"
echo "    - is_bestseller, is_new_arrival, is_on_sale"
echo "    - Full-text search vector"
echo "  ✓ Indexes for filtering and sorting"
echo "  ✓ Auto-update triggers for counts and ratings"
echo ""
echo "🎯 Next steps:"
echo "1. Update backend handlers for categories and filters"
echo "2. Create shop pages and components"
echo "3. Implement search functionality"
echo "4. Add products to categories"
echo ""
