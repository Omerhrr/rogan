import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ROGAN - The Base Chain Memecoin Powering Creator Gifting",
  description:
    "Rogan is a memecoin on Base blockchain designed for gifting creators on streaming platforms. Fixed supply of 1B tokens. Trade on Uniswap V2.",
  keywords: [
    "Rogan",
    "ROGAN",
    "memecoin",
    "Base",
    "crypto",
    "creator tipping",
    "Uniswap",
    "streaming",
  ],
  icons: {
    icon: "/rogan-logo.png",
  },
  openGraph: {
    title: "ROGAN - The Base Chain Memecoin",
    description:
      "Powering creator gifting on streaming platforms. Built on Base.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROGAN - The Base Chain Memecoin",
    description:
      "Powering creator gifting on streaming platforms. Built on Base.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
