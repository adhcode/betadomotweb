# Simple Categories Migration Guide

## What This Does

This migration simplifies your blog categories to match the frontend. It will:

1. ✅ Remove complex category tables (product_categories, lifestyle_collections, blog_to_product_collections)
2. ✅ Create a simple `blog_categories` table with 8 categories
3. ✅ Update existing posts to use the new category names
4. ✅ Align backend with frontend categories

## The 8 Simple Categories

1. **Cleaning** - Keep your home fresh and spotless
2. **Organization** - Transform your space with smart solutions
3. **Life** - Lifestyle tips and wellness advice
4. **Decorating** - Beautiful decor ideas and styling tips
5. **Energy Savings** - Energy-efficient solutions
6. **Security & Safety** - Protect your home and family
7. **Smart & Tech** - Smart technology and gadgets
8. **Home Projects** - DIY projects and renovations

## How to Run (Supabase)

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `amqfaxpexigofotoandv`
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Migration
1. Click **New Query**
2. Open the file: `backend/setup_simple_categories.sql`
3. Copy all the SQL code
4. Paste it into the Supabase SQL Editor
5. Click **Run** (or press Cmd+Enter)

### Step 3: Verify
After running, you should see:
- A summary of posts per category
- Message: "Simple blog categories setup complete!"

## What Gets Updated

### Posts Table
- Existing posts will be mapped to new categories:
  - Old "Home Health & Safety" → New "Cleaning" or "Security & Safety"
  - Old "Home Organization" → New "Organization"
  - Old "Kitchen & Daily Living" → New "Life"
  - Old "Interior Design" → New "Decorating"
  - Old "Sustainability" → New "Energy Savings"
  - Old "Smart Home & Tech" → New "Smart & Tech"
  - Old "DIY & Home Projects" → New "Home Projects"

### New Table: blog_categories
Simple reference table with:
- id
- name
- slug
- description
- color (hex code)
- icon (Lucide icon name)
- display_order

## After Migration

Your backend will now perfectly match your frontend categories. You can:

1. ✅ Create posts with the 8 categories in the admin dashboard
2. ✅ Filter posts by category on the frontend
3. ✅ Display category pages with correct colors and icons
4. ✅ No more confusion between backend and frontend categories

## Rollback (If Needed)

If something goes wrong, you can restore from your Supabase backup:
1. Go to Database → Backups
2. Select a backup from before the migration
3. Click Restore

## Questions?

- The SQL file is at: `backend/setup_simple_categories.sql`
- The script is at: `backend/run_simple_categories.sh`
- All 8 categories are defined in: `frontend/components/AdminPostForm.tsx`
