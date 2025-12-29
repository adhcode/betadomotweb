# Design Document

## Overview

This design outlines the transformation of the existing homepage and hub pages into a creative, blog-focused platform with minimalist styling. The redesign leverages the existing design system, blog infrastructure, and components while implementing a clean, consistent visual hierarchy that immediately communicates the site's purpose to homeowners.

## Architecture

### Current Architecture Analysis
The existing codebase has:
- **Design System**: Comprehensive `DesignSystem.tsx` with minimalist components
- **Blog Infrastructure**: Working backend connection with posts API
- **Component Structure**: `FeaturedPosts.tsx`, `Hero.tsx`, and layout components
- **Styling**: Tailwind CSS with creative coding typography and minimal design patterns

### Design Approach
The redesign will:
1. **Preserve Core Infrastructure**: Keep existing API connections and data flow
2. **Enhance Visual Hierarchy**: Restructure content layout for better blog presentation
3. **Implement Consistent Styling**: Apply design system components uniformly
4. **Clean Up Codebase**: Remove unused components and consolidate functionality

## Components and Interfaces

### Core Components to Retain
- `DesignSystem.tsx` - Complete design system with typography, layouts, and UI elements
- `FeaturedPosts.tsx` - Blog post display with backend integration
- `Hero.tsx` - Landing section with grid background
- `Header.tsx` and `Footer.tsx` - Navigation components

### Components to Enhance
1. **Homepage Layout** (`app/page.tsx`)
   - Restructure content hierarchy
   - Remove unused imports and components
   - Implement featured blog section above hero
   - Add hub category stories section
   - Integrate newsletter with grid background

2. **Hub Pages** (`app/hubs/*/page.tsx`, `app/decorate/page.tsx`, etc.)
   - Apply consistent creative styling
   - Implement unified layout structure
   - Use design system components throughout

3. **Newsletter Component**
   - Create prominent newsletter section
   - Apply grid background styling
   - Integrate with existing design system

### Components to Remove/Consolidate
Based on the directory structure, these components appear redundant:
- Multiple home components in `components/home/` directory
- Unused product-related components (cart, wishlist, products)
- Redundant layout components

## Data Models

### Existing Blog Post Model
```typescript
interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    published_at: string;
    read_time?: string;
    featured_image?: string;
    tags?: string[];
    views?: number;
}
```

### Hub Category Model
```typescript
interface HubCategory {
    name: string;
    slug: string;
    description: string;
    color: string; // For consistent theming
    posts: BlogPost[];
}
```

## Visual Design System

### Typography Hierarchy
Using existing design system:
- `H1` - Hero headlines (5xl-7xl, extralight)
- `H2` - Section headers (3xl-5xl, extralight)  
- `H3` - Card titles (xl-2xl, light)
- `MonoText` - Meta information (mono, small, gray)
- `Body` - Content text (base, light, gray-600)

### Layout Components
- `Container` - Max-width content wrapper
- `Section` - Vertical spacing sections
- `Grid` - Responsive grid layouts
- `MinimalCard` - Content cards with hover effects

### Color Palette
From existing design system:
- **Primary**: Gray scale (50-900)
- **Accent Colors**: Blue (#2563eb), Green (#059669), Purple (#7c3aed)
- **Background**: White with grid overlay for hero/newsletter

### Grid Background Implementation
- Applied only to Hero and Newsletter sections
- Uses existing `GridLines` component
- Subtle opacity (0.02) for minimal visual impact

## Page Structure

### Homepage Layout
1. **Header** - Navigation with consistent styling
2. **Featured Blog Section** - Prominent display without explicit labeling
3. **Hero Section** - With grid background, value proposition
4. **Hub Categories** - Stories from decorate, solutions, home-life
5. **Newsletter Section** - With grid background, prominent placement
6. **Footer** - Consistent styling

### Hub Pages Layout
1. **Header** - Consistent navigation
2. **Hero Section** - Category-specific messaging
3. **Featured Content** - Category posts and resources
4. **Content Grid** - Organized content display
5. **Newsletter CTA** - Category-relevant signup
6. **Footer** - Consistent styling

## Error Handling

### Image Loading
- Implement fallback images for blog posts
- Handle external image loading errors
- Provide placeholder states during loading

### API Integration
- Graceful handling of blog post API failures
- Loading states for content sections
- Fallback content when API is unavailable

### Responsive Design
- Ensure all components work across device sizes
- Test grid layouts on mobile devices
- Maintain readability at all breakpoints

## Testing Strategy

### Component Testing
- Test design system components in isolation
- Verify responsive behavior across breakpoints
- Test image loading and error states

### Integration Testing
- Test blog post API integration
- Verify newsletter signup functionality
- Test navigation between hub pages

### Visual Regression Testing
- Ensure consistent styling across pages
- Verify grid background implementation
- Test hover states and animations

### Performance Testing
- Optimize image loading and sizing
- Test page load times
- Verify smooth animations and transitions

## Implementation Phases

### Phase 1: Cleanup and Foundation
- Remove unused components and files
- Consolidate redundant functionality
- Ensure design system is properly implemented

### Phase 2: Homepage Redesign
- Restructure homepage layout
- Implement featured blog section
- Add hub category stories
- Create prominent newsletter section

### Phase 3: Hub Pages Enhancement
- Apply consistent styling to all hub pages
- Implement unified layout structure
- Ensure design system usage throughout

### Phase 4: Header and Footer
- Update navigation styling
- Ensure consistent branding
- Implement responsive behavior

### Phase 5: Polish and Optimization
- Fine-tune animations and interactions
- Optimize performance
- Conduct final testing and refinement