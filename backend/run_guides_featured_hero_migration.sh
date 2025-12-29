#!/bin/bash

# Script to add featured_hero column to guides table
# This allows guides to be featured in the hero section

set -e

echo "🚀 Adding featured_hero column to guides table..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL is not set"
    echo "Please set DATABASE_URL in your .env file or environment"
    exit 1
fi

echo "📊 Database: $DATABASE_URL"
echo ""

# Run the migration
echo "Running migration..."
psql "$DATABASE_URL" -f add_featured_hero_to_guides.sql

echo ""
echo "✅ Migration completed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. You can now set guides as featured hero via the admin API"
echo "   2. Use POST /admin/guides/{slug}/featured-hero to set a guide as featured"
echo "   3. Use DELETE /admin/guides/{slug}/featured-hero to unset featured status"
echo "   4. Only one item (post or guide) can be featured at a time"
