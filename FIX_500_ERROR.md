# Fix the 500 Error - Simple Instructions

## What's Happening

You're seeing this error in the console:
```
GET http://localhost:8080/guides?featured_hero=true&limit=1 500 (Internal Server Error)
Guides API returned: 500
No featured content found
```

**This is expected!** The `guides` table doesn't have the `featured_hero` column yet.

## The Fix (2 minutes)

### Option 1: One Command (Easiest)

```bash
chmod +x RUN_THIS_NOW.sh
./RUN_THIS_NOW.sh
```

### Option 2: Manual Steps

```bash
cd backend

# Make script executable
chmod +x run_guides_featured_hero_migration.sh

# Run the migration
./run_guides_featured_hero_migration.sh
```

### Option 3: Direct SQL (If scripts don't work)

```bash
cd backend

# Run the SQL directly
psql "$DATABASE_URL" -f add_featured_hero_to_guides.sql
```

## After Running the Migration

1. **Refresh your browser** (Ctrl+Shift+R or Cmd+Shift+R)
2. The 500 error will be gone
3. You'll see "No featured content found" (this is correct - nothing is featured yet)
4. The default hero message will display

## Set Your First Featured Content

### Via Admin UI (Recommended):
1. Go to http://localhost:3000/admin/login
2. Login with your credentials
3. Click "Posts" in the sidebar
4. Find any post and click the ⭐ star icon
5. Refresh the homepage - you'll see your featured post!

### Via Database (Quick):
```sql
-- Set a post as featured
UPDATE posts SET featured_hero = true WHERE slug = 'your-post-slug';
```

## Verify It's Working

After migration, you should see in console:
```
✅ Fetching featured hero content from posts and guides
✅ No featured content found (or)
✅ Found featured post: [Post Title]
```

No more 500 errors!

## Still Having Issues?

### Check if migration ran:
```bash
cd backend
chmod +x check_migrations.sh
./check_migrations.sh
```

### Check backend logs:
Look for any errors in your backend terminal

### Check DATABASE_URL:
```bash
cd backend
echo $DATABASE_URL
```

Should show your database connection string.

## What Changed

✅ **Fixed:**
- Added `featured_hero` column to guides table
- Added index for faster queries
- Backend now handles both posts and guides as featured content

✅ **Already Working:**
- Frontend gracefully handles errors
- Skeleton loader shows immediately
- Default hero displays when no content is featured
- Soft, subtle design implemented
- Mobile responsive header

## Next Steps After Fix

1. ✅ Run migration (you're doing this now)
2. Set a post or guide as featured
3. Enjoy your beautiful featured hero section!
4. Create compelling content to feature
5. Monitor engagement

---

**Need help?** Check:
- `QUICK_START.md` - Detailed setup guide
- `FEATURED_HERO_GUIDE.md` - Complete documentation
- `FEATURED_HERO_STATUS.md` - Current status

**TL;DR:** Run `./RUN_THIS_NOW.sh` and refresh your browser. Done! 🎉
