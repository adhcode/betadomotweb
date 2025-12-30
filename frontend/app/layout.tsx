import type { Metadata } from "next";
import { Cormorant_Garamond, Proza_Libre } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/hooks/useToast";
import { WishlistProvider } from "@/hooks/useWishlist";
import { generateOrganizationStructuredData } from "@/components/SEO";
import CartDrawer from '@/components/CartDrawer';

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://betadomot.blog' : 'http://localhost:3000'),
  title: "BetaDomot - Everything for a Better Home",
  description: "Your guide to a beautiful and happy home.",
  keywords: "home decor, interior design, Nigerian homes, furniture, home inspiration, lifestyle",
  authors: [{ name: "BetaDomot" }],
  creator: "BetaDomot",
  publisher: "BetaDomot",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    title: "BetaDomot - Everything for a Better Home",
    description: "Your guide to a beautiful and happy home.",
    url: process.env.NODE_ENV === 'production' ? 'https://betadomot.blog' : 'http://localhost:3000',
    siteName: 'BetaDomot',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'BetaDomot - Everything for a Better Home',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "BetaDomot - Everything for a Better Home",
    description: "Your guide to a beautiful and happy home.",
    images: ['/images/logo.png'],
    creator: '@betadomot',
    site: '@betadomot',
  },
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
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationStructuredData()),
          }}
        />
      </head>
      <body className={`${cormorant.variable} ${prozaLibre.variable} font-body antialiased bg-white text-gray-900`}>
        <ToastProvider>
          <WishlistProvider>
            <CartDrawer />
            {children}
          </WishlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
