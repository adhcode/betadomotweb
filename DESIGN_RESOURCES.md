# Design Resources Guide

## Beautiful Icons

### 1. **Lucide Icons** (Currently Using - FREE)
- Website: https://lucide.dev
- What we're using now in the code
- 1000+ beautiful, consistent icons
- React components ready to use
- Customizable size, color, stroke width
- **Already installed in your project!**

Example usage:
```tsx
import { Sparkles, Home, Shield } from 'lucide-react';
<Sparkles className="w-6 h-6" style={{ color: '#4F46E5' }} />
```

### 2. **Heroicons** (FREE)
- Website: https://heroicons.com
- By Tailwind CSS team
- Beautiful, hand-crafted icons
- Solid and outline variants
- Install: `npm install @heroicons/react`

### 3. **Phosphor Icons** (FREE)
- Website: https://phosphoricons.com
- 6 weights (thin to bold)
- Duotone variants available
- Very modern and clean
- Install: `npm install phosphor-react`

### 4. **Feather Icons** (FREE)
- Website: https://feathericons.com
- Simple, beautiful icons
- Consistent 24x24 grid
- Install: `npm install react-feather`

### 5. **Iconoir** (FREE)
- Website: https://iconoir.com
- Largest open-source icon library
- Very elegant and modern
- Install: `npm install iconoir-react`

### 6. **Tabler Icons** (FREE)
- Website: https://tabler-icons.io
- 4000+ icons
- Stroke-based design
- Install: `npm install @tabler/icons-react`

## High-Quality Free Images

### 1. **Unsplash** (FREE - Best Quality)
- Website: https://unsplash.com
- Highest quality free photos
- No attribution required (but appreciated)
- API available for dynamic loading
- **Best for:** Hero images, lifestyle shots

Search terms for your categories:
- Cleaning: "clean home", "organized kitchen", "minimalist interior"
- Organization: "organized closet", "storage solutions", "tidy room"
- Decorating: "home decor", "interior design", "cozy living room"
- Energy: "solar panels", "LED lights", "sustainable home"

### 2. **Pexels** (FREE)
- Website: https://pexels.com
- High-quality stock photos and videos
- No attribution required
- Easy to use API
- **Best for:** Lifestyle and home photos

### 3. **Pixabay** (FREE)
- Website: https://pixabay.com
- 2.7 million+ images
- No attribution required
- Includes illustrations and vectors
- **Best for:** Variety and illustrations

### 4. **Burst by Shopify** (FREE)
- Website: https://burst.shopify.com
- Business-focused images
- High resolution
- **Best for:** Product and lifestyle shots

### 5. **Freepik** (FREE + Premium)
- Website: https://freepik.com
- Photos, vectors, PSD files
- Free with attribution
- **Best for:** Illustrations and graphics

## Recommended Images for Your Categories

### Cleaning Category
```
Unsplash searches:
- "clean kitchen counter"
- "organized cleaning supplies"
- "fresh white interior"
- "minimalist bathroom"

Suggested images:
- https://unsplash.com/s/photos/clean-home
- https://unsplash.com/s/photos/organized-kitchen
```

### Organization Category
```
Unsplash searches:
- "organized closet"
- "storage baskets"
- "tidy workspace"
- "minimalist shelves"

Suggested images:
- https://unsplash.com/s/photos/home-organization
- https://unsplash.com/s/photos/storage-solutions
```

### Decorating Category
```
Unsplash searches:
- "cozy living room"
- "modern interior design"
- "home decor"
- "stylish bedroom"

Suggested images:
- https://unsplash.com/s/photos/interior-design
- https://unsplash.com/s/photos/home-decor
```

### Energy Savings Category
```
Unsplash searches:
- "solar panels home"
- "LED light bulbs"
- "sustainable living"
- "green energy"

Suggested images:
- https://unsplash.com/s/photos/solar-energy
- https://unsplash.com/s/photos/sustainable-home
```

