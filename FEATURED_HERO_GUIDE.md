# Featured Hero Implementation Guide

## Overview
The Featured Hero is a prominent content display at the top of the homepage that can showcase either a blog post or a guide. It's designed to be the first thing visitors see, with optimized loading performance and a soft, subtle design aesthetic.

## Features

### 1. **Dual Content Support**
- Can feature either a **blog post** or a **guide**
- Only one item can be featured at a time
- Automatically unsets previous featured content when setting a new one

### 2. **Performance Optimized**
- **Skeleton loader** displays immediately while content loads
- Backend built with **Go** for fast API responses
- Client-side caching for improved performance
- Optimized image loading with proper aspect ratios

### 3. **Design Philosophy**
- **Soft and subtle** aesthetic
- Light font weights (font-light)
- Gentle colors (grays instead of bold colors)
- Smooth transitions and hover effects
- Full-width image with 21:9 aspect ratio
- Minimal shadows and rounded corners

## Database Schema

### Posts Table
```sql
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS featured_hero BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_posts_featured_hero 
ON posts(featured_hero) WHERE featured_hero = true;
```

### Guides Table
```sql
ALTER TABLE guides 
ADD COLUMN IF NOT EXISTS featured_hero BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_guides_featured_hero 
ON guides(featured_hero) WHERE featured_hero = true;
```

## API Endpoints

### Posts
- `POST /admin/posts/{slug}/featured-hero` - Set a post as featured hero
- `DELETE /admin/posts/{slug}/featured-hero` - Remove featured hero status

### Guides
- `POST /admin/guides/{slug}/featured-hero` - Set a guide as featured hero
- `DELETE /admin/guides/{slug}/featured-hero` - Remove featured hero status

### Public
- `GET /posts?featured_hero=true&limit=1` - Fetch featured post
- `GET /guides?featured_hero=true&limit=1` - Fetch featured guide

## Frontend Implementation

### Hero Component
Located at: `frontend/components/Hero.tsx`

**Features:**
- Skeleton loader during initial load
- Automatic fallback to default hero if no content is featured
- Responsive design (mobile and desktop)
- Soft, subtle styling with light fonts
- Full-width image display (21:9 aspect ratio)
- Smooth hover effects

**Loading States:**
1. **Loading**: Shows skeleton loader
2. **Featured Content**: Displays post or guide
3. **Fallback**: Shows default hero message

### API Client
Located at: `frontend/lib/api-client.ts`

**Function:** `fetchFeaturedHeroPost()`
- Checks posts first, then guides
- Returns unified format for both content types
- Maps guide `description` to `excerpt` for consistency
- Includes `type` field ('post' or 'guide') for routing

## Admin Management

### Posts Management
Located at: `frontend/app/admin/dashboard/posts/page.tsx`

**Features:**
- Star icon button to toggle featured hero status
- Visual indicator (yellow background) for featured posts
- One-click toggle functionality
- Automatic refresh after changes

### Dashboard Overview
Located at: `frontend/app/admin/dashboard/page.tsx`

**Features:**
- Featured Hero section with quick access
- Links to manage posts and guides
- Visual callout with instructions

## Usage Instructions

### For Administrators

#### Setting a Post as Featured Hero:
1. Go to Admin Dashboard → Posts
2. Find the post you want to feature
3. Click the star icon (⭐) next to the post
4. The post will be highlighted with a yellow background
5. Any previously featured content will be automatically unfeatured

#### Setting a Guide as Featured Hero:
1. Use the API endpoint: `POST /admin/guides/{slug}/featured-hero`
2. Or wait for the guides management UI (coming soon)

#### Removing Featured Hero:
1. Click the star icon again on the featured post
2. Or use the DELETE endpoint for the specific content

### For Developers

#### Running Migrations:
```bash
# For posts (if not already done)
cd backend
chmod +x run_featured_hero_migration.sh
./run_featured_hero_migration.sh

# For guides
chmod +x run_guides_featured_hero_migration.sh
./run_guides_featured_hero_migration.sh
```

#### Testing the Feature:
1. Set a post as featured hero via admin
2. Visit the homepage
3. Verify the hero section displays the featured content
4. Check loading states by throttling network in DevTools

## Design Specifications

### Colors
- Background: White (`#ffffff`)
- Text Primary: Gray-800 (`#1f2937`)
- Text Secondary: Gray-500 (`#6b7280`)
- Text Tertiary: Gray-400 (`#9ca3af`)
- Category Badge: Gray-100 background, Gray-600 text
- Button: Gray-900 background, White text

### Typography
- Title: 3xl-5xl, font-light, tracking-tight
- Excerpt: lg-xl, font-light, leading-relaxed
- Metadata: sm, font-light
- Category: xs, font-light, uppercase, tracking-wide

### Spacing
- Top padding: 80px (below fixed header)
- Bottom padding: 60px
- Image aspect ratio: 21:9
- Max content width: 6xl (1152px)
- Max text width: 4xl (896px)

### Interactions
- Image hover: Scale 1.02, duration 500ms
- Button hover: Darker background
- Shadow: Minimal (shadow-sm to shadow-md on hover)

## Performance Considerations

1. **Skeleton Loader**: Prevents layout shift and provides immediate feedback
2. **Image Optimization**: Use Next.js Image component where possible
3. **API Response Time**: Go backend ensures <100ms response times
4. **Caching**: Consider implementing Redis cache for featured content
5. **CDN**: Serve images from CDN for faster loading

## Future Enhancements

1. **Guides Admin UI**: Full management interface for guides
2. **Preview Mode**: Preview how content will look as featured hero
3. **Scheduling**: Schedule featured content changes
4. **Analytics**: Track engagement with featured content
5. **A/B Testing**: Test different featured content
6. **Image Optimization**: Automatic image resizing and optimization
7. **Video Support**: Allow video backgrounds for hero section

## Troubleshooting

### Featured content not showing:
1. Check if any content has `featured_hero = true` in database
2. Verify API endpoints are accessible
3. Check browser console for errors
4. Ensure migrations have been run

### Skeleton loader stuck:
1. Check API response time
2. Verify network connectivity
3. Check for JavaScript errors in console

### Multiple items featured:
1. This shouldn't happen due to backend logic
2. If it does, manually update database:
   ```sql
   UPDATE posts SET featured_hero = false;
   UPDATE guides SET featured_hero = false;
   -- Then set the correct one
   UPDATE posts SET featured_hero = true WHERE slug = 'your-slug';
   ```

## Support

For issues or questions:
1. Check this guide first
2. Review the code comments in Hero.tsx
3. Check the API client implementation
4. Review backend handlers in `handlers/posts.go` and `handlers/guides.go`
