# Troubleshoot Featured Hero - Quick Guide

## Problem: Guide set as featured hero not showing on homepage

### Quick Fix Steps

#### Step 1: Open Test Page
1. Open `TEST_FEATURED_HERO.html` in your browser
2. Click "Test Featured Hero Logic"
3. Check the results

**What to look for:**
- ✅ `winner: "GUIDE"` or `winner: "POST"` = Something is featured
- ⚠️ `winner: "NONE"` = Nothing is featured (problem!)

#### Step 2: Check Database
Open your Supabase dashboard SQL editor and run:

```sql
-- Check what's featured
SELECT 'POST' as type, slug, title, featured_hero FROM posts WHERE featured_hero = true
UNION ALL
SELECT 'GUIDE' as type, slug, title, featured_hero FROM guides WHERE featured_hero = true;
```

**Expected result:** One row showing your featured guide

**If empty:** The featured_hero flag didn't save properly

#### Step 3: Manually Set Featured Hero
If nothing shows up, manually set it:

```sql
-- Clear all featured heroes
UPDATE posts SET featured_hero = false;
UPDATE guides SET featured_hero = false;

-- Set your guide as featured (replace 'your-guide-slug' with actual slug)
UPDATE guides 
SET featured_hero = true,
    published_at = COALESCE(published_at, NOW())
WHERE slug = 'your-guide-slug';

-- Verify it worked
SELECT slug, title, featured_hero, published_at 
FROM guides 
WHERE featured_hero = true;
```

#### Step 4: Hard Refresh Browser
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

#### Step 5: Check Console Logs
Open browser console (F12) and look for:

```
✅ Found featured guide: [Your Guide Title]
```

**If you see:**
- `ℹ️ No featured content found` = Database issue
- `❌ Error` = API issue
- Nothing = Frontend not calling API

### Common Issues & Fixes

#### Issue 1: "No featured content found" in console

**Cause:** Guide doesn't have `published_at` set

**Fix:**
```sql
UPDATE guides 
SET published_at = NOW() 
WHERE slug = 'your-guide-slug';
```

#### Issue 2: Guide shows in admin but not on homepage

**Cause:** Browser cache

**Fix:** Hard refresh (Ctrl+Shift+R)

#### Issue 3: API returns empty array

**Cause:** featured_hero column doesn't exist or isn't set

**Fix:**
```bash
cd backend
./check_migrations.sh
```

If migration missing:
```bash
./run_guides_featured_hero_migration.sh
```

#### Issue 4: Backend not responding

**Cause:** Backend not running or wrong port

**Fix:**
```bash
cd backend
go run main.go
```

Check it's running on port 8080:
```bash
curl http://localhost:8080/health
```

### Verification Checklist

Run through this checklist:

- [ ] Backend is running (`curl http://localhost:8080/health`)
- [ ] Migration ran (`./check_migrations.sh` shows ✅)
- [ ] Guide exists in database (`SELECT * FROM guides LIMIT 1`)
- [ ] Guide has `featured_hero = true` (SQL query above)
- [ ] Guide has `published_at` set (not NULL)
- [ ] API returns the guide (`curl http://localhost:8080/guides?featured_hero=true`)
- [ ] Browser cache cleared (hard refresh)
- [ ] Console shows "Found featured guide"

### Still Not Working?

1. **Restart everything:**
   ```bash
   # Backend
   cd backend
   # Ctrl+C to stop
   go run main.go

   # Frontend (in another terminal)
   cd frontend
   # Ctrl+C to stop
   npm run dev
   ```

2. **Check logs:**
   - Backend terminal for errors
   - Browser console for errors
   - Network tab for failed requests

3. **Test with a post instead:**
   ```sql
   UPDATE posts SET featured_hero = true WHERE slug = (SELECT slug FROM posts LIMIT 1);
   ```
   
   If posts work but guides don't, there's an issue with the guides API.

### Debug Commands

```bash
# Test posts API
curl http://localhost:8080/posts?featured_hero=true&limit=1

# Test guides API
curl http://localhost:8080/guides?featured_hero=true&limit=1

# Check backend health
curl http://localhost:8080/health

# Check database connection
cd backend
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM guides;"
```

### Expected Flow

When everything works:

1. **Admin:** Click star icon on guide
2. **Backend:** Sets `featured_hero = true` in database
3. **Frontend:** Fetches guide via API
4. **Homepage:** Displays guide in hero section

### Quick Test

Create a test guide and verify:

```sql
INSERT INTO guides (slug, title, description, content, featured_hero, published_at, read_time, views)
VALUES (
  'test-guide-' || floor(random() * 1000),
  'Test Featured Guide',
  'This is a test to verify featured hero works',
  '# Test\n\nContent here',
  true,
  NOW(),
  '2 min read',
  0
);
```

Then refresh homepage and check console.

---

**Most Common Solution:** Hard refresh browser after setting featured hero! (Ctrl+Shift+R)
