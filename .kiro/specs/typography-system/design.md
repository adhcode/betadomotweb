# Typography System Design Document

## Overview

This design document outlines the implementation of a comprehensive typography system that replaces the current font setup with a professional three-font hierarchy: Gilroy for branding and UI elements, Cormorant Garamond for headlines, and Proza Libre for body text. The system will be implemented through Next.js font loading, CSS custom properties, and Tailwind CSS utilities.

### Current State Analysis

The website currently uses:
- Gilroy as the primary font for everything (loaded via @font-face from local files)
- Multiple Gilroy variants: Light (300), Regular (400), Bold (600), ExtraBold (800)
- Playfair Display, Inter, and Cutive loaded via next/font/google but not actively used
- Font files stored in `/frontend/public/`

### Target State

The new system will use:
- **Gilroy**: Logo, navigation, buttons, categories/tags (Bold 700, Semi-Bold 600)
- **Cormorant Garamond**: All headings H1-H6 (Regular 400, Medium 500, Bold 700)
- **Proza Libre**: Body text, paragraphs, lists, form inputs (Regular 400, Medium 500, Bold 700)

## Architecture

### Font Loading Strategy

**Google Fonts via next/font/google**
- Use Next.js's built-in font optimization for Cormorant Garamond and Proza Libre
- Automatic font subsetting and preloading
- CSS variable generation for easy reference
- Font display: swap (prevents FOUT)

**Local Fonts for Gilroy**
- Keep existing Gilroy files in `/public/` directory
- Use @font-face declarations in globals.css
- Maintain font-display: swap for consistency

### CSS Architecture

**Three-Layer Approach:**

1. **Font Face Declarations** (globals.css)
   - @font-face rules for Gilroy variants
   - Proper font-weight mapping

2. **CSS Custom Properties** (:root in globals.css)
   - `--font-gilroy`: Gilroy font stack
   - `--font-cormorant`: Cormorant Garamond font stack
   - `--font-proza`: Proza Libre font stack

3. **Global Element Styles** (globals.css)
   - Default typography for HTML elements
   - Heading styles (h1-h6)
   - Body text styles (p, li, blockquote)
   - UI element styles (button, input, a)

4. **Utility Classes** (Tailwind + Custom)
   - Tailwind font family utilities
   - Custom utility classes for specific use cases

## Components and Interfaces

### Font Configuration

**layout.tsx Updates:**
```typescript
import { Cormorant_Garamond, Proza_Libre } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "700"],
  display: "swap",
});

const prozaLibre = Proza_Libre({
  subsets: ["latin"],
  variable: "--font-proza",
  weight: ["400", "500", "700"],
  display: "swap",
});
```

**globals.css Font Face:**
```css
@font-face {
  font-family: 'Gilroy';
  src: url('/gilroy-regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gilroy';
  src: url('/gilroy-bold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gilroy';
  src: url('/Gilroy-ExtraBold.otf') format('opentype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### CSS Custom Properties

```css
:root {
  --font-gilroy: 'Gilroy', 'Arial', sans-serif;
  --font-cormorant: var(--font-cormorant), 'Georgia', serif;
  --font-proza: var(--font-proza), 'Helvetica', sans-serif;
}
```

### Typography Mapping

| Element Type | Font Family | Weight | Transform | Use Cases |
|-------------|-------------|---------|-----------|-----------|
| Logo/Site Title | Gilroy | 700 (Bold) | Uppercase | Header logo, footer logo |
| Navigation | Gilroy | 600-700 | None | Main nav, mobile menu, footer nav |
| Buttons | Gilroy | 600 (Semi-Bold) | Uppercase | All button elements, CTAs |
| Categories/Tags | Gilroy | 600 (Semi-Bold) | None | Category badges, tag labels |
| H1-H6 | Cormorant Garamond | 400-700 | None | All heading levels |
| Body Text | Proza Libre | 400 | None | Paragraphs, lists, general content |
| Form Inputs | Proza Libre | 400 | None | Input fields, textareas, labels |
| Blockquotes | Proza Libre | 400 | Italic | Quote blocks |
| Strong/Bold | Proza Libre | 700 | None | Emphasized text |

## Data Models

### Tailwind Configuration Extension

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        gilroy: ['var(--font-gilroy)'],
        cormorant: ['var(--font-cormorant)'],
        proza: ['var(--font-proza)'],
        // Legacy aliases for backward compatibility
        heading: ['var(--font-cormorant)'],
        body: ['var(--font-proza)'],
      },
    },
  },
}
```

### Component-Level Font Classes

**Utility Class Naming Convention:**
- `.font-gilroy` - Gilroy font family
- `.font-cormorant` - Cormorant Garamond font family
- `.font-proza` - Proza Libre font family
- `.font-heading` - Alias for Cormorant Garamond
- `.font-body` - Alias for Proza Libre

## Implementation Strategy

### Phase 1: Font Loading Setup
1. Update `layout.tsx` to import and configure Cormorant Garamond and Proza Libre
2. Add font CSS variables to body className
3. Clean up unused font imports (Playfair Display, Inter, Cutive)

