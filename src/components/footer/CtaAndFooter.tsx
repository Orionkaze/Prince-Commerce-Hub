"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface CtaAndFooterProps {
  onOpenContact?: () => void;
  hideCtaBanner?: boolean;
}

export function CtaAndFooter({ onOpenContact, hideCtaBanner = false }: CtaAndFooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail("");
    }, 2500);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Counseling", href: "/counseling" },
    { name: "Webinars", href: "/webinars" },
    { name: "Free Resources", href: "/resources" },
    { name: "Contact Us", href: "/contact" },

    { name: "Login", href: "/login" },
  ];

  return (
    <footer className="bg-[#16141B] text-white">
      {/* ================= Main Footer ================= */}
      <div className="py-16 lg:py-20">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 space-y-16">
          {/* Top Nav Links Row */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8 border-b border-white/10 pb-8 text-sm font-semibold text-white/80">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Middle 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Brand, description & Newsletter Box */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/20 bg-white">
                  <Image
                    src="/images/prime-commerce-hub-logo.jpg"
                    alt="Prime Commerce Hub Logo"
                    fill
                    className="object-contain p-0.5"
                    sizes="32px"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white whitespace-nowrap">
                  PRIME COMMERCE HUB
                </h3>
              </div>

              <p className="text-[15px] sm:text-[16px] text-white/70 leading-relaxed max-w-[460px]">
                A professional accountancy coaching institute focused on conceptual clarity, personalized student guidance, structured learning and academic excellence for Class 11th and 12th Commerce students.
              </p>

              <div className="pt-2 space-y-3">
                <div className="text-[13px] text-white/80 font-medium">
                  Subscribe to receive accountancy formulas, revision notes, and board exam tips.
                </div>

                <form
                  onSubmit={handleSubscribe}
                  className="flex items-center max-w-[420px] rounded-full bg-white/5 border border-white/20 p-1.5 focus-within:border-white transition-colors"
                >
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="you@example.com"
                    suppressHydrationWarning
                    className="w-full bg-transparent px-4 text-sm text-white placeholder-white/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    suppressHydrationWarning
                    className="px-5 py-2.5 rounded-full bg-white text-[#16141B] text-xs font-bold hover:bg-neutral-200 transition-colors shrink-0 cursor-pointer"
                  >
                    {subscribed ? "Subscribed!" : "Subscribe"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Contact & Quick Links */}
            <div className="lg:col-span-6 flex flex-col space-y-4 lg:pl-12">
              <a
                href="mailto:parveshdhiman1900@gmail.com"
                className="text-xl sm:text-2xl lg:text-[26px] xl:text-[30px] font-extrabold text-white hover:text-[#FDE047] transition-colors whitespace-nowrap tracking-tight block"
              >
                parveshdhiman1900@gmail.com
              </a>

              <Link
                href="/contact"
                className="text-xl sm:text-2xl font-bold text-white/90 hover:text-emerald-400 transition-colors tracking-tight flex items-center gap-2"
              >
                <span>Admission Inquiries</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Open for 2026-27
                </span>
              </Link>

              <Link
                href="/webinars"
                className="text-xl sm:text-2xl font-bold text-white/90 hover:text-[#FDE047] transition-colors tracking-tight"
              >
                Live Concept Webinars
              </Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <div>© 2026 Prime Commerce Hub. All rights reserved. Founded by Parvesh Kumar.</div>

            <div className="flex items-center gap-6">
              <Link href="/about" className="hover:text-white transition-colors">
                About Founder
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Privacy &amp; Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
