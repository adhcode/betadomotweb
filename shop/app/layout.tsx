import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import EditorialCartDrawer from "@/components/EditorialCartDrawer";

export const metadata: Metadata = {
  title: "Betadomot — Living, considered",
  description:
    "Betadomot is a lifestyle platform exploring modern living through thoughtful product curation, ideas, and systems for the home.",
  keywords:
    "modern living, home lifestyle, curated home products, interior ideas, home systems, Betadomot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <CartProvider>
          {children}
          <EditorialCartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