### Phase 2: Global CSS Updates
1. Update @font-face declarations for Gilroy (consolidate and fix weights)
2. Update CSS custom properties in :root
3. Update global element styles (h1-h6, p, button, etc.)
4. Update utility classes

### Phase 3: Tailwind Configuration
1. Extend Tailwind config with new font families
2. Remove old font family references
3. Test utility class generation

### Phase 4: Component Updates
1. Update Header component (logo, navigation)
2. Update Button component
3. Update category/tag components
4. Update blog content styles
5. Update form components

### Phase 5: Verification
1. Test all pages for font consistency
2. Verify font loading performance
3. Check mobile responsiveness
4. Validate accessibility (font sizes, contrast)

## Error Handling

### Font Loading Failures

**Fallback Strategy:**
- Gilroy → Arial → sans-serif
- Cormorant Garamond → Georgia → serif
- Proza Libre → Helvetica → sans-serif

**Implementation:**
```css
font-family: var(--font-cormorant), Georgia, serif;
```

### Missing Font Files

**Detection:**
- Browser DevTools Network tab monitoring
- Console warnings for failed font loads

**Resolution:**
- Verify font files exist in `/public/` directory
- Check file paths in @font-face declarations
- Ensure proper MIME types for font files

### FOUT (Flash of Unstyled Text)

**Prevention:**
- Use `font-display: swap` for all fonts
- Preload critical fonts in layout.tsx
- Use Next.js font optimization

## Testing Strategy

### Visual Regression Testing
1. Take screenshots of key pages before changes
2. Compare after implementation
3. Verify typography hierarchy is maintained

### Cross-Browser Testing
- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS/iOS)

### Device Testing
- Desktop (1920px, 1440px, 1024px)
- Tablet (768px)
- Mobile (375px, 414px)

### Performance Testing
- Measure font loading time
- Check Lighthouse scores
- Verify no layout shift (CLS)

### Accessibility Testing
- WCAG 2.1 AA compliance
- Minimum font sizes (16px for body text)
- Sufficient color contrast
- Screen reader compatibility

## Component-Specific Implementation Details

### Header Component
```tsx
// Logo
<div className="font-gilroy font-bold uppercase text-2xl">
  BETADOMOT
</div>

// Navigation
<nav className="font-gilroy font-semibold">
  <a href="/blog">Blog</a>
  <a href="/guides">Guides</a>
</nav>
```

### Button Component
```tsx
<button className="font-gilroy font-semibold uppercase">
  Read More
</button>
```

### Blog Post Content
```tsx
<article className="font-proza">
  <h1 className="font-cormorant font-bold">Heading</h1>
  <p className="font-proza">Body text...</p>
</article>
```

### Category Badge
```tsx
<span className="font-gilroy font-semibold">
  Interiors
</span>
```

## Migration Considerations

### Backward Compatibility
- Keep old font CSS variables temporarily
- Add deprecation warnings in comments
- Gradual migration of components

### Performance Impact
- Two additional Google Fonts (Cormorant Garamond, Proza Libre)
- Estimated additional load: ~40-60KB (compressed)
- Mitigated by Next.js font optimization and subsetting

### SEO Impact
- No negative impact expected
- Improved readability may increase engagement metrics
- Proper semantic HTML maintained

## Design Tokens

### Font Sizes (Responsive)
```css
/* Desktop */
h1: 3.5rem (56px)
h2: 2.5rem (40px)
h3: 2rem (32px)
h4: 1.5rem (24px)
h5: 1.25rem (20px)
h6: 1.125rem (18px)
body: 1.125rem (18px)
small: 0.875rem (14px)

/* Mobile */
h1: 2.5rem (40px)
h2: 2rem (32px)
h3: 1.5rem (24px)
h4: 1.25rem (20px)
h5: 1.125rem (18px)
h6: 1rem (16px)
body: 1rem (16px)
small: 0.875rem (14px)
```

### Font Weights
```css
Gilroy:
  - Regular: 400
  - Semi-Bold: 600
  - Bold: 700

Cormorant Garamond:
  - Regular: 400
  - Medium: 500
  - Bold: 700

Proza Libre:
  - Regular: 400
  - Medium: 500
  - Bold: 700
```

### Line Heights
```css
Headings: 1.2
Body: 1.8
Buttons: 1.5
Navigation: 1.5
```

### Letter Spacing
```css
Logo: -0.02em
Headings: -0.01em
Body: normal
Buttons (uppercase): 0.05em
```

## File Structure

```
frontend/
├── app/
│   ├── layout.tsx (font imports and configuration)
│   └── globals.css (font faces, custom properties, global styles)
├── public/
│   ├── gilroy-regular.ttf
│   ├── gilroy-bold.ttf
│   └── Gilroy-ExtraBold.otf
├── components/
│   ├── Header.tsx (logo, navigation)
│   ├── ui/
│   │   └── Button.tsx (button styles)
│   └── [other components]
└── tailwind.config.ts (font family extensions)
```

## Success Criteria

1. All fonts load successfully across browsers and devices
2. Typography hierarchy is clear and consistent
3. No FOUT or layout shift
4. Performance metrics maintained or improved
5. Accessibility standards met
6. All components use correct fonts per specification
7. Mobile experience is optimal
8. No console errors related to fonts
