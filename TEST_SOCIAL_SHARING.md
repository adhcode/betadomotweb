# Testing Social Sharing - Quick Guide

## ✅ What Was Fixed
Social media link previews now show the correct title, description, and image for each blog post and guide instead of the generic site information.

## 🧪 How to Test

### 1. Test on Facebook/WhatsApp (Recommended)
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter a post URL: `https://betadomot.blog/blog/your-post-slug`
3. Click "Scrape Again"
4. Verify you see:
   - ✓ Post title (not "BetaDomot - Everything for a Better Home")
   - ✓ Post excerpt/description
   - ✓ Post featured image

5. Repeat for a guide URL: `https://betadomot.blog/guides/your-guide-slug`

### 2. Test on Twitter
1. Go to: https://cards-dev.twitter.com/validator
2. Enter your URL
3. Check the preview card

### 3. Real-World Test
1. Share a link in WhatsApp to yourself
2. The preview should show the specific content's image and title
3. Try both a blog post and a guide

## 📋 Checklist

Before sharing links publicly, verify:
- [ ] Blog posts show correct title, description, and image
- [ ] Guides show correct title, description, and image
- [ ] Images are loading (not broken)
- [ ] Descriptions are meaningful (not just "undefined" or empty)
- [ ] URLs are correct

## 🔧 Troubleshooting

### Preview shows old/wrong information
**Solution**: Use Facebook debugger to clear cache
1. Go to https://developers.facebook.com/tools/debug/
2. Enter your URL
3. Click "Scrape Again"

### Image not showing
**Possible causes**:
- Featured image not set in the database
- Image URL is relative (should be absolute)
- Image file is too large (>8MB)
- Image is not publicly accessible

**Solution**: 
1. Check the post/guide has a `featured_image` field
2. Verify the image URL starts with `http://` or `https://`
3. Test the image URL directly in a browser

### Description is empty or shows "undefined"
**Possible causes**:
- Post has no `excerpt` field
- Guide has no `description` field
- Content field is empty

**Solution**: Add an excerpt/description to the content in the admin panel

## 📱 Platform-Specific Notes

### WhatsApp
- Uses Facebook's Open Graph cache
- Cache lasts indefinitely
- Use Facebook debugger to refresh

### Facebook
- Caches for ~7 days
- Use debugger tool to force refresh
- Requires absolute image URLs

### Twitter
- Caches for ~7 days
- Prefers 1200x630px images
- Falls back to summary card if image fails

### LinkedIn
- Has its own cache
- Use Post Inspector to test: https://www.linkedin.com/post-inspector/
- Requires absolute URLs

## 🎯 Best Practices

1. **Always set featured images** - They make links much more clickable
2. **Write compelling excerpts** - First impression matters
3. **Use 1200x630px images** - Optimal for all platforms
4. **Test before sharing** - Use debugger tools first
5. **Keep file sizes reasonable** - Under 1MB for faster loading

## 🚀 Quick Commands

Test a specific post:
```bash
# In browser, go to:
https://developers.facebook.com/tools/debug/?q=https://betadomot.blog/blog/YOUR-SLUG
```

Test a specific guide:
```bash
# In browser, go to:
https://developers.facebook.com/tools/debug/?q=https://betadomot.blog/guides/YOUR-SLUG
```

## ✨ What's Next?

Once you've verified everything works:
1. Share your best content on social media
2. Monitor engagement to see which previews perform best
3. Consider creating custom OG images for top-performing content
4. Update old posts/guides with better featured images if needed

---

**Questions?** Check `SOCIAL_SHARING_IMPLEMENTATION.md` for technical details or `SOCIAL_SHARING_SUMMARY.md` for a quick overview.
