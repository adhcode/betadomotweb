# Design Document

## Overview

This design document outlines the technical approach for achieving pixel-perfect layout consistency across the BetaDomot website. The solution focuses on creating a unified container system, updating the Footer to use the same logo as the Header, and ensuring all components align perfectly across all screen sizes.

## Technical Approach

### 1. Enhanced Container System

**Current State:**
- Container component exists in DesignSystem.tsx with `max-w-6xl mx-auto px-6 md:px-12`
- Header uses inline styles with `max-w-[1200px]` and `padding: 0 16px`
- Inconsistent padding values across components

**Proposed Solution:**
- Update Container component to use standardized max-width of `1200px` (max-w-7xl)
- Implement responsive padding system:
  - Mobile (< 768px): `px-4` (16px)
  - Tablet (768px - 1024px): `px-6` (24px)
  - Desktop (> 1024px): `px-12` (48px)
- Create a consistent baseline for all page sections

**Implementation:**
```tsx
export const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-7xl mx-auto px-4 md:px-6 lg:px-12 ${className}`}>
    {children}
  </div>
);
```

### 2. Footer Logo Update

**Current State:**
- Footer uses text-based logo: "BETADOMOT"
- Header uses image logo: `/images/blog/beta-logo2.png`

**Proposed Solution:**
- Replace text logo with Next.js Image component
- Use same image source as Header
- Maintain hover effects and link functionality
- Ensure proper sizing across breakpoints

**Implementation:**
```tsx
<Link href="/" className="group inline-block mb-8">
  <Image
    src="/images/blog/beta-logo2.png"
    alt="BetaDomot"
    width={100}
    height={24}
    className="h-6 w-auto transition-transform duration-300 group-hover:scale-105"
    priority={false}
  />
</Link>
```

### 3. Header Alignment Refactor

**Current State:**
- Header uses inline styles with custom max-width
- Padding doesn't match Container system
- Fixed positioning with custom container

**Proposed Solution:**
- Wrap Header content in Container component
- Remove inline style max-width and padding
- Maintain fixed positioning while using Container for content alignment
- Ensure logo aligns with Hero content

**Implementation Structure:**
```tsx
<header className="fixed top-0 left-0 right-0 z-[1000] bg-white border-b border-gray-200 shadow-sm">
  <Container>
    <div className="flex items-center justify-between h-16">
      {/* Logo and navigation */}
    </div>
  </Container>
</header>
```

### 4. Hero Section Alignment

**Current State:**
- Hero uses Container but with custom padding overrides
- Featured image breaks out to full width (correct)
- Text content uses Container (correct)

**Proposed Solution:**
- Ensure Hero text content uses standard Container
- Maintain full-width featured image
- Remove any custom padding overrides
- Align with Header logo position

**Key Considerations:**
- Featured image should remain full-width
- Text content below image should use Container
- Newsletter section should use Container
- Maintain responsive padding top for fixed header clearance

### 5. Responsive Spacing System

**Current State:**
- Inconsistent spacing between sections
- Mix of mt-20, mt-24, mt-32 values

**Proposed Solution:**
- Standardize section spacing:
  - Mobile: `mt-12` (48px)
  - Tablet: `mt-16` (64px)
  - Desktop: `mt-24` (96px)
- Apply consistently to all major sections
- Use Tailwind responsive classes: `mt-12 sm:mt-16 md:mt-24`

### 6. Footer Layout Refinement

**Current State:**
- Footer uses Container with max-w-7xl
- Grid system works but needs verification
- Padding and spacing need consistency check

**Proposed Solution:**
- Ensure Footer uses updated Container component
- Verify grid breakpoints:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
- Maintain consistent padding with other sections
- Ensure bottom bar spans full Container width

## Component Changes

### Components to Update

1. **DesignSystem.tsx**
   - Update Container component with new padding system
   - Ensure max-width is consistent (max-w-7xl = 1200px)

2. **Header.tsx**
   - Replace inline styles with Container component
   - Remove custom max-width and padding
   - Maintain fixed positioning structure

3. **Footer.tsx**
   - Replace text logo with Image component
   - Verify Container usage
   - Ensure responsive grid works correctly

4. **Hero.tsx**
   - Verify Container usage for text content
   - Ensure featured image remains full-width
   - Remove any custom padding overrides

5. **All Page Components**
   - Audit for Container usage
   - Apply consistent section spacing
   - Verify alignment across breakpoints

## Responsive Breakpoints

Following Tailwind CSS default breakpoints:
- **Mobile**: < 640px (default)
- **sm**: 640px - 767px
- **md**: 768px - 1023px
- **lg**: 1024px - 1279px
- **xl**: 1280px+

## Padding System

| Breakpoint | Class | Value |
|------------|-------|-------|
| Mobile (< 768px) | px-4 | 16px |
| Tablet (768px - 1024px) | md:px-6 | 24px |
| Desktop (> 1024px) | lg:px-12 | 48px |

## Spacing System

| Breakpoint | Class | Value |
|------------|-------|-------|
| Mobile | mt-12 | 48px |
| Tablet | sm:mt-16 | 64px |
| Desktop | md:mt-24 | 96px |

## Testing Strategy

### Visual Regression Testing
1. Compare before/after screenshots at key breakpoints
2. Verify alignment using browser dev tools
3. Check on multiple devices and browsers

### Breakpoint Testing
- Test at: 375px, 768px, 1024px, 1440px, 1920px
- Verify smooth transitions between breakpoints
- Check for any layout shifts or jumps

### Cross-Browser Testing
- Chrome (desktop & mobile)
- Safari (desktop & mobile)
- Firefox
- Edge

### Alignment Verification
1. Use browser dev tools to overlay grid
2. Measure left margin consistency
3. Verify max-width container centering
4. Check logo alignment between Header and Hero

## Implementation Order

1. **Phase 1: Container System**
   - Update DesignSystem.tsx Container component
   - Test Container in isolation

2. **Phase 2: Header Alignment**
   - Refactor Header to use Container
   - Verify fixed positioning works correctly
   - Test responsive behavior

3. **Phase 3: Footer Updates**
   - Replace text logo with Image component
   - Verify Container usage
   - Test responsive grid

4. **Phase 4: Hero Alignment**
   - Verify Hero Container usage
   - Remove custom padding overrides
   - Test featured image full-width behavior

5. **Phase 5: Global Spacing**
   - Apply consistent section spacing
   - Audit all page components
   - Verify responsive spacing

6. **Phase 6: Testing & Refinement**
   - Cross-browser testing
   - Visual regression testing
   - Fine-tune any edge cases

## Edge Cases & Considerations

1. **Fixed Header Overlap**
   - Ensure page content has proper padding-top to clear fixed header
   - Account for header height (64px)

2. **Full-Width Elements**
   - Featured images should break out of Container
   - Background colors should extend full width
   - Content within should still align with Container

3. **Mobile Menu**
   - Ensure mobile menu respects Container alignment
   - Verify menu positioning doesn't break layout

4. **Newsletter Forms**
   - Ensure forms within Container align properly
   - Verify input fields don't overflow on small screens

5. **Grid Breakpoints**
   - Test grid column transitions at breakpoints
   - Ensure no awkward layouts between breakpoints

## Success Metrics

- All major sections align at the same left margin
- Container max-width is consistent (1200px)
- Responsive padding works across all breakpoints
- Footer logo matches Header logo
- No horizontal scrolling on any device
- Smooth transitions between breakpoints
- Cross-browser consistency achieved