### Security & Safety Category
```
Unsplash searches:
- "home security camera"
- "smart lock"
- "safe home"
- "security system"

Suggested images:
- https://unsplash.com/s/photos/home-security
- https://unsplash.com/s/photos/smart-home-security
```

### Smart & Tech Category
```
Unsplash searches:
- "smart home device"
- "home automation"
- "modern technology"
- "smart speaker"

Suggested images:
- https://unsplash.com/s/photos/smart-home
- https://unsplash.com/s/photos/home-technology
```

### Home Projects Category
```
Unsplash searches:
- "DIY home project"
- "home renovation"
- "painting walls"
- "woodworking"

Suggested images:
- https://unsplash.com/s/photos/home-improvement
- https://unsplash.com/s/photos/diy-project
```

### Life Category
```
Unsplash searches:
- "cozy home lifestyle"
- "family at home"
- "relaxing at home"
- "home wellness"

Suggested images:
- https://unsplash.com/s/photos/home-lifestyle
- https://unsplash.com/s/photos/cozy-home
```

## How to Download and Use Images

### Step 1: Download from Unsplash
1. Go to https://unsplash.com
2. Search for your category (e.g., "clean home")
3. Click on an image you like
4. Click "Download free" button
5. Image downloads in high resolution

### Step 2: Optimize Images
Before using, optimize them:

**Online Tools (FREE):**
- TinyPNG: https://tinypng.com (Best for PNG/JPG)
- Squoosh: https://squoosh.app (Google's tool)
- Compressor.io: https://compressor.io

**Recommended sizes:**
- Hero images: 1920x1080px (landscape)
- Category cards: 800x600px
- Blog thumbnails: 600x400px

### Step 3: Add to Your Project
```bash
# Save images in:
frontend/public/images/categories/

# File naming:
cleaning-hero.jpg
organization-hero.jpg
decorating-hero.jpg
energy-hero.jpg
security-hero.jpg
tech-hero.jpg
projects-hero.jpg
life-hero.jpg
```

## Using Unsplash API (Dynamic Images)

For dynamic loading without downloading:

```bash
npm install unsplash-js
```

```tsx
// Example usage
const imageUrl = `https://source.unsplash.com/1920x1080/?clean-home`;
```

## Icon Customization Examples

```tsx
// Different sizes
<Sparkles className="w-4 h-4" />  // Small
<Sparkles className="w-6 h-6" />  // Medium
<Sparkles className="w-12 h-12" /> // Large

// Custom colors
<Sparkles style={{ color: '#4F46E5' }} />
<Sparkles className="text-blue-500" />

// With stroke width
<Sparkles strokeWidth={1.5} />
<Sparkles strokeWidth={2.5} />
```

## Color Palette for Categories

Already configured in your code:
- Cleaning: `#4F46E5` (Indigo)
- Organization: `#EC4899` (Pink)
- Life: `#10B981` (Emerald)
- Decorating: `#F59E0B` (Amber)
- Energy Savings: `#14B8A6` (Teal)
- Security & Safety: `#EF4444` (Red)
- Smart & Tech: `#8B5CF6` (Violet)
- Home Projects: `#F97316` (Orange)

## Quick Start Checklist

- [ ] Download 8 hero images from Unsplash (one per category)
- [ ] Optimize images using TinyPNG
- [ ] Save to `frontend/public/images/categories/`
- [ ] Icons are already set up (Lucide)
- [ ] Test category pages
- [ ] Adjust colors if needed

## Pro Tips

1. **Consistency**: Use images with similar lighting and style
2. **Quality**: Always use high-resolution images (at least 1920px wide)
3. **Optimization**: Compress images to keep page load fast
4. **Attribution**: While not required, credit photographers when possible
5. **Variety**: Mix lifestyle shots with close-ups for visual interest

## Need Help?

If you need specific images or can't find what you're looking for:
1. Try different search terms
2. Browse Unsplash collections
3. Check Pexels as alternative
4. Use AI image generators (Midjourney, DALL-E) for unique visuals
