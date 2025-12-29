#!/bin/bash

# Script to check if featured_hero migrations have been run

set -e

echo "🔍 Checking Featured Hero Migrations..."
echo ""

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

# Check posts table
echo "Checking posts table..."
POSTS_CHECK=$(psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='featured_hero');" 2>&1)

if echo "$POSTS_CHECK" | grep -q "t"; then
    echo "✅ posts.featured_hero column exists"
else
    echo "❌ posts.featured_hero column MISSING"
    echo "   Run: ./run_featured_hero_migration.sh"
fi

echo ""

# Check guides table
echo "Checking guides table..."
GUIDES_CHECK=$(psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='guides' AND column_name='featured_hero');" 2>&1)

if echo "$GUIDES_CHECK" | grep -q "t"; then
    echo "✅ guides.featured_hero column exists"
else
    echo "❌ guides.featured_hero column MISSING"
    echo "   Run: ./run_guides_featured_hero_migration.sh"
fi

echo ""

# Check for any featured content
echo "Checking for featured content..."
FEATURED_POSTS=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM posts WHERE featured_hero = true;" 2>&1)
FEATURED_GUIDES=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM guides WHERE featured_hero = true;" 2>&1)

if echo "$FEATURED_POSTS" | grep -q "[0-9]"; then
    FEATURED_POSTS=$(echo "$FEATURED_POSTS" | tr -d ' ')
    if [ "$FEATURED_POSTS" -gt 0 ]; then
        echo "✅ Found $FEATURED_POSTS featured post(s)"
        psql "$DATABASE_URL" -c "SELECT slug, title FROM posts WHERE featured_hero = true;"
    else
        echo "ℹ️  No featured posts set"
    fi
fi

if echo "$FEATURED_GUIDES" | grep -q "[0-9]"; then
    FEATURED_GUIDES=$(echo "$FEATURED_GUIDES" | tr -d ' ')
    if [ "$FEATURED_GUIDES" -gt 0 ]; then
        echo "✅ Found $FEATURED_GUIDES featured guide(s)"
        psql "$DATABASE_URL" -c "SELECT slug, title FROM guides WHERE featured_hero = true;"
    else
        echo "ℹ️  No featured guides set"
    fi
fi

echo ""
echo "✅ Migration check complete!"
