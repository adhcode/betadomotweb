# Implementation Plan

- [ ] 1. Clean up codebase and remove unused components
  - [ ] 1.1 Remove unused product-related components
    - Delete FeaturedProducts.tsx component
    - Delete CartDrawer.tsx component  
    - Delete ClearCart.tsx component
    - Remove useWishlist.tsx hook
    - Clean up product-related imports from useToast.tsx
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 1.2 Remove unused home components
    - Delete NewsletterSticky.tsx from components/home/
    - Update blog page to remove NewsletterSticky import
    - Clean up any other unused components in components/home/
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. Create newsletter component with grid background
  - [x] 2.1 Create NewsletterSection component with grid background
    - Build component using GridLines from design system
    - Apply prominent styling with proper spacing
    - Include email input and subscribe button
    - _Requirements: 4.1, 4.2, 4.3_

  - [x] 2.2 Integrate newsletter component into homepage
    - Add newsletter section to homepage layout
    - Position after hub categories section
    - Ensure grid background displays correctly
    - _Requirements: 4.1, 4.4_

- [x] 3. Redesign homepage layout structure
  - [x] 3.1 Restructure homepage content hierarchy
    - Move featured blog section above hero
    - Remove unused sections and components
    - Clean up imports and fix TypeScript issues
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 3.2 Create hub categories stories section with real data
    - Create CategoryStories component that fetches real blog posts
    - Display most recent post from each category group (Decorate, Solutions, Home Life)
    - Use minimal design without hover effects, similar to featured post layout
    - Implement proper error handling and loading states
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 3.3 Update hero section positioning
    - Ensure hero appears after featured blog section
    - Maintain grid background functionality
    - Update content to focus on blog purpose
    - _Requirements: 1.1, 1.4_

- [x] 4. Enhance hub pages with consistent styling
  - [x] 4.1 Update decorate hub page
    - Apply design system components throughout
    - Implement consistent layout structure
    - Use proper typography hierarchy
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 4.2 Update solutions hub page
    - Apply design system components throughout
    - Implement consistent layout structure
    - Use proper typography hierarchy
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 4.3 Update home-life hub page
    - Apply design system components throughout
    - Implement consistent layout structure
    - Use proper typography hierarchy
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 5. Add grid background to hero and newsletter sections
  - [x] 5.1 Add GridLines component to Hero section
    - Import GridLines from design system
    - Position grid background behind hero content
    - Ensure proper z-index layering
    - _Requirements: 4.3, 4.4_

  - [x] 5.2 Add GridLines component to NewsletterSection
    - Import GridLines from design system
    - Position grid background behind newsletter content
    - Ensure consistent styling with hero section
    - _Requirements: 4.3, 4.4_

- [x] 6. Update header and footer with design system styling
  - [x] 6.1 Enhance header component styling
    - Replace custom styling with design system components
    - Use H1, H2, Body components for consistent typography
    - Ensure responsive behavior using design system patterns
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 6.2 Enhance footer component styling
    - Replace custom styling with design system components
    - Use consistent typography from design system
    - Maintain responsive design using design system patterns
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 7. Redesign blog post pages with design system
  - [x] 7.1 Update blog post layout to use design system
    - Replace custom styling with design system components (H1, H2, Body, MonoText, etc.)
    - Implement proper content hierarchy and readability
    - Use consistent spacing and typography throughout
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 7.2 Implement functional clap and comment features
    - Create proper clap icon with hand clapping animation
    - Add clap tracking with localStorage and backend sync
    - Display comment counts and engagement metrics
    - Add share functionality with multiple platforms
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 7.3 Improve content formatting and readability
    - Enhanced markdown-to-HTML conversion with better styling
    - Proper typography for headings, paragraphs, lists, and code blocks
    - Consistent color scheme and spacing throughout content
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 8. Streamline admin interface for blog management
  - [x] 8.1 Update admin dashboard with hub-focused layout
    - Add hub category overview cards (Decorate, Solutions, Home Life)
    - Reorganize quick actions to focus on blog management
    - Improve navigation and visual hierarchy
    - _Requirements: 8.1, 8.2_

  - [x] 8.2 Create consistent admin layout with navigation
    - Build reusable admin layout component with sidebar navigation
    - Add proper navigation between admin sections
    - Include logout and site preview functionality
    - _Requirements: 8.1, 8.2_

  - [x] 8.3 Enhance posts management with category filtering
    - Add category filtering by hub and specific categories
    - Improve post form with grouped category options
    - Better organization of blog categories in admin
    - _Requirements: 8.1, 8.2, 8.3_

- [ ] 9. Final polish and testing
  - [ ] 9.1 Test responsive design across devices
    - Verify all components work on mobile, tablet, desktop
    - Test grid background display on different screen sizes
    - Ensure proper spacing and typography scaling
    - _Requirements: 6.4, 2.3, 2.4_

  - [ ] 9.2 Optimize performance and animations
    - Test page load times and optimize if needed
    - Ensure smooth hover effects and transitions
    - Verify grid background performance
    - _Requirements: 2.3, 2.4_