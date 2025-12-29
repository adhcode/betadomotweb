#!/bin/bash

# Script to add featured_hero column to posts table
# This migration adds support for setting a post as the featured hero on the homepage

set -e

echo "🚀 Starting featured_hero column migration..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if required environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set"
    echo "Please check your .env file"
    exit 1
fi

# Extract database connection details from Supabase URL
DB_HOST=$(echo $SUPABASE_URL | sed 's|https://||' | sed 's|http://||' | cut -d'/' -f1)
DB_NAME="postgres"
DB_USER="postgres"

echo "📊 Database: $DB_HOST"
echo "📝 Running migration..."

# Run the migration using psql
PGPASSWORD=$SUPABASE_SERVICE_KEY psql \
    -h "db.${DB_HOST}" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -f add_featured_hero_column.sql

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
    echo ""
    echo "📌 Next steps:"
    echo "   1. Go to Admin Dashboard → Posts"
    echo "   2. Click the star icon on any post to set it as the featured hero"
    echo "   3. Visit the homepage to see the featured post in the hero section"
else
    echo "❌ Migration failed!"
    exit 1
fi
