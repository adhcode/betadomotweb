# Fix Collections RLS Error

## Problem
Collection creation is failing with: "new row violates row-level security policy for table product_collections"

This is because Supabase has Row Level Security (RLS) enabled by default, blocking inserts from the backend.

## Solution
Run this SQL in Supabase to disable RLS:

### Steps:

1. **Go to Supabase Dashboard**
   - Open: https://supabase.com/dashboard/project/amqfaxpexigofotoandv

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar

3. **Create New Query**
   - Click "New Query"

4. **Copy and Paste This SQL:**

```sql
-- Disable RLS (Row Level Security) for collections tables
ALTER TABLE product_collections DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_collection_items DISABLE ROW LEVEL SECURITY;
```

5. **Run the Query**
   - Click "Run" or press Cmd/Ctrl + Enter

6. **Verify Success**
   - You should see "Success. No rows returned"
   - Try creating a collection again - it should work now!

## What This Does

Disables Row Level Security on the collections tables, allowing your backend (using the service role key) to insert, update, and delete records without RLS policies blocking it.

## After Running

Try creating a collection again. It should work immediately without restarting the backend!
