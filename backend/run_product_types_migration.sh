#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "Running product types migration..."

# Run the migration
psql "$DATABASE_URL" -f add_product_types.sql

if [ $? -eq 0 ]; then
    echo "✅ Product types migration completed successfully!"
else
    echo "❌ Migration failed!"
    exit 1
fi
