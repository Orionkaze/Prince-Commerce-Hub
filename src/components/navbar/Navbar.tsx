"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";
import {
  Menu,
  X,
  User,
  ShoppingBag,
  LogOut,
  UploadCloud,
  Layers,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { UploadContentModal } from "@/components/admin/UploadContentModal";
import { ContentManagerModal } from "@/components/admin/ContentManagerModal";
import { MyPurchasesModal } from "@/components/student/MyPurchasesModal";

interface NavbarProps {
  onOpenContact?: () => void;
}

export function Navbar({ onOpenContact }: NavbarProps) {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isContentManagerOpen, setIsContentManagerOpen] = useState(false);
  const [isPurchasesOpen, setIsPurchasesOpen] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();
  const { user, signOut, isAdmin } = useAuth();
  const { itemCount, openCart } = useCart();

  const mainNavLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Live Classes", href: "/live-classes" },
    { name: "Counseling", href: "/counseling" },
    { name: "Webinars", href: "/webinars" },
    { name: "Free Resources", href: "/resources" },
  ];

  const allMobileLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Live Classes", href: "/live-classes" },
    ...(user ? [{ name: "Student Dashboard", href: "/dashboard" }, { name: "My Courses", href: "/my-courses" }] : []),
    ...(isAdmin ? [{ name: "Admin Portal", href: "/admin" }] : []),
    { name: "Counseling", href: "/counseling" },
    { name: "Webinars", href: "/webinars" },
    { name: "Free Resources", href: "/resources" },
    { name: "Contact Us", href: "/contact" },
    ...(!user ? [{ name: "Student Login", href: "/login" }] : []),
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

          {/* Right: Upload Button (Admin), Cart, Login/Profile & Contact CTA */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* TEACHER ONLY: + Upload Content Button */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                suppressHydrationWarning
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#5B32D6] text-white text-xs font-bold hover:bg-[#4E2EC2] shadow-xs transition-colors cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#FDE047]" />
                <span>+ Upload Content</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              type="button"
              onClick={openCart}
              suppressHydrationWarning
              className="relative w-10 h-10 rounded-full bg-neutral-100 hover:bg-[#ECE8FA] hover:text-[#5B32D6] text-neutral-800 flex items-center justify-center transition-colors cursor-pointer select-none"
              aria-label="View Course Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {mounted && itemCount > 0 && (
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
                  suppressHydrationWarning
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
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 text-xs space-y-1">
                    <div className="px-3 py-2 border-b border-neutral-100">
                      <div className="font-bold text-[#16141B] truncate">
                        {user.user_metadata?.full_name || "Student"}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">
                        {user.email}
                      </div>
                      {isAdmin && (
                        <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-md bg-[#ECE8FA] text-[#5B32D6] font-bold text-[10px]">
                          Admin / Teacher
                        </div>
                      )}
                    </div>

                    {/* Teacher Quick CMS Controls */}
                    {isAdmin && (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full text-left px-3 py-2 rounded-xl text-[#5B32D6] bg-[#ECE8FA]/60 hover:bg-[#ECE8FA] font-bold flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5 text-[#5B32D6]" />
                          <span>Admin Dashboard</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setIsUploadOpen(true);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-[#16141B] hover:bg-[#ECE8FA] hover:text-[#5B32D6] font-bold flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-[#5B32D6]" />
                          <span>+ Upload Batch Lecture</span>
                        </button>
                        <Link
                          href="/admin/courses"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full text-left px-3 py-2 rounded-xl text-neutral-700 hover:bg-[#ECE8FA] hover:text-[#5B32D6] font-medium flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Manage Batches &amp; Curricula</span>
                        </Link>
                      </>
                    )}

                    {/* Student Dashboard */}
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-neutral-800 hover:bg-[#ECE8FA] hover:text-[#5B32D6] font-bold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#5B32D6]" />
                      <span>Student Dashboard</span>
                    </Link>

                    {/* My Enrolled Courses */}
                    <Link
                      href="/my-courses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-neutral-700 hover:bg-[#ECE8FA] hover:text-[#5B32D6] font-medium flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>My Enrolled Courses</span>
                    </Link>

                    {/* Student Profile */}
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-neutral-700 hover:bg-[#ECE8FA] hover:text-[#5B32D6] font-medium flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>My Profile</span>
                    </Link>

<Link
  href="/track-order"
  onClick={() => setUserDropdownOpen(false)}
  className="block px-3 py-2 rounded-xl text-neutral-700 hover:bg-[#ECE8FA] hover:text-[#5B32D6] font-medium"
>
  Track Batch Materials
</Link>
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
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
              <Button href="/contact" variant="purple" size="md" className="whitespace-nowrap">
                Contact Us
              </Button>
            </div>

            {/* Mobile menu toggle button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              suppressHydrationWarning
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
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsUploadOpen(true);
                    }}
                    className="w-full text-left py-2.5 px-3 rounded-xl bg-[#5B32D6] text-white text-sm font-bold flex items-center gap-2"
                  >
                    <UploadCloud className="w-4 h-4 text-[#FDE047]" />
                    <span>+ Upload Content (Teacher)</span>
                  </button>
                )}

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

                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsPurchasesOpen(true);
                    }}
                    className="text-left text-base font-semibold py-2 border-b border-neutral-100 text-neutral-800 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-[#5B32D6]" />
                    <span>My Enrolled Batches</span>
                  </button>
                )}

                <div className="pt-4 flex flex-col gap-3">
                  <Button
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    variant="purple"
                    size="md"
                    className="w-full justify-center"
                  >
                    Contact Us
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />

      {/* Teacher Content Upload Modal */}
      <UploadContentModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      {/* Teacher CMS Manager Modal */}
      <ContentManagerModal
        isOpen={isContentManagerOpen}
        onClose={() => setIsContentManagerOpen(false)}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Student Purchases Modal */}
      <MyPurchasesModal
        isOpen={isPurchasesOpen}
        onClose={() => setIsPurchasesOpen(false)}
      />
    </>
  );
}
