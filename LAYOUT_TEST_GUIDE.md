# Layout Consistency Testing Guide

## Quick Visual Test

To verify the pixel-perfect alignment, follow these steps:

### 1. Start the Development Server

```bash
cd frontend
npm run dev
```

Visit: `http://localhost:3000`

### 2. Visual Alignment Check

#### Using Browser DevTools:

1. **Open DevTools** (F12 or Right-click → Inspect)
2. **Enable Rulers** (Chrome: Settings → Show rulers)
3. **Check Left Margins:**
   - Header logo left edge
   - Hero content left edge
   - Footer logo left edge
   - All section content left edges
   
   **Expected:** All should align at the same pixel position

#### Manual Measurement:

1. **Hover over Header logo** - Note the left position
2. **Hover over Hero content** - Should match Header
3. **Hover over Footer logo** - Should match Header
4. **Scroll through page** - All sections should align

### 3. Responsive Testing

Test at these viewport widths:

#### Mobile (375px)
```
- Padding: 16px (px-4)
- Max-width: Full width
- Logo alignment: Consistent
```

#### Tablet (768px)
```
- Padding: 24px (md:px-6)
- Max-width: Full width
- Logo alignment: Consistent
```

#### Desktop (1024px)
```
- Padding: 48px (lg:px-12)
- Max-width: 1200px
- Logo alignment: Consistent
- Content: Centered
```

#### Large Desktop (1440px+)
```
- Padding: 48px (lg:px-12)
- Max-width: 1200px
- Logo alignment: Consistent
- Content: Centered with equal margins
```

### 4. Component Checklist

#### Header ✓
- [ ] Logo displays correctly
- [ ] Navigation items visible on desktop
- [ ] Mobile menu button visible on mobile
- [ ] Fixed positioning works
- [ ] Aligns with page content

#### Hero ✓
- [ ] Featured image is full-width
- [ ] Text content aligns with Header
- [ ] Newsletter section aligns properly
- [ ] Responsive padding works

#### Footer ✓
- [ ] Image logo displays (not text)
- [ ] Logo matches Header logo
- [ ] Hover effect works (scale-105)
- [ ] Links are properly aligned
- [ ] Grid responsive (1/2/3 columns)

#### Homepage Sections ✓
- [ ] CategoryStories aligns
- [ ] FeaturedGuidelines aligns
- [ ] FeaturedResources aligns
- [ ] FeaturedPosts aligns
- [ ] NewsletterSection aligns

### 5. Cross-Browser Testing

Test in these browsers:

- [ ] **Chrome** (Desktop & Mobile)
- [ ] **Safari** (Desktop & Mobile)
- [ ] **Firefox** (Desktop)
- [ ] **Edge** (Desktop)

### 6. Common Issues to Check

#### No Horizontal Scrolling
```bash
# Check for elements wider than viewport
# Should see no horizontal scrollbar at any size
```

#### Logo Alignment
```bash
# All logos should start at same left position
# Use DevTools to measure exact pixels
```

#### Container Centering
```bash
# On viewports > 1200px
# Content should be centered
# Equal margins on left and right
```

#### Smooth Transitions
```bash
# Resize browser window slowly
# No sudden jumps or layout shifts
# Padding transitions smoothly
```

### 7. DevTools Inspection

#### Check Container Classes:
```html
<!-- Should see this pattern everywhere -->
<div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
```

#### Check Header Structure:
```html
<header class="fixed top-0 left-0 right-0 z-[1000] bg-white border-b border-gray-200 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
    <!-- Content -->
  </div>
</header>
```

#### Check Footer Logo:
```html
<Image
  src="/images/blog/beta-logo2.png"
  alt="BetaDomot"
  width={100}
  height={24}
  class="h-6 w-auto transition-transform duration-300 group-hover:scale-105"
/>
```

### 8. Performance Check

#### Layout Shift (CLS)
- [ ] No layout shifts on page load
- [ ] Images load without causing reflow
- [ ] Fixed header doesn't cause jumps

#### Image Optimization
- [ ] Logo loads quickly
- [ ] Next.js Image optimization working
- [ ] No console errors

### 9. Accessibility Check

#### Keyboard Navigation
- [ ] Tab through header links
- [ ] Logo is focusable and clickable
- [ ] Mobile menu accessible

#### Screen Reader
- [ ] Logo has proper alt text
- [ ] Navigation is announced correctly
- [ ] Sections have proper landmarks

### 10. Final Verification

Run through this quick checklist:

```
✓ Header logo aligns with Hero content
✓ Footer logo matches Header logo
✓ All sections have consistent left margin
✓ Container max-width is 1200px
✓ Responsive padding works (16px/24px/48px)
✓ No horizontal scrolling
✓ Content centers on large screens
✓ Smooth transitions between breakpoints
✓ Cross-browser consistency
✓ No console errors
```

## Expected Results

### Desktop (> 1024px)
- Container max-width: 1200px
- Horizontal padding: 48px
- Content centered when viewport > 1200px
- All sections aligned perfectly

### Tablet (768px - 1024px)
- Container max-width: Full width
- Horizontal padding: 24px
- All sections aligned perfectly

### Mobile (< 768px)
- Container max-width: Full width
- Horizontal padding: 16px
- All sections aligned perfectly
- Mobile menu works correctly

## Troubleshooting

### Issue: Sections not aligned
**Solution:** Check if component uses Container or has custom padding

### Issue: Horizontal scrolling
**Solution:** Check for elements with fixed widths or negative margins

### Issue: Logo not displaying
**Solution:** Verify image path: `/images/blog/beta-logo2.png`

### Issue: Layout shifts
**Solution:** Ensure images have width/height attributes

### Issue: Padding inconsistent
**Solution:** Verify Container component classes: `px-4 md:px-6 lg:px-12`

## Success Criteria

✅ All sections start at the same left margin  
✅ Footer logo matches Header logo  
✅ Responsive padding works correctly  
✅ No horizontal scrolling at any size  
✅ Content centers on large screens  
✅ Smooth transitions between breakpoints  
✅ Cross-browser consistency achieved  
✅ Professional, polished appearance  

---

**Testing Date:** December 14, 2025  
**Status:** Ready for Testing
