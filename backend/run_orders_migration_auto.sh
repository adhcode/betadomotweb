#!/bin/bash

# Auto-run orders migration using psql
# This reads the SQL file and executes it against your Supabase database

# Load environment variables
source .env

# Extract connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database?sslmode=require

echo "Running orders table migration..."

# Use psql to run the migration
psql "$DATABASE_URL" -f create_orders_table.sql

if [ $? -eq 0 ]; then
    echo "✅ Orders table migration completed successfully!"
else
    echo "❌ Migration failed. Please check the error above."
    exit 1
fi
