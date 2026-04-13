# Betadomot Shop - Editorial Design System

## Design Philosophy

The shop has been redesigned to feel like a curated magazine feature rather than a typical e-commerce site. Every element prioritizes calm, intention, and editorial quality.

## Key Principles

### 1. Minimal & Thoughtful
- Generous white space
- Light typography (font-weight: 300-400)
- No urgency tactics or sales pressure
- Clean, uncluttered layouts

### 2. Editorial Voice
- Short, purposeful copy
- Focus on "why" not "what"
- Human, conversational tone
- No marketing jargon

### 3. Magazine-Quality Presentation
- Large, high-quality images
- Aspect ratios that feel editorial (3:4, 4:5)
- Slow, subtle animations
- Typography-first design

## Page Structure

### Product Page Sections

#### 1. Hero Section
- Full-width product image in real context
- Product name (large, light typography)
- One descriptive line (max 60 characters)
- Price and availability
- Single CTA: "Add to home"

#### 2. Why We Chose This
- One paragraph explaining the selection
- Focus on purpose and feeling
- No technical specs unless meaningful

#### 3. In Use
- 2-4 contextual images
- Products shown in real spaces
- Optional minimal captions

#### 4. What It's Good For
- 3-5 benefit-focused points
- Plain language, no features list
- Focus on experience, not specifications

#### 5. What to Know
- Only confirmed information
- Care guidance over specs
- Environment suitability
- Honest about missing details

#### 6. Delivery & Shipping
- Clear, calm explanation
- Nigeria-focused
- Packaging care mentioned
- No countdown timers

#### 7. How We'd Style It
- Styling suggestions
- Complementary items (subtle)
- No hard selling

#### 8. From the Journal
- Link to related blog content
- Editorial connection
- Magazine-style integration

## Typography Scale

```css
Hero Title: 4xl-7xl (48-72px) - font-light
Section Titles: 2xl (24px) - font-light
Body Text: base-lg (16-18px) - font-light
Captions: sm (14px) - font-light
```

## Color Palette

### Primary
- Gray 900: #111827 (Primary text, buttons)
- Gray 700: #374151 (Body text)
- Gray 600: #4B5563 (Secondary text)
- Gray 50: #F9FAFB (Backgrounds)

### Accent (Minimal Use)
- Teal: #236b7c (Only for interactive elements)
- Gold: #dca744 (Rare highlights)

## Spacing System

- Section padding: 16-24 (64-96px)
- Element spacing: 4-8 (16-32px)
- Generous margins between sections
- Breathing room around all elements

## Component Styles

### Buttons
```
Primary: bg-gray-900, minimal padding, uppercase tracking
Hover: Subtle color shift, no dramatic effects
Disabled: Gray-300, no opacity tricks
```

### Images
```
Aspect Ratios: 3:4 (portrait), 4:3 (landscape)
Hover: Slow scale (scale-105, 700ms)
Loading: Subtle gray gradient
```

### Links
```
Style: Underline on hover, subtle color shift
No icons unless necessary
Text-based navigation
```

## What We Avoid

❌ Star ratings and reviews
❌ Countdown timers
❌ "Limited stock" urgency
❌ Badges and labels (except minimal availability)
❌ Comparison tables
❌ Technical specification lists
❌ Multiple CTAs competing for attention
❌ Bright colors and high contrast
❌ Heavy shadows and borders
❌ Animated banners

## What We Embrace

✅ Generous white space
✅ Large, beautiful imagery
✅ Thoughtful copy
✅ Single, clear actions
✅ Honest product information
✅ Editorial photography style
✅ Calm, neutral colors
✅ Light typography
✅ Purposeful design

## Mobile Considerations

- Same calm aesthetic on mobile
- Larger touch targets (min 44px)
- Readable text sizes (min 16px)
- Simplified navigation
- Full-width images on small screens

## Content Guidelines

### Product Names
- Keep short and descriptive
- No ALL CAPS
- No exclamation marks

### Descriptions
- First sentence should work standalone
- Focus on feeling and purpose
- Avoid technical jargon
- Be honest about what you don't know

### Photography
- Show products in real spaces
- Natural lighting preferred
- Minimal styling, authentic settings
- Multiple angles and contexts

## Implementation Files

- `shop/components/EditorialProductPage.tsx` - Main product page
- `shop/components/ProductGrid.tsx` - Collection grid
- `shop/components/ShopHero.tsx` - Homepage hero
- `shop/app/page.tsx` - Homepage layout
- `shop/app/globals.css` - Typography and spacing

## Future Enhancements

1. **Editorial Integration**
   - Link products to blog posts
   - Show products mentioned in articles
   - Cross-reference content

2. **Lookbooks**
   - Seasonal collections
   - Styled room features
   - Curator's picks

3. **Stories**
   - Product origin stories
   - Maker profiles
   - Material deep-dives

4. **Slow Commerce**
   - Pre-order system
   - Made-to-order options
   - Waitlist for popular items

## Success Metrics

Instead of typical e-commerce metrics, focus on:
- Time spent on product pages
- Return visitor rate
- Cart abandonment (lower is better, but not at cost of pressure)
- Customer satisfaction
- Repeat purchase rate
- Editorial engagement

---

This design system prioritizes trust, quality, and intentionality over conversion optimization tactics. The goal is to build a lasting relationship with customers who value thoughtful curation.
