# Debug Featured Hero - Troubleshooting Guide

## Issue: Guide set as featured hero not showing

Let's debug this step by step.

## Step 1: Check Database Directly

Run these SQL queries in your Supabase dashboard or via `psql`:

### Check if any posts are featured:
```sql
SELECT id, slug, title, featured_hero, published_at 
FROM posts 
WHERE featured_hero = true;
```

### Check if any guides are featured:
```sql
SELECT id, slug, title, featured_hero, published_at 
FROM guides 
WHERE featured_hero = true;
```

### Check all posts (to see what exists):
```sql
SELECT id, slug, title, featured_hero, published_at 
FROM posts 
ORDER BY published_at DESC 
LIMIT 10;
```

### Check all guides (to see what exists):
```sql
SELECT id, slug, title, featured_hero, published_at 
FROM guides 
ORDER BY published_at DESC 
LIMIT 10;
```

## Step 2: Test API Endpoints Directly

### Test Posts API:
```bash
# Check featured posts
curl http://localhost:8080/posts?featured_hero=true&limit=1

# Check all posts
curl http://localhost:8080/posts?limit=10
```

### Test Guides API:
```bash
# Check featured guides
curl http://localhost:8080/guides?featured_hero=true&limit=1

# Check all guides
curl http://localhost:8080/guides?limit=10
```

## Step 3: Check Browser Console

Open your homepage and check the console. You should see:

```
🔍 Fetching featured hero content from posts and guides
📡 API Base URL: http://localhost:8080
📝 Checking posts: http://localhost:8080/posts?featured_hero=true&limit=1
📝 Posts response status: 200
📝 Posts data: [...]
💡 Checking guides: http://localhost:8080/guides?featured_hero=true&limit=1
💡 Guides response status: 200
💡 Guides data: [...]
```

## Step 4: Verify Featured Hero Was Set

### Via Admin UI:
1. Go to http://localhost:3000/admin/dashboard/guides
2. Look for the guide you set as featured
3. It should have a yellow background
4. The star icon should be filled (⭐)

### Via API:
```bash
# Set a guide as featured hero
curl -X POST http://localhost:8080/admin/guides/YOUR-GUIDE-SLUG/featured-hero \
  -H "Authorization: Basic $(echo -n 'admin:password' | base64)"

# Check if it worked
curl http://localhost:8080/guides?featured_hero=true&limit=1
```

## Step 5: Common Issues

### Issue: "No featured content found" but I set one

**Possible causes:**
1. The guide doesn't have `published_at` set
2. The API is querying the wrong database
3. The featured_hero flag didn't save
4. Browser cache is showing old data

**Solutions:**
```sql
-- Check if guide has published_at
SELECT slug, title, published_at, featured_hero 
FROM guides 
WHERE slug = 'your-guide-slug';

-- If published_at is null, set it:
UPDATE guides 
SET published_at = NOW() 
WHERE slug = 'your-guide-slug';

-- Verify featured_hero is true:
UPDATE guides 
SET featured_hero = true 
WHERE slug = 'your-guide-slug';
```

### Issue: Guide shows in admin but not on homepage

**Check:**
1. Hard refresh the homepage (Ctrl+Shift+R or Cmd+Shift+R)
2. Check browser console for errors
3. Verify the guide has all required fields:
   - title ✅
   - description or excerpt ✅
   - published_at ✅
   - featured_hero = true ✅

### Issue: Old content still showing

**Clear cache:**
```bash
# In browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Or clear all browser data for localhost
```

## Step 6: Manual Fix

If nothing works, manually set it in the database:

```sql
-- First, unset all featured heroes
UPDATE posts SET featured_hero = false;
UPDATE guides SET featured_hero = false;

-- Then set your specific guide
UPDATE guides 
SET featured_hero = true, 
    published_at = COALESCE(published_at, NOW())
WHERE slug = 'your-guide-slug';

-- Verify it worked
SELECT slug, title, featured_hero, published_at 
FROM guides 
WHERE featured_hero = true;
```

## Step 7: Check Backend Logs

Look at your backend terminal for any errors when you:
1. Set a guide as featured hero
2. Load the homepage
3. Query the guides API

## Step 8: Verify Migration Ran

```bash
cd backend
./check_migrations.sh
```

Should show:
```
✅ posts.featured_hero column exists
✅ guides.featured_hero column exists
```

## Quick Test Script

Create a test guide and set it as featured:

```sql
-- Create a test guide
INSERT INTO guides (
  slug, 
  title, 
  description, 
  content, 
  featured_hero, 
  published_at,
  read_time,
  views
) VALUES (
  'test-featured-guide',
  'Test Featured Guide',
  'This is a test guide to verify featured hero works',
  '# Test Guide\n\nThis is test content.',
  true,
  NOW(),
  '2 min read',
  0
);

-- Check if it appears
SELECT slug, title, featured_hero FROM guides WHERE featured_hero = true;
```

Then visit your homepage and check console logs.

## Expected Behavior

When everything works:

1. **Console shows:**
   ```
   ✅ Found featured guide: Test Featured Guide
   ```

2. **Homepage displays:**
   - Full-width image (or placeholder)
   - Guide title
   - Guide description
   - Read time and date
   - "Read Guide" button

3. **Admin shows:**
   - Yellow background on the guide
   - Filled star icon (⭐)
   - "Hero" badge

## Still Not Working?

1. **Restart backend:**
   ```bash
   cd backend
   # Stop current process (Ctrl+C)
   go run main.go
   ```

2. **Restart frontend:**
   ```bash
   cd frontend
   # Stop current process (Ctrl+C)
   npm run dev
   ```

3. **Check DATABASE_URL:**
   ```bash
   cd backend
   cat .env | grep DATABASE_URL
   ```

4. **Test database connection:**
   ```bash
   psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM guides;"
   ```

## Contact Points

If you're still stuck, provide:
1. Console logs from homepage
2. Result of SQL queries above
3. Backend terminal output
4. Any error messages

---

**Most Common Fix:** Hard refresh the browser (Ctrl+Shift+R) after setting featured hero!
