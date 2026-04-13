# Lifestyle Categories System

## Overview

Lifestyle Categories are curated collections of products that represent a point of view about modern living. Unlike traditional product categories, they are editorial in nature and focus on ideas rather than inventory.

## Design Philosophy

- **Editorial, not commercial**: Categories tell a story
- **Calm and intentional**: No prices, no urgency, no sales tactics
- **Future-proof**: Easy to add new categories without changing homepage structure
- **Minimal and refined**: Smaller product previews, generous spacing

## How It Works

### 1. Configuration File

All lifestyle categories are defined in `shop/lib/lifestyle-categories.ts`:

```typescript
{
  id: 'ikea-selected',
  title: 'From IKEA, selected by Betadomot',
  description: 'Trusted everyday pieces chosen for real homes',
  filter: {
    tags: ['ikea'],
  },
  viewAllLink: '/collections/ikea-selected',
  order: 1,
}
```

### 2. Component

The `LifestyleCategory` component (`shop/components/LifestyleCategory.tsx`) renders each category section:

- Category title and description
- 4-product preview grid (max)
- Smaller images than main product grid
- No prices or CTAs
- Optional "View all" link

### 3. Homepage Integration

The homepage (`shop/app/page.tsx`) automatically renders all active lifestyle categories:

```typescript
{sortedCategories.map((category) => {
  const categoryProducts = filterProductsByCategory(products, category.filter);
  
  if (categoryProducts.length === 0) return null;

  return (
    <LifestyleCategory
      key={category.id}
      title={category.title}
      description={category.description}
      products={categoryProducts}
      viewAllLink={category.viewAllLink}
    />
  );
})}
```

## Adding a New Lifestyle Category

### Step 1: Define the Category

Edit `shop/lib/lifestyle-categories.ts` and add a new entry:

```typescript
{
  id: 'sustainable-living',
  title: 'For sustainable living',
  description: 'Thoughtfully made, built to last',
  filter: {
    tags: ['sustainable', 'eco-friendly', 'recycled'],
  },
  viewAllLink: '/collections/sustainable-living',
  order: 5,
}
```

### Step 2: Tag Your Products

In your Supabase database, add the appropriate tags to products:

```sql
UPDATE products 
SET tags = ARRAY['sustainable', 'minimal']
WHERE slug = 'bamboo-desk-organizer';
```

### Step 3: Create Collection Page (Optional)

If you want a dedicated page for the category, create:
`shop/app/collections/[slug]/page.tsx`

That's it! The category will automatically appear on the homepage.

## Filter Options

Categories can filter products by:

### Tags (Recommended)
```typescript
filter: {
  tags: ['ikea', 'scandinavian'],
}
```

### Category
```typescript
filter: {
  category: 'Furniture',
}
```

### Collection
```typescript
filter: {
  collection: 'summer-2024',
}
```

### Featured Status
```typescript
filter: {
  featured: true,
}
```

### Multiple Criteria
```typescript
filter: {
  tags: ['minimal'],
  category: 'Furniture',
  featured: true,
}
```

## Example Lifestyle Categories

### 1. From IKEA, selected by Betadomot
**Concept**: Curated selection from a trusted brand
**Filter**: `tags: ['ikea']`
**Tone**: Practical, accessible, everyday

### 2. For minimal living
**Concept**: Less, but better
**Filter**: `tags: ['minimalist', 'minimal']`
**Tone**: Refined, intentional, calm

### 3. Work from home essentials
**Concept**: Thoughtful tools for focused work
**Filter**: `tags: ['workspace', 'desk', 'office']`
**Tone**: Productive, organized, professional

### 4. For calm spaces
**Concept**: Objects that bring quiet to your home
**Filter**: `tags: ['calm', 'peaceful', 'serene']`
**Tone**: Meditative, soft, restful

### 5. Weekend projects
**Concept**: Small improvements for your space
**Filter**: `tags: ['diy', 'upgrade', 'improvement']`
**Tone**: Hands-on, creative, achievable

### 6. From local makers
**Concept**: Supporting Nigerian craftsmanship
**Filter**: `tags: ['local', 'nigerian', 'handmade']`
**Tone**: Authentic, artisanal, community

## Design Specifications

### Product Preview Cards

- **Image size**: Square aspect ratio
- **Grid**: 2 columns mobile, 4 columns desktop
- **Spacing**: 8-12 gap units
- **Text**: Product name only (no price, no description)
- **Hover**: Subtle scale effect (1.05)
- **Typography**: Small (text-sm), light weight

### Category Header

- **Title**: Large (text-3xl to text-4xl), light weight
- **Description**: Optional, base size, gray-600
- **Spacing**: 16 units margin bottom
- **Max width**: 3xl for readability

### Section Spacing

- **Vertical padding**: py-24 to py-32
- **Between categories**: Border-top separator
- **Max width**: 7xl container

## Best Practices

### 1. Keep Categories Focused
Each category should have a clear point of view. Avoid generic titles like "Popular Products" or "Best Sellers."

### 2. Use Descriptive Tags
Tag products thoughtfully so they appear in relevant categories:
- ✅ `['minimal', 'scandinavian', 'wood']`
- ❌ `['product', 'new', 'sale']`

### 3. Limit Number of Categories
Show 3-5 lifestyle categories on the homepage. Too many dilutes the editorial impact.

### 4. Update Seasonally
Rotate categories based on seasons, trends, or editorial themes:
- Spring: "For outdoor living"
- Winter: "For cozy evenings"
- Back to school: "For focused study"

### 5. Tell a Story
Use the description field to add context and personality:
- ✅ "Trusted everyday pieces chosen for real homes"
- ❌ "IKEA products available now"

## Technical Notes

### Performance
- Categories only render if they have products
- Products are filtered on the server side
- Images use Next.js Image optimization

### Flexibility
- Add/remove categories without code changes
- Change order by updating the `order` field
- Filter logic is centralized in one file

### Future Enhancements
- Admin UI for managing categories
- Dynamic category images
- Category-specific sorting
- Seasonal category rotation
- Analytics per category

## Maintenance

### Adding Products to Categories
Simply tag products appropriately in the database. They'll automatically appear in matching categories.

### Removing a Category
Set `order: 999` or remove from the array in `lifestyle-categories.ts`.

### Reordering Categories
Change the `order` field. Lower numbers appear first.

### Testing
Visit the homepage and verify:
- Categories appear in correct order
- Products match filter criteria
- "View all" links work
- No prices or CTAs visible
- Spacing and typography are consistent

---

**Status**: Lifestyle Categories system is production-ready and extensible.
