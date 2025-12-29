# Quick Start - Featured Hero Setup

## ⚠️ Important: Run Migrations First!

Before the featured hero will work, you need to run the database migrations:

### Step 1: Add featured_hero column to guides table

```bash
cd backend

# Make the script executable
chmod +x run_guides_featured_hero_migration.sh

# Run the migration
./run_guides_featured_hero_migration.sh
```

### Step 2: Verify the migration

Check your Supabase dashboard or run:

```sql
-- Check if column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'guides' 
AND column_name = 'featured_hero';

-- Check if column exists in posts (should already be there)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'posts' 
AND column_name = 'featured_hero';
```

### Step 3: Test the API

```bash
# Test posts endpoint
curl http://localhost:8080/posts?featured_hero=true&limit=1

# Test guides endpoint
curl http://localhost:8080/guides?featured_hero=true&limit=1
```

## Setting Your First Featured Hero

### Option 1: Via Admin UI (Recommended)

1. Go to `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. Navigate to "Posts" from the dashboard
4. Click the ⭐ star icon next to any post
5. Visit the homepage to see it featured

### Option 2: Via API

```bash
# Set a post as featured hero
curl -X POST http://localhost:8080/admin/posts/your-post-slug/featured-hero \
  -H "Authorization: Basic $(echo -n 'admin:password' | base64)"

# Set a guide as featured hero
curl -X POST http://localhost:8080/admin/guides/your-guide-slug/featured-hero \
  -H "Authorization: Basic $(echo -n 'admin:password' | base64)"
```

### Option 3: Direct Database Update

```sql
-- Unset all featured heroes first
UPDATE posts SET featured_hero = false;
UPDATE guides SET featured_hero = false;

-- Set a specific post as featured
UPDATE posts SET featured_hero = true WHERE slug = 'your-post-slug';

-- OR set a specific guide as featured
UPDATE guides SET featured_hero = true WHERE slug = 'your-guide-slug';
```

## Troubleshooting

### Error: "column featured_hero does not exist"

**Solution:** Run the migration script (see Step 1 above)

### Error: 500 Internal Server Error

**Possible causes:**
1. Migration not run yet
2. Database connection issue
3. Backend not running

**Check:**
```bash
# Is backend running?
curl http://localhost:8080/health

# Check backend logs
cd backend
go run main.go
```

### Featured content not showing on homepage

**Check:**
1. Is any content actually set as featured?
   ```sql
   SELECT slug, title FROM posts WHERE featured_hero = true;
   SELECT slug, title FROM guides WHERE featured_hero = true;
   ```

2. Check browser console for errors (F12)

3. Check network tab - is the API call succeeding?

4. Try clearing browser cache and hard refresh (Ctrl+Shift+R)

### Skeleton loader stuck forever

**Possible causes:**
1. API not responding
2. CORS issue
3. Network error

**Check browser console for:**
- Failed to fetch errors
- CORS errors
- 404 or 500 errors

## Expected Behavior

1. **On page load:** Skeleton loader shows immediately
2. **After ~100-300ms:** Featured content loads and displays
3. **If no featured content:** Default hero message shows
4. **If API fails:** Default hero message shows (graceful fallback)

## Performance Tips

1. **Use production build for testing:**
   ```bash
   cd frontend
   npm run build
   npm start
   ```

2. **Check API response time:**
   ```bash
   time curl http://localhost:8080/posts?featured_hero=true&limit=1
   ```
   Should be < 100ms

3. **Enable caching** (future enhancement):
   - Add Redis cache for featured content
   - Cache for 5-10 minutes
   - Invalidate on update

## Next Steps

1. ✅ Run migrations
2. ✅ Set a post or guide as featured
3. ✅ Test on homepage
4. 📝 Create compelling featured content
5. 📊 Monitor engagement metrics
6. 🎨 Customize styling if needed

## Need Help?

Check these files:
- `FEATURED_HERO_GUIDE.md` - Complete documentation
- `frontend/components/Hero.tsx` - Frontend component
- `backend/handlers/posts.go` - Posts API
- `backend/handlers/guides.go` - Guides API
- `frontend/lib/api-client.ts` - API client
