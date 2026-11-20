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
  title: {
    default: "Prime Commerce Hub | Accountancy Coaching for Class 11 & 12",
    template: "%s | Prime Commerce Hub",
  },
  description:
    "Prime Commerce Hub provides expert Accountancy coaching for Class 11th and 12th Commerce students, focusing on conceptual clarity, structured learning and personalized guidance. Founded by Parvesh Kumar (30+ years teaching experience).",
  keywords: [
    "Prime Commerce Hub",
    "Parvesh Kumar",
    "Accountancy Coaching",
    "Class 11 Accountancy",
    "Class 12 Accountancy",
    "CBSE Commerce Coaching",
    "Conceptual Learning Accountancy",
    "Commerce Board Exam Preparation",
  ],
  authors: [{ name: "Parvesh Kumar" }],
  openGraph: {
    title: "Prime Commerce Hub | Accountancy Coaching for Class 11 & 12",
    description:
      "Expert Accountancy coaching for Class 11th and 12th Commerce students, focusing on conceptual clarity, structured learning, and personalized guidance.",
    url: "https://primecommercehub.com",
    siteName: "Prime Commerce Hub",
    locale: "en_IN",
    type: "website",
  },
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
