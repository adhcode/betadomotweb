#!/bin/bash

# Simple Categories Migration Script
# This script updates the database to use the 8 simple frontend categories

set -e

echo "🔄 Starting simple categories migration..."
echo ""
echo "⚠️  IMPORTANT: This migration will:"
echo "   - Drop old complex category tables"
echo "   - Create a simple blog_categories table"
echo "   - Update existing posts to use the 8 new categories"
echo ""
echo "📋 You need to run this SQL in your Supabase SQL Editor:"
echo "   1. Go to https://supabase.com/dashboard"
echo "   2. Select your project"
echo "   3. Go to SQL Editor"
echo "   4. Copy and paste the contents of: backend/setup_simple_categories.sql"
echo "   5. Click 'Run'"
echo ""
echo "📄 SQL file location: backend/setup_simple_categories.sql"
echo ""
echo "✅ After running, your backend will have these 8 categories:"
echo "   1. Cleaning"
echo "   2. Organization"
echo "   3. Life"
echo "   4. Decorating"
echo "   5. Energy Savings"
echo "   6. Security & Safety"
echo "   7. Smart & Tech"
echo "   8. Home Projects"
echo ""
echo "🎉 These match your frontend categories!"
