import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CSFloat Sniper — Real-time CS2 Skin Deals",
  description:
    "Track the best CS2 skin deals on CSFloat in real-time. Find the highest discounts and snipe the best offers instantly.",
  keywords: ["CS2", "CSFloat", "skins", "deals", "sniper", "Counter-Strike"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
