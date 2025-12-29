#!/bin/bash

# Run the topics migration
# This script connects to Supabase and runs the migration

echo "🔄 Running topics migration..."

# You need to get your database connection string from Supabase
# Go to: Project Settings > Database > Connection string (URI)
# Then run: psql "YOUR_CONNECTION_STRING" -f setup_add_topics.sql

echo ""
echo "⚠️  To run this migration:"
echo "1. Go to your Supabase dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Copy and paste the contents of setup_add_topics.sql"
echo "4. Click 'Run'"
echo ""
echo "Or use psql directly:"
echo "psql 'YOUR_DATABASE_CONNECTION_STRING' -f setup_add_topics.sql"
