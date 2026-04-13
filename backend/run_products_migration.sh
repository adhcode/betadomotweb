#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "🚀 Running products table migration..."
echo "📊 Database: $SUPABASE_URL"

# Run the migration
psql "$DATABASE_URL" -f create_products_table.sql

if [ $? -eq 0 ]; then
    echo "✅ Products table migration completed successfully!"
else
    echo "❌ Migration failed!"
    exit 1
fi
