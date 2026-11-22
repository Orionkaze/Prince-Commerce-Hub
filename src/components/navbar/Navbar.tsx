"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";
import { Menu, X, User, ShoppingBag, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

interface NavbarProps {
  onOpenContact?: () => void;
}

export function Navbar({ onOpenContact }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { itemCount, openCart } = useCart();

  const mainNavLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Counseling", href: "/counseling" },
    { name: "Webinars", href: "/webinars" },
    { name: "Free Resources", href: "/resources" },
  ];

  const allMobileLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Counseling", href: "/counseling" },
    { name: "Webinars", href: "/webinars" },
    { name: "Free Resources", href: "/resources" },
    { name: "Contact Us", href: "/contact" },
    { name: "Student Login", href: "/login" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="h-20 bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-black/5 transition-all">
        <div className="max-w-[1240px] h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Logo & Wordmark */}
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

          {/* Center: Main Nav Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
            {mainNavLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[13px] xl:text-[14px] font-medium whitespace-nowrap transition-colors py-1 hover:text-[#5B32D6] ${active
                      ? "text-[#16141B] font-semibold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:bg-[#5B32D6] after:rounded-full"
                      : "text-neutral-700"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Cart, Login/Profile & Contact CTA */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative w-10 h-10 rounded-full bg-neutral-100 hover:bg-[#ECE8FA] hover:text-[#5B32D6] text-neutral-800 flex items-center justify-center transition-colors cursor-pointer select-none"
              aria-label="View Course Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#5B32D6] text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Auth Button or User Profile */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer border border-neutral-200"
                  aria-label="User profile menu"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="User avatar"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#5B32D6] text-white text-xs font-bold flex items-center justify-center">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 text-xs space-y-1">
                    <div className="px-3 py-2 border-b border-neutral-100">
                      <div className="font-bold text-[#16141B] truncate">
                        {user.user_metadata?.full_name || "Student"}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">
                        {user.email}
                      </div>
                    </div>
                    <Link
                      href="/courses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-neutral-700 hover:bg-[#ECE8FA] hover:text-[#5B32D6] font-medium"
                    >
                      My Enrolled Batches
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${isActive("/login")
                    ? "text-[#5B32D6] bg-[#ECE8FA]"
                    : "text-neutral-700 hover:text-[#5B32D6] hover:bg-neutral-100"
                  }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

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
                      className={`text-base font-semibold py-2 flex items-center justify-between border-b border-neutral-100 ${active ? "text-[#5B32D6]" : "text-neutral-800 hover:text-[#5B32D6]"
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

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />
    </>
  );
}
