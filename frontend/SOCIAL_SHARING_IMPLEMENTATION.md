# Social Sharing Implementation Guide

## Problem
When sharing blog post links on social media platforms (WhatsApp, Facebook, Twitter, etc.), the preview was showing the default site metadata instead of the specific post's title, description, and featured image.

## Solution
Implemented dynamic Open Graph (OG) meta tags using Next.js 13+ App Router's `generateMetadata` function.

## What Was Changed

### 1. Blog Post Page Structure (`frontend/app/blog/[slug]/page.tsx`)
- **Converted to Server Component**: The page is now a server component that fetches data and generates metadata on the server
- **Added `generateMetadata` function**: This async function generates post-specific metadata for social sharing
- **Separated Client Logic**: All client-side interactivity moved to `BlogPostClient` component

### 2. Metadata Generated
For each blog post, the following metadata is now dynamically generated:

```typescript
{
  title: `${post.title} | BetaDomot`,
  description: post.excerpt || post.content.substring(0, 160),
  keywords: post.tags?.join(', '),
  openGraph: {
    type: 'article',
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    url: `https://betadomot.blog/blog/${post.slug}`,
    siteName: 'BetaDomot',
    images: [{
      url: post.featured_image,
      width: 1200,
      height: 630,
      alt: post.title,
    }],
    publishedTime: post.published_at,
    authors: ['BetaDomot'],
    tags: post.tags,
  },
  twitter: {
    card: 'summary_large_image',
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    images: [post.featured_image],
    creator: '@betadomot',
  },
}
```

## How It Works

1. **Server-Side Rendering**: When a social media crawler (or user) visits a blog post URL, Next.js runs the `generateMetadata` function on the server
2. **Data Fetching**: The function fetches the post data using the slug from the URL
3. **Meta Tag Generation**: Next.js automatically injects the returned metadata into the page's `<head>` as meta tags
4. **Social Media Crawlers**: Platforms like Facebook, Twitter, WhatsApp read these meta tags to generate link previews

## Testing Social Sharing

### 1. Facebook Debugger
- Visit: https://developers.facebook.com/tools/debug/
- Enter your post URL: `https://betadomot.blog/blog/your-post-slug`
- Click "Scrape Again" to refresh the cache
- Verify the title, description, and image appear correctly

### 2. Twitter Card Validator
- Visit: https://cards-dev.twitter.com/validator
- Enter your post URL
- Verify the card preview shows correct information

### 3. WhatsApp
- Send the link to yourself or a test contact
- The preview should show the post's featured image, title, and excerpt

### 4. LinkedIn Post Inspector
- Visit: https://www.linkedin.com/post-inspector/
- Enter your post URL
- Verify the preview

## Important Notes

### Image Requirements
- **Size**: 1200x630px is optimal for most platforms
- **Format**: JPG or PNG
- **File Size**: Keep under 8MB for best performance
- **Absolute URLs**: Images must be accessible via full URLs (not relative paths)

### Caching
Social media platforms cache link previews. If you update a post:
1. Use the platform's debugging tool to refresh the cache
2. Facebook caches for ~7 days
3. Twitter caches for ~7 days
4. WhatsApp caches indefinitely (use Facebook debugger to clear)

### Fallbacks
If a post doesn't have:
- **Featured Image**: Falls back to `/images/og-default.jpg`
- **Excerpt**: Uses first 160 characters of content
- **Tags**: Omitted from metadata

## File Structure

```
frontend/
├── app/
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx          # Server component with generateMetadata
│   └── layout.tsx                 # Root layout with default metadata
├── components/
│   └── BlogPostClient.tsx         # Client component for interactivity
└── lib/
    └── api-client.ts              # API functions (works on server & client)
```

## Future Enhancements

1. **Author Information**: Add author profiles and include in metadata
2. **Article Schema**: Add JSON-LD structured data for better SEO
3. **Multiple Images**: Support image galleries in OG tags
4. **Video Support**: Add OG video tags for video content
5. **Localization**: Support multiple languages in metadata

## Troubleshooting

### Preview Not Updating
- Clear the platform's cache using their debugging tools
- Verify the image URL is accessible (not behind authentication)
- Check that the image meets size requirements

### Image Not Showing
- Ensure `featured_image` field is populated in the database
- Verify the image URL is absolute (starts with http:// or https://)
- Check image file size (should be < 8MB)
- Confirm image is publicly accessible

### Wrong Information Showing
- Check if the post data is being fetched correctly
- Verify the `generateMetadata` function is returning the expected data
- Clear browser cache and test in incognito mode
