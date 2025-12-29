# Supabase Guides Migration

## How to Run the Migration

1. **Go to your Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project: `amqfaxpexigofotoandv`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste the Migration**
   - Copy the entire contents of `backend/create_guides_table.sql`
   - Paste it into the SQL Editor

4. **Run the Migration**
   - Click "Run" button
   - You should see success messages for table creation and data insertion

## What This Migration Does

- ✅ Creates a `guides` table with proper PostgreSQL/Supabase structure
- ✅ Sets up proper indexes for performance
- ✅ Enables Row Level Security (RLS)
- ✅ Creates policies for public read access
- ✅ Inserts sample guides for each category:
  - **Cleaning**: Complete Home Cleaning Schedule, Natural Cleaning Solutions
  - **Organization**: Decluttering Your Whole Home
  - **Decorating**: Color Scheme Selection
  - **Energy Savings**: Solar Power for Homes

## Verify the Migration

After running, you can verify by running this query:

```sql
SELECT category, title, featured FROM guides ORDER BY category, title;
```

You should see 5 sample guides created across different categories.

## Next Steps

After the migration is complete, you'll need to:

1. Create API endpoints in your Go backend to serve guides
2. Update the frontend to fetch real guide data from the API
3. Create admin interface for managing guides (optional)

## Troubleshooting

If you get any errors:
- Make sure you're connected to the correct Supabase project
- Check that you have the necessary permissions
- Verify the SQL syntax is correct for PostgreSQL