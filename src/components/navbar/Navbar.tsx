"use client";

import React, { useState } from "react";
import { DublinClock } from "./DublinClock";
import { Button } from "../ui/Button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onOpenContact: () => void;
}

export function Navbar({ onOpenContact }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "Courses", href: "#courses" },
    { name: "Schedule", href: "#schedule" },
    { name: "About", href: "#about" },
    { name: "Blog", href: "#reviews" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="h-20 bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-black/5 transition-all">
      <div className="max-w-[1240px] h-full mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between">
        {/* Left: Wordmark */}
        <a href="#hero" className="flex items-baseline gap-1 select-none group">
          <span className="font-extrabold text-2xl tracking-tight text-[#16141B] group-hover:text-[#5B32D6] transition-colors">
            jave
          </span>
          <span className="font-normal text-2xl text-neutral-600">english</span>
        </a>

        {/* Center: Nav links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-[15px] font-medium transition-colors hover:text-[#5B32D6] ${
                link.name === "Home"
                  ? "text-[#16141B] font-semibold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-[#5B32D6] after:rounded-full"
                  : "text-neutral-700"
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Clock & CTA */}
        <div className="flex items-center gap-5 sm:gap-6">
          <DublinClock />

          <div className="hidden sm:block">
            <Button variant="purple" size="md" onClick={onOpenContact}>
              Contact Jave
            </Button>
          </div>

          {/* Mobile menu toggle button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800"
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
            className="md:hidden bg-white border-b border-neutral-100 px-6 py-6 shadow-xl"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-semibold text-neutral-800 hover:text-[#5B32D6] py-1"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-neutral-100 flex flex-col gap-3">
                <Button
                  variant="purple"
                  size="md"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenContact();
                  }}
                >
                  Contact Jave
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
