# How to Run the Database Migration

## Quick Steps

### Option 1: Supabase Dashboard (Easiest)

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `amqfaxpexigofotoandv`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste this SQL:

```sql
-- Add topics column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS topics TEXT[] DEFAULT '{}';

-- Create an index on topics for faster filtering
CREATE INDEX IF NOT EXISTS idx_posts_topics ON posts USING GIN(topics);

-- Update existing posts to have empty topics array if NULL
UPDATE posts SET topics = '{}' WHERE topics IS NULL;

COMMENT ON COLUMN posts.topics IS 'Array of specific topics under the post category';
```

6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

### Option 2: Using psql (Advanced)

If you have psql installed:

```bash
# Get your connection string from Supabase:
# Project Settings > Database > Connection string (URI)

# Then run:
psql "YOUR_CONNECTION_STRING" -f backend/setup_add_topics.sql
```

## Verify Migration

After running the migration, verify it worked:

1. Go to **Table Editor** in Supabase
2. Select the `posts` table
3. You should see a new column called `topics` with type `text[]`

## What This Does

- ✅ Adds a `topics` column to store an array of topic strings
- ✅ Creates an index for fast topic filtering
- ✅ Sets existing posts to have an empty topics array
- ✅ Adds a helpful comment to the column

## Troubleshooting

**Error: "column already exists"**
- This is fine! It means the migration already ran. The `IF NOT EXISTS` clause prevents errors.

**Error: "permission denied"**
- Make sure you're using the connection string with the correct permissions
- Try using the "Transaction" connection string from Supabase settings

**Error: "relation posts does not exist"**
- Your posts table might have a different name
- Check your table name in the Supabase Table Editor

## Next Steps

After the migration:
1. Restart your backend server
2. Test creating a new post with topics in the admin dashboard
3. Verify topics are saved and displayed correctly
