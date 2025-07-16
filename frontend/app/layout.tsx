import type { Metadata } from "next";
import { Playfair_Display, Inter, Cutive } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const cutive = Cutive({
  subsets: ["latin"],
  variable: "--font-cutive",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BetaDomot - Your Home, Your Story",
  description: "Your guide to creating beautiful, functional homes that tell your unique story. Fresh ideas and practical advice for modern Nigerian living.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} ${cutive.variable} font-body antialiased bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
