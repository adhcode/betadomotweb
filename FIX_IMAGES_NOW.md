# Fix Social Sharing Images - Action Plan

## ✅ What I Just Did

Updated the code to handle image URLs better:
- Better path handling (relative, absolute, full URLs)
- Added explicit image type
- Added logging to help debug

## 🚀 Next Steps

### 1. Deploy the Fix
```bash
git add .
git commit -m "Fix: Improve social sharing image URL handling"
git push origin main
```

### 2. Wait for Deployment
- Check your hosting dashboard
- Wait 2-5 minutes for build to complete

### 3. Test Again
Go to: https://developers.facebook.com/tools/debug/
- Enter your post URL
- Click "Scrape Again"
- Check if image shows now

## 🔍 If Images Still Don't Show

### Quick Diagnostic:

**In Facebook debugger, find the `og:image` line. What does it say?**

#### Option A: Shows a URL
```
og:image: https://betadomot.blog/images/some-post.jpg
```
**Action**: Copy that URL, paste in browser. Does image load?
- **YES** → Just need to clear Facebook cache (click "Scrape Again")
- **NO** → Image doesn't exist at that path

#### Option B: Shows wrong domain
```
og:image: http://localhost:3000/images/post.jpg
```
**Action**: Environment variable issue. Check your production env vars.

#### Option C: Shows relative path
```
og:image: /images/post.jpg
```
**Action**: Missing base URL. The fix should handle this now.

## 📊 Check Your Database

**What format are your images stored in?**

Open your database and check a few posts:

```sql
SELECT slug, featured_image FROM posts WHERE featured_image IS NOT NULL LIMIT 5;
```

**Tell me what you see:**
- `https://...` (full URL) ✅
- `/images/...` (absolute path) ✅
- `images/...` (relative path) ✅
- `post-images/abc.jpg` (storage path) ⚠️ Might need special handling
- Empty/null ⚠️ Will use fallback image

## 🎯 Most Likely Scenarios

### Scenario 1: Images in Supabase Storage
If your `featured_image` looks like: `post-images/abc123.jpg`

You need to construct the full Supabase URL. Let me know and I'll give you the exact code.

### Scenario 2: Images in Public Folder
If your `featured_image` is: `/images/post.jpg`

The fix should handle this now. Just deploy and test.

### Scenario 3: External CDN
If your `featured_image` is: `https://cdn.example.com/image.jpg`

Should work as-is. Check if CDN allows social media crawlers.

### Scenario 4: No Featured Images Set
If posts don't have `featured_image` set:

Will use fallback: `https://betadomot.blog/images/og-default.jpg`

Make sure this file exists!

## 🛠️ Quick Fixes to Try

### Fix 1: Check Fallback Image Exists
```bash
# Make sure this file exists:
frontend/public/images/og-default.jpg
```

If it doesn't exist, create one or use a different path.

### Fix 2: Test One Post Manually
Pick one post and manually set a known good image URL:

```sql
UPDATE posts 
SET featured_image = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=630'
WHERE slug = 'your-test-post-slug';
```

Then test that post in Facebook debugger. If it works, the issue is with your image paths.

### Fix 3: Check Image Accessibility
Try accessing your image directly:
```
https://betadomot.blog/images/your-image.jpg
```

Does it load? If not:
- Image might not be in the right folder
- Permissions might be wrong
- Path might be case-sensitive

## 📞 What to Share With Me

To help you further, please share:

1. **From Facebook Debugger:**
   - What does `og:image` show?
   - Screenshot if possible

2. **From Your Database:**
   - Example of how `featured_image` is stored
   - Example: `/images/post.jpg` or `https://...` or `post-images/abc.jpg`

3. **From Browser Test:**
   - Copy the og:image URL
   - Paste in browser
   - Does it load? (Yes/No)

4. **Your Setup:**
   - Where are images stored? (Supabase, Cloudinary, public folder, etc.)
   - Hosting platform? (Vercel, Netlify, Railway, etc.)

With this info, I can give you the exact fix! 🎯
