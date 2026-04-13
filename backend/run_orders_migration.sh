#!/bin/bash

# Load environment variables
source .env

echo "🚀 Running Orders Table Migration..."
echo "Database: $SUPABASE_URL"

# Run the migration
psql "$DATABASE_URL" -f create_orders_table.sql

if [ $? -eq 0 ]; then
    echo "✅ Orders table migration completed successfully!"
else
    echo "❌ Migration failed!"
    exit 1
fi
