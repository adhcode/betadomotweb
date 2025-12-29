# 🚀 Run This First - Featured Hero Setup

## The 500 Error You're Seeing

The error `GET http://localhost:8080/guides?featured_hero=true&limit=1 500` is **expected** because the `guides` table doesn't have the `featured_hero` column yet.

## Quick Fix (2 Steps)

### Step 1: Run the Migration

```bash
cd backend
chmod +x run_guides_featured_hero_migration.sh
./run_guides_featured_hero_migration.sh
```

**OR** if you prefer to run it manually:

```bash
cd backend
psql "$DATABASE_URL" -f add_featured_hero_to_guides.sql
```

### Step 2: Set a Post as Featured

Go to your admin dashboard and click the star icon next to any post:

1. Visit: http://localhost:3000/admin/login
2. Go to "Posts"
3. Click the ⭐ star icon next to any post
4. Refresh the homepage

## What Will Happen

**Before Migration:**
- ❌ 500 error on guides API
- ✅ Default hero shows (graceful fallback)

**After Migration:**
- ✅ No more 500 error
- ✅ API returns empty array (no featured content yet)
- ✅ Default hero shows

**After Setting Featured Content:**
- ✅ Featured post/guide displays beautifully
- ✅ Soft, subtle design
- ✅ Fast loading with skeleton

## Alternative: Quick Database Update

If you want to test immediately without the admin UI:

```sql
-- Set any existing post as featured
UPDATE posts 
SET featured_hero = true 
WHERE slug = (SELECT slug FROM posts ORDER BY published_at DESC LIMIT 1);
```

Then refresh your homepage!

## Verify It's Working

After migration, check:

```bash
cd backend
./check_migrations.sh
```

You should see:
- ✅ posts.featured_hero column exists
- ✅ guides.featured_hero column exists

## Still Having Issues?

1. **Check your DATABASE_URL** is set in `backend/.env`
2. **Restart your backend** after migration
3. **Clear browser cache** and hard refresh (Ctrl+Shift+R)
4. **Check backend logs** for any errors

---

**TL;DR:** Run the migration script, then set a post as featured via admin UI or database. That's it! 🎉
