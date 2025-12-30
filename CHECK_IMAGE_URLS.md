# Quick Image URL Diagnostic

## What I Just Fixed

1. **Better URL handling** - Now handles all image path formats:
   - Full URLs: `https://example.com/image.jpg` ✅
   - Absolute paths: `/images/post.jpg` ✅
   - Relative paths: `images/post.jpg` ✅

2. **Added image type** - Explicitly set `type: 'image/jpeg'` for better compatibility

3. **Added logging** - Server logs will show the constructed image URLs

## How to Check What's Wrong

### Step 1: Check Facebook Debugger Output

Go to: https://developers.facebook.com/tools/debug/

Enter your post URL and look for these lines:

```
og:image: [WHAT URL SHOWS HERE?]
og:image:secure_url: [WHAT URL SHOWS HERE?]
```

**Copy that URL and test it:**

### Step 2: Test the Image URL Directly

1. Copy the `og:image` URL from Facebook debugger
2. Paste it in a new browser tab
3. Does the image load?

**If YES** → The image is accessible, Facebook just needs to refresh cache
**If NO** → The image URL is wrong or image doesn't exist

### Step 3: Check Your Database

What format is your `featured_image` stored in?

Run this query or check in your admin panel:
```sql
SELECT slug, featured_image FROM posts LIMIT 5;
```

**Common formats:**

| Format | Example | Will Work? |
|--------|---------|------------|
| Full URL | `https://cdn.example.com/img.jpg` | ✅ Yes |
| Absolute path | `/images/post.jpg` | ✅ Yes (after fix) |
| Relative path | `images/post.jpg` | ✅ Yes (after fix) |
| Supabase storage | `post-images/abc.jpg` | ❌ Needs special handling |
| Empty/null | `null` | ✅ Uses fallback |

### Step 4: Check Server Logs

After deploying the fix, check your server logs for lines like:
```
🖼️ OG Image URL for my-post-slug : https://betadomot.blog/images/post.jpg
```

This will show you exactly what URL is being generated.

## Common Issues & Solutions

### Issue 1: Image Returns 404
**Symptom**: URL looks correct but image doesn't load
**Solution**: 
- Check if image file actually exists at that path
- Verify file permissions (should be publicly readable)
- Check if path is case-sensitive

### Issue 2: Images in Supabase Storage
**Symptom**: `featured_image` is like `post-images/abc123.jpg`
**Solution**: Need to construct full Supabase URL

```typescript
// Add this to your metadata generation:
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_BUCKET = 'images';

let imageUrl;
if (!guide.featured_image) {
    imageUrl = `${baseUrl}/images/og-default.jpg`;
} else if (guide.featured_image.startsWith('http')) {
    imageUrl = guide.featured_image;
} else if (guide.featured_image.includes('supabase') || guide.featured_image.includes('storage')) {
    // Already a Supabase URL
    imageUrl = guide.featured_image;
} else {
    // Assume it's a storage path, construct full URL
    imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${guide.featured_image}`;
}
```

### Issue 3: Images Behind CDN/Proxy
**Symptom**: Images load on site but not in social preview
**Solution**: 
- Check CDN CORS settings
- Verify CDN allows social media crawlers
- Try using direct URL instead of CDN URL

### Issue 4: Wrong Image Format
**Symptom**: Image loads but social preview shows broken image
**Solution**:
- Convert to JPG or PNG
- Ensure image is at least 200x200px
- Keep file size under 8MB

## Quick Test After Deploying Fix

1. **Deploy the changes**
   ```bash
   git add .
   git commit -m "Fix: Improve OG image URL handling"
   git push origin main
   ```

2. **Wait for deployment** (2-5 minutes)

3. **Test in Facebook debugger**
   - Enter your post URL
   - Click "Scrape Again"
   - Check if image appears now

4. **If still not working:**
   - Copy the `og:image` URL from debugger
   - Paste in browser - does it load?
   - Share the URL with me and I'll help debug further

## Need More Help?

Share with me:
1. ✅ The `og:image` URL from Facebook debugger
2. ✅ Whether that URL loads when you paste it in a browser
3. ✅ An example of how `featured_image` is stored in your database
4. ✅ Your hosting platform (Vercel, Netlify, Railway, etc.)

This will help me give you the exact fix you need!
