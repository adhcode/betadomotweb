// Lifestyle Categories Configuration
// Add new categories here without changing homepage structure

export interface LifestyleCategoryConfig {
  id: string;
  title: string;
  description?: string;
  // Filter criteria for products
  filter: {
    tags?: string[];
    category?: string;
    collection?: string;
    featured?: boolean;
  };
  viewAllLink?: string;
  order: number; // Display order on homepage
}

export const lifestyleCategories: LifestyleCategoryConfig[] = [
  {
    id: 'ikea-selected',
    title: 'From IKEA, selected by Betadomot',
    description: 'Trusted everyday pieces chosen for real homes',
    filter: {
      tags: ['ikea'],
    },
    viewAllLink: '/collections/ikea-selected',
    order: 1,
  },
  {
    id: 'minimal-living',
    title: 'For minimal living',
    description: 'Less, but better',
    filter: {
      tags: ['minimalist', 'minimal'],
    },
    viewAllLink: '/collections/minimal-living',
    order: 2,
  },
  {
    id: 'work-from-home',
    title: 'Work from home essentials',
    description: 'Thoughtful tools for focused work',
    filter: {
      tags: ['workspace', 'desk', 'office'],
    },
    viewAllLink: '/collections/work-from-home',
    order: 3,
  },
  {
    id: 'calm-spaces',
    title: 'For calm spaces',
    description: 'Objects that bring quiet to your home',
    filter: {
      tags: ['calm', 'peaceful', 'serene'],
    },
    viewAllLink: '/collections/calm-spaces',
    order: 4,
  },
];

// Helper function to get category by ID
export function getCategoryById(id: string): LifestyleCategoryConfig | undefined {
  return lifestyleCategories.find(cat => cat.id === id);
}

// Helper function to filter products by lifestyle category
export function filterProductsByCategory(
  products: any[],
  categoryFilter: LifestyleCategoryConfig['filter']
): any[] {
  return products.filter((product) => {
    // Filter by tags
    if (categoryFilter.tags && categoryFilter.tags.length > 0) {
      const productTags = product.tags || [];
      const hasMatchingTag = categoryFilter.tags.some((tag) =>
        productTags.some((pTag: string) => 
          pTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (hasMatchingTag) return true;
    }

    // Filter by category
    if (categoryFilter.category) {
      if (product.category?.toLowerCase() === categoryFilter.category.toLowerCase()) {
        return true;
      }
    }

    // Filter by collection
    if (categoryFilter.collection) {
      if (product.collection?.toLowerCase() === categoryFilter.collection.toLowerCase()) {
        return true;
      }
    }

    // Filter by featured
    if (categoryFilter.featured !== undefined) {
      if (product.featured === categoryFilter.featured) {
        return true;
      }
    }

    return false;
  });
}
