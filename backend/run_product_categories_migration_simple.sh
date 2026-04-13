#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "🚀 Running product categories migration using Supabase REST API..."

# Extract project ref from SUPABASE_URL
PROJECT_REF=$(echo $SUPABASE_URL | sed 's/https:\/\/\([^.]*\).*/\1/')

echo "Project: $PROJECT_REF"

# Read the SQL file
SQL_CONTENT=$(cat create_product_categories_table.sql)

# Use Supabase REST API to execute SQL
curl -X POST "https://$PROJECT_REF.supabase.co/rest/v1/rpc/exec_sql" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$SQL_CONTENT" | jq -Rs .)}"

echo ""
echo "✅ Migration script executed!"
echo ""
echo "Categories that should be created:"
echo "  1. Home Tech"
echo "  2. Furniture"
echo "  3. Organization"
echo "  4. Health & Comfort"
echo "  5. Lighting"
echo "  6. Decor"
