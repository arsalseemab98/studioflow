import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DeployRefresh } from "@/components/layout/deploy-refresh";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudioFlow — Manage Your Studio",
  description:
    "Bookings, contracts, and client management for photographers and event planners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${cormorant.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DeployRefresh />
        {children}
      </body>
    </html>
  );
}
