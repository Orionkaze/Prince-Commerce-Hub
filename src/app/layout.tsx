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
  title: "Jave English — Speak English with more confidence in real life",
  description:
    "Practical online English lessons for everyday conversation, travel, work, young learners, and international exam preparation by CELTA-certified Irish teacher Jave Carter.",
  keywords: [
    "English tutor",
    "CELTA certified English teacher",
    "Dublin English lessons",
    "online English coach",
    "English for work",
    "IELTS preparation",
    "Kids English",
  ],
  authors: [{ name: "Jave Carter" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#5B32D6",
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
