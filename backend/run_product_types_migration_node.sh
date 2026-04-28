#!/bin/bash

# Migration script for adding product types system using Node.js
# This enables Editorial vs Everyday product distinction

set -e

echo "🔄 Starting product types migration (Node.js)..."
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed"
    echo "Please install Node.js first"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found"
    echo "Please create a .env file with SUPABASE_URL and SUPABASE_ANON_KEY"
    exit 1
fi

# Check if @supabase/supabase-js is installed
if [ ! -d "node_modules/@supabase/supabase-js" ]; then
    echo "📦 Installing dependencies..."
    npm install @supabase/supabase-js dotenv
fi

# Run the migration
echo "📊 Running migration..."
node migrate_product_types.mjs

echo ""
echo "✅ Migration script completed!"
