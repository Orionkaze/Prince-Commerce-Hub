import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PRIME COMMERCE HUB — Master Accountancy for Class 11th & 12th Commerce",
  description:
    "Prime Commerce Hub, founded by Parvesh Kumar (Founder & Lead Educator, 30+ years teaching experience), provides top-tier Accountancy coaching focused on conceptual clarity, personalized guidance, and board exam excellence for Class 11th and 12th Commerce students.",
  keywords: [
    "Prime Commerce Hub",
    "Parvesh Kumar",
    "Accountancy coaching",
    "Class 11 Accountancy",
    "Class 12 Accountancy",
    "Commerce coaching institute",
    "CBSE Class 12 Accounts",
    "Concept based learning commerce",
  ],
  authors: [{ name: "Parvesh Kumar" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4E2EC2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} font-sans scroll-smooth`}>
      <body className="min-h-screen bg-white text-[#16141B] font-sans antialiased selection:bg-[#FDE047] selection:text-[#16141B]">
        {children}
      </body>
    </html>
  );
}
