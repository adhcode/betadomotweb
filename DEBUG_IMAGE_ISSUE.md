# Debugging Social Sharing Image Issue

## ✅ What's Working
- Title shows correctly
- Description shows correctly

## ❌ What's Not Working
- Images not showing in social preview

## 🔍 Common Causes & Solutions

### 1. Check the Image URL in Facebook Debugger

When you test in Facebook debugger, look for the `og:image` tag. What does it show?

**Possible scenarios:**

#### Scenario A: Relative Path
```html
<meta property="og:image" content="/images/post.jpg" />
```
**Problem**: Missing the domain
**Solution**: See Fix #1 below

#### Scenario B: Wrong Domain
```html
<meta property="og:image" content="http://localhost:3000/images/post.jpg" />
```
**Problem**: Using localhost instead of production URL
**Solution**: See Fix #2 below

#### Scenario C: Image Not Accessible
```html
<meta property="og:image" content="https://betadomot.blog/images/post.jpg" />
```
**Problem**: Image URL returns 404 or requires authentication
**Solution**: See Fix #3 below

---

## 🔧 Fixes

### Fix #1: Ensure Absolute URLs

The code should already handle this, but let's verify:

```typescript
// Current code in blog/[slug]/page.tsx
const imageUrl = post.featured_image 
    ? (post.featured_image.startsWith('http') 
        ? post.featured_image 
        : `${baseUrl}${post.featured_image}`)
    : `${baseUrl}/images/og-default.jpg`;
```

**Check**: Does `post.featured_image` start with `/`?
- If YES: Code will prepend `https://betadomot.blog`
- If NO: Code assumes it's already a full URL

### Fix #2: Verify Production URL

Check your environment:
```bash
# What's your actual production URL?
# Is it betadomot.blog or www.betadomot.blog?
```

If it's `www.betadomot.blog`, update the code:
```typescript
const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://www.betadomot.blog'  // Add www if needed
    : 'http://localhost:3000';
```

### Fix #3: Check Image Accessibility

Test if the image URL is publicly accessible:

1. Copy the image URL from Facebook debugger
2. Paste it in a new browser tab
3. Does the image load?

**If NO:**
- Image might be behind authentication
- Image might not exist
- CORS might be blocking it

### Fix #4: Add Image Dimensions

Some platforms require explicit dimensions:

```typescript
openGraph: {
    images: [
        {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
            type: 'image/jpeg', // Add this
        },
    ],
}
```

### Fix #5: Check Image Format

Facebook requires:
- Format: JPG, PNG, or GIF
- Size: At least 200x200px
- Max file size: 8MB
- Aspect ratio: 1.91:1 is optimal (1200x630)

---

## 🧪 Quick Test Commands

### Test 1: Check what Facebook sees
```bash
# In Facebook debugger, look for these tags:
og:image
og:image:secure_url
og:image:width
og:image:height
```

### Test 2: Verify image URL directly
```bash
# Copy the og:image URL from debugger
# Paste in browser
# Does it load?
```

### Test 3: Check your database
```bash
# What does your post.featured_image field contain?
# Examples:
# ✅ Good: "https://example.com/image.jpg"
# ✅ Good: "/images/post.jpg"
# ❌ Bad: "images/post.jpg" (missing leading /)
# ❌ Bad: "../images/post.jpg" (relative path)
```

---

## 🎯 Most Likely Issues

Based on common problems:

### Issue 1: Image stored in Supabase/External Storage
If your images are in Supabase storage:
```typescript
// The featured_image might be a storage path like:
// "post-images/abc123.jpg"

// You need to construct the full Supabase URL:
const imageUrl = post.featured_image
    ? (post.featured_image.startsWith('http')
        ? post.featured_image
        : `https://your-project.supabase.co/storage/v1/object/public/images/${post.featured_image}`)
    : `${baseUrl}/images/og-default.jpg`;
```

### Issue 2: Next.js Image Optimization
If using Next.js Image component, the src might be optimized:
```typescript
// Original: /images/post.jpg
// Optimized: /_next/image?url=/images/post.jpg&w=1200&q=75

// For OG tags, use the original URL, not the optimized one
```

### Issue 3: Missing Protocol
```typescript
// If featured_image is: "//cdn.example.com/image.jpg"
// Add protocol:
const imageUrl = post.featured_image
    ? (post.featured_image.startsWith('http')
        ? post.featured_image
        : post.featured_image.startsWith('//')
            ? `https:${post.featured_image}`
            : `${baseUrl}${post.featured_image}`)
    : `${baseUrl}/images/og-default.jpg`;
```

---

## 📋 Debugging Checklist

Run through this checklist:

1. [ ] Open Facebook debugger with your post URL
2. [ ] Find the `og:image` tag in the output
3. [ ] Copy the image URL
4. [ ] Paste URL in new browser tab - does it load?
5. [ ] Check if URL starts with `https://`
6. [ ] Check if URL points to correct domain
7. [ ] Verify image file exists and is accessible
8. [ ] Check image file size (should be < 8MB)
9. [ ] Verify image dimensions (at least 200x200px)
10. [ ] Check image format (JPG, PNG, or GIF)

---

## 🚀 Quick Fix to Try Now

Add this improved version with better logging:

```typescript
// In blog/[slug]/page.tsx - generateMetadata function

const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://betadomot.blog'
    : 'http://localhost:3000';

// Log for debugging
console.log('Post featured_image:', post.featured_image);

let imageUrl;
if (!post.featured_image) {
    imageUrl = `${baseUrl}/images/og-default.jpg`;
} else if (post.featured_image.startsWith('http://') || post.featured_image.startsWith('https://')) {
    imageUrl = post.featured_image;
} else if (post.featured_image.startsWith('/')) {
    imageUrl = `${baseUrl}${post.featured_image}`;
} else {
    // Assume it's a relative path, add leading slash
    imageUrl = `${baseUrl}/${post.featured_image}`;
}

console.log('Final imageUrl:', imageUrl);
```

---

## 📞 Next Steps

**Please share:**
1. What does the `og:image` URL show in Facebook debugger?
2. When you paste that URL in a browser, does the image load?
3. What format is your `post.featured_image` stored in the database?

This will help me give you the exact fix you need!
