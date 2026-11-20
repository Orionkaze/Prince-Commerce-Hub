"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onOpenContact?: () => void;
}

export function Navbar({ onOpenContact }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const mainNavLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Webinars", href: "/webinars" },
    { name: "Free Resources", href: "/resources" },
    { name: "About Us", href: "/about" },
    { name: "Track Order", href: "/track-order" },
  ];

  const allMobileLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Webinars", href: "/webinars" },
    { name: "Free Resources", href: "/resources" },
    { name: "About Us", href: "/about" },
    { name: "Track Order", href: "/track-order" },
    { name: "Contact Us", href: "/contact" },
    { name: "Student Login", href: "/login" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="h-20 bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-black/5 transition-all">
      <div className="max-w-[1240px] h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Logo & Wordmark (Never wraps, never shrinks) */}
        <Link href="/" className="flex items-center gap-2 select-none group shrink-0">
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-md overflow-hidden shrink-0 border border-neutral-200/70 shadow-xs bg-white">
            <Image
              src="/images/prime-commerce-hub-logo.jpg"
              alt="Prime Commerce Hub Logo"
              fill
              className="object-contain p-0.5"
              sizes="32px"
              priority
            />
          </div>
          <div className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="font-extrabold text-[15px] sm:text-[16px] tracking-tight text-[#16141B] group-hover:text-[#5B32D6] transition-colors">
              PRIME
            </span>
            <span className="font-medium text-[15px] sm:text-[16px] tracking-tight text-neutral-600">
              COMMERCE HUB
            </span>
          </div>
        </Link>

        {/* Center: Main Nav Links (Desktop - single line, no wrapping, clean spacing) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
          {mainNavLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[13px] xl:text-[14px] font-medium whitespace-nowrap transition-colors py-1 hover:text-[#5B32D6] ${
                  active
                    ? "text-[#16141B] font-semibold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-[#5B32D6] after:rounded-full"
                    : "text-neutral-700"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Login, Clock & Contact CTA (Never wraps, cleanly spaced) */}
        <div className="flex items-center gap-3 sm:gap-4 xl:gap-5 shrink-0">
          {/* Login Link */}
          <Link
            href="/login"
            className={`hidden sm:flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              isActive("/login")
                ? "text-[#5B32D6] bg-[#ECE8FA]"
                : "text-neutral-700 hover:text-[#5B32D6] hover:bg-neutral-100"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Login</span>
          </Link>

          {/* Contact Button */}
          <div className="hidden sm:block shrink-0">
            <Link href="/contact">
              <Button variant="purple" size="md" className="whitespace-nowrap">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 cursor-pointer shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-neutral-100 px-6 py-6 shadow-xl max-h-[85vh] overflow-y-auto"
          >
            <nav className="flex flex-col gap-3">
              {allMobileLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-base font-semibold py-2 flex items-center justify-between border-b border-neutral-100 ${
                      active ? "text-[#5B32D6]" : "text-neutral-800 hover:text-[#5B32D6]"
                    }`}
                  >
                    <span>{link.name}</span>
                    {active && <span className="w-2 h-2 rounded-full bg-[#5B32D6]" />}
                  </Link>
                );
              })}

              <div className="pt-4 flex flex-col gap-3">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="purple" size="md" className="w-full justify-center">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
