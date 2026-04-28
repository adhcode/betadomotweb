// Product Type Utilities
// Handles distinction between Editorial and Everyday products

export type ProductType = 'editorial' | 'everyday';

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Small", "Blue", "Oak"
  type: 'size' | 'color' | 'material' | 'other';
  price_adjustment: number; // +/- from base price
  sku_suffix: string;
  stock: number;
  image_index?: number; // Which product image to show
}

export interface BaseProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  tags: string[];
  product_type: ProductType;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EditorialProduct extends BaseProduct {
  product_type: 'editorial';
  editorial_note: string;
  external_link?: string;
  availability_status: 'available' | 'limited' | 'reference' | 'sold_out';
}

export interface EverydayProduct extends BaseProduct {
  product_type: 'everyday';
  sale_price?: number;
  stock: number;
  sku: string;
  weight?: number;
  dimensions?: string;
  variants?: ProductVariant[];
  shipping_info?: string;
  return_policy?: string;
  care_instructions?: string;
}

export type Product = EditorialProduct | EverydayProduct;

// Type guards
export function isEditorialProduct(product: Product): product is EditorialProduct {
  return product.product_type === 'editorial';
}

export function isEverydayProduct(product: Product): product is EverydayProduct {
  return product.product_type === 'everyday';
}

// Helper functions
export function getProductPrice(product: Product): number {
  if (isEverydayProduct(product)) {
    return product.sale_price || product.price;
  }
  return product.price;
}

export function isProductAvailable(product: Product): boolean {
  if (isEditorialProduct(product)) {
    return product.availability_status === 'available' || product.availability_status === 'limited';
  }
  return product.stock > 0;
}

export function getAvailabilityLabel(product: Product): string {
  if (isEditorialProduct(product)) {
    switch (product.availability_status) {
      case 'available':
        return 'Available';
      case 'limited':
        return 'Limited availability';
      case 'reference':
        return 'Reference only';
      case 'sold_out':
        return 'Sold out';
      default:
        return 'Unavailable';
    }
  }
  
  if (product.stock > 0) {
    return `${product.stock} in stock`;
  }
  return 'Out of stock';
}

export function getProductBadge(product: Product): string | null {
  if (isEditorialProduct(product)) {
    if (product.availability_status === 'reference') {
      return 'Reference';
    }
    if (product.availability_status === 'limited') {
      return 'Limited';
    }
  }
  return null;
}

export function canAddToCart(product: Product): boolean {
  if (isEditorialProduct(product)) {
    return false; // Editorial products cannot be added to cart
  }
  return product.stock > 0;
}

export function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`;
}

export function getProductCTA(product: Product): string {
  if (isEditorialProduct(product)) {
    if (product.external_link) {
      return 'View details';
    }
    if (product.availability_status === 'limited') {
      return 'Notify me';
    }
    return 'Learn more';
  }
  
  if (product.stock > 0) {
    return 'Add to cart';
  }
  return 'Notify when available';
}
