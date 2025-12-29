// Nigerian Lifestyle Collections Configuration
// Add as many collections as you want here!

export interface LifestyleCollection {
    id: string;
    title: string;
    titleColor: string;
    badgeText: string;
    badgeColor: string;
    description?: string;
    showOnHomepage: boolean;
    showOnProductsPage: boolean;
    priority: number; // Higher number = shows first
}

export const LIFESTYLE_COLLECTIONS: LifestyleCollection[] = [
    // High Priority Collections (Top of homepage)
    {
        id: 'budget-deals',
        title: 'up to 50% OFF: Home Decor Under ₦30,000',
        titleColor: 'text-red-600',
        badgeText: 'up to 50% OFF',
        badgeColor: 'bg-red-500',
        description: 'Budget-friendly pieces that don\'t compromise on style',
        showOnHomepage: true,
        showOnProductsPage: true,
        priority: 100
    },
    {
        id: 'fresh-picks',
        title: 'fresh-picked favorites',
        titleColor: 'text-purple-600',
        badgeText: '✓',
        badgeColor: 'bg-purple-600',
        description: 'Our team\'s latest discoveries for your Nigerian home',
        showOnHomepage: true,
        showOnProductsPage: true,
        priority: 90
    },

    // Medium Priority Collections
    {
        id: 'lagos-apartment',
        title: 'Lagos Apartment Essentials',
        titleColor: 'text-blue-600',
        badgeText: 'Space Saver',
        badgeColor: 'bg-blue-500',
        description: 'Perfect for small Lagos apartments and condos',
        showOnHomepage: true,
        showOnProductsPage: true,
        priority: 80
    },
    {
        id: '2-bedroom-setup',
        title: '2-Bedroom Apartment Complete Setup',
        titleColor: 'text-emerald-600',
        badgeText: 'Complete Set',
        badgeColor: 'bg-emerald-500',
        description: 'Everything you need for a stylish 2-bedroom home',
        showOnHomepage: false, // Only on products page
        showOnProductsPage: true,
        priority: 75
    },
    {
        id: 'weekend-diy',
        title: 'Weekend DIY Projects',
        titleColor: 'text-green-600',
        badgeText: 'DIY',
        badgeColor: 'bg-green-500',
        description: 'Quick weekend upgrades that make a big impact',
        showOnHomepage: true,
        showOnProductsPage: true,
        priority: 70
    },

    // Seasonal & Special Collections
    {
        id: 'rainy-season',
        title: 'Rainy Season Must-Haves',
        titleColor: 'text-indigo-600',
        badgeText: 'Weather Ready',
        badgeColor: 'bg-indigo-500',
        description: 'Essential items for Nigerian rainy season comfort',
        showOnHomepage: true,
        showOnProductsPage: true,
        priority: 65
    },
    {
        id: 'small-space',
        title: 'Small Space, Big Style',
        titleColor: 'text-orange-600',
        badgeText: 'Maximize',
        badgeColor: 'bg-orange-500',
        description: 'Smart solutions for compact Nigerian homes',
        showOnHomepage: true,
        showOnProductsPage: true,
        priority: 60
    },

    // Products Page Only Collections
    {
        id: 'luxury-under-100k',
        title: 'Luxury Feel Under ₦100,000',
        titleColor: 'text-amber-600',
        badgeText: 'Premium',
        badgeColor: 'bg-amber-500',
        description: 'High-end look without the high-end price',
        showOnHomepage: false,
        showOnProductsPage: true,
        priority: 55
    },
    {
        id: 'nepa-friendly',
        title: 'NEPA-Friendly Home Solutions',
        titleColor: 'text-yellow-600',
        badgeText: 'Power Smart',
        badgeColor: 'bg-yellow-500',
        description: 'Products that work well with irregular power supply',
        showOnHomepage: false,
        showOnProductsPage: true,
        priority: 50
    },
    {
        id: 'office-at-home',
        title: 'Office at Home: WFH Essentials',
        titleColor: 'text-slate-600',
        badgeText: 'WFH',
        badgeColor: 'bg-slate-500',
        description: 'Create a productive workspace at home',
        showOnHomepage: false,
        showOnProductsPage: true,
        priority: 45
    },
    {
        id: 'naija-style',
        title: 'Naija Style: Local Vibes',
        titleColor: 'text-green-600',
        badgeText: '🇳🇬',
        badgeColor: 'bg-green-600',
        description: 'Celebrate Nigerian culture in your home decor',
        showOnHomepage: false,
        showOnProductsPage: true,
        priority: 40
    },
    {
        id: 'family-friendly',
        title: 'Family-Friendly Living',
        titleColor: 'text-pink-600',
        badgeText: 'Safe & Fun',
        badgeColor: 'bg-pink-500',
        description: 'Safe, durable pieces perfect for Nigerian families',
        showOnHomepage: false,
        showOnProductsPage: true,
        priority: 35
    }
];

// Helper functions
export const getCollectionsForHomepage = () => 
    LIFESTYLE_COLLECTIONS
        .filter(collection => collection.showOnHomepage)
        .sort((a, b) => b.priority - a.priority);

export const getCollectionsForProductsPage = () => 
    LIFESTYLE_COLLECTIONS
        .filter(collection => collection.showOnProductsPage)
        .sort((a, b) => b.priority - a.priority);

export const getCollectionById = (id: string) => 
    LIFESTYLE_COLLECTIONS.find(collection => collection.id === id);

// Example usage:
// const homepageCollections = getCollectionsForHomepage(); // Returns 6 collections
// const productsPageCollections = getCollectionsForProductsPage(); // Returns 12 collections 