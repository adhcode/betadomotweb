#!/bin/bash

# Run guides table migration
echo "Creating guides table and inserting sample data..."

# Check if database file exists
if [ ! -f "blog.db" ]; then
    echo "Error: blog.db not found. Please make sure you're in the correct directory."
    exit 1
fi

# Run the migration
sqlite3 blog.db < create_guides_table.sql

if [ $? -eq 0 ]; then
    echo "✅ Guides table created successfully!"
    echo "✅ Sample guides inserted!"
    
    # Show the guides that were created
    echo ""
    echo "📚 Created guides:"
    sqlite3 blog.db "SELECT category, title FROM guides ORDER BY category, title;"
    
    echo ""
    echo "🔢 Total guides created:"
    sqlite3 blog.db "SELECT COUNT(*) as total_guides FROM guides;"
else
    echo "❌ Error running migration"
    exit 1
fi