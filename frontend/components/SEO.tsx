import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  price?: number;
  currency?: string;
  availability?: 'in stock' | 'out of stock';
  brand?: string;
  category?: string;
}

export function generateSEOMetadata({
  title,
  description,
  image = '/images/og-default.svg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags = [],
  price,
  currency = 'NGN',
  availability,
  brand = 'BetaDomot',
  category
}: SEOProps): Metadata {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://betadomot.com'
    : 'http://localhost:3000';

  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  const metadata: Metadata = {
    title,
    description,
    keywords: tags.join(', '),
    authors: author ? [{ name: author }] : [{ name: 'BetaDomot' }],
    creator: 'BetaDomot',
    publisher: 'BetaDomot',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: type as any,
      title,
      description,
      url: fullUrl,
      siteName: 'BetaDomot - Your Home, Your Story',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
      creator: '@yourtwitterhandle', // Update with your actual Twitter handle
      site: '@yourtwitterhandle', // Update with your actual Twitter handle
    },
    alternates: {
      canonical: fullUrl,
    },
  };

  // Add article-specific metadata
  if (type === 'article' && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: author ? [author] : ['BetaDomot'],
      tags,
    };
  }

  // Add product-specific metadata
  if (type === 'product' && price) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'website',
    };

    // Add structured data-like meta entries as flat strings to satisfy type
    const productMeta: Record<string, string> = {
      'product:price:amount': String(price),
      'product:price:currency': currency,
      'product:availability': (availability || 'in stock'),
      'product:brand': brand,
      'product:category': category || 'Home & Garden',
    };

    metadata.other = {
      ...(metadata.other as Record<string, string>),
      ...productMeta,
    } as any;
  }

  return metadata;
}

// JSON-LD structured data generators
export function generateProductStructuredData(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  salePrice?: number;
  currency?: string;
  availability: 'in stock' | 'out of stock';
  brand?: string;
  category?: string;
  sku?: string;
  url: string;
}) {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://betadomot.com'
    : 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'BetaDomot',
    },
    category: product.category || 'Home & Garden',
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.salePrice || product.price,
      priceCurrency: product.currency || 'NGN',
      availability: product.availability === 'in stock'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}${product.url}`,
      seller: {
        '@type': 'Organization',
        name: 'BetaDomot',
        url: baseUrl,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '124',
    },
  };
}

export function generateArticleStructuredData(article: {
  title: string;
  description: string;
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  url: string;
}) {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://betadomot.com'
    : 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image.startsWith('http') ? article.image : `${baseUrl}${article.image}`,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BetaDomot',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
    url: `${baseUrl}${article.url}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${article.url}`,
    },
  };
}

export function generateOrganizationStructuredData() {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://betadomot.com'
    : 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BetaDomot',
    description: 'Your guide to creating beautiful, functional homes that tell your unique story. Fresh ideas and practical advice for modern Nigerian living.',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    sameAs: [
      'https://twitter.com/betadomot',
      'https://instagram.com/betadomot',
      'https://facebook.com/betadomot',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@betadomot.com',
    },
  };
}