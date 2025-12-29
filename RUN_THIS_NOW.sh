#!/bin/bash

# Quick fix for the 500 error - Run this script!

echo "🚀 Quick Fix for Featured Hero 500 Error"
echo "=========================================="
echo ""

cd backend

# Check if we're in the right directory
if [ ! -f "add_featured_hero_to_guides.sql" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL is not set"
    echo ""
    echo "Please add DATABASE_URL to backend/.env file:"
    echo "DATABASE_URL=postgresql://user:password@host:port/database"
    exit 1
fi

echo "📊 Database: ${DATABASE_URL:0:30}..."
echo ""

# Run the migration
echo "🔧 Adding featured_hero column to guides table..."
psql "$DATABASE_URL" -f add_featured_hero_to_guides.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
    echo "🎉 The 500 error should now be fixed!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)"
    echo "   2. Go to http://localhost:3000/admin/login"
    echo "   3. Navigate to Posts and click the ⭐ star icon on any post"
    echo "   4. Visit the homepage to see your featured content!"
    echo ""
else
    echo ""
    echo "❌ Migration failed!"
    echo ""
    echo "Possible reasons:"
    echo "   - DATABASE_URL is incorrect"
    echo "   - Database is not accessible"
    echo "   - Column already exists (not an error, just skip)"
    echo ""
    echo "To check manually, run:"
    echo "   psql \"\$DATABASE_URL\" -c \"SELECT column_name FROM information_schema.columns WHERE table_name='guides' AND column_name='featured_hero';\""
fi
