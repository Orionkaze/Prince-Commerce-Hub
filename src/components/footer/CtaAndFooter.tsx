"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ContactModal } from "./ContactModal";

interface CtaAndFooterProps {
  onOpenContact: () => void;
}

export function CtaAndFooter({ onOpenContact }: CtaAndFooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail("");
    }, 2000);
  };

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "Courses", href: "#courses" },
    { name: "Schedule", href: "#schedule" },
    { name: "About", href: "#about" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <footer id="contact" className="bg-[#16141B] text-white">
      {/* ================= Final CTA Split Section ================= */}
      <div className="border-b border-white/10 py-20 lg:py-28">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <Badge variant="yellow">LET'S TALK</Badge>
              </div>

              <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white">
                Not sure where <br className="hidden sm:inline" />
                to start? Just ask.
              </h2>

              <p className="text-[16px] sm:text-[18px] leading-[1.6] text-white/80 max-w-[500px] font-normal">
                Tell us about your current class, syllabus, and academic goals. Parvesh Sir will personally guide you to the right batch and structured learning plan.
              </p>

              <div className="pt-2">
                <Button variant="white" size="lg" onClick={onOpenContact}>
                  Contact Us
                </Button>
              </div>
            </div>

            {/* Right Column: Parvesh Kumar Photo with Nameplate */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] h-[340px] sm:h-[400px] rounded-[28px] overflow-hidden bg-neutral-800 shadow-2xl border border-white/10 group">
                <Image
                  src="/images/parvesh-kumar.jpg"
                  alt="Parvesh Kumar — Founder & Lead Educator, Prime Commerce Hub"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700 brightness-[0.95]"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Nameplate at bottom left */}
                <div className="absolute bottom-6 left-6 z-10">
                  <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Parvesh Kumar
                  </div>
                  <div className="text-xs text-white/70 font-medium">
                    Founder &amp; Lead Educator · 30+ Years Teaching Excellence
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Main Footer ================= */}
      <div className="py-16 lg:py-20">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 space-y-16">
          {/* Top Nav Links Row */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-10 border-b border-white/10 pb-8 text-sm font-semibold text-white/80">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Middle 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Brand, description & Newsletter Box */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/20">
                  <Image
                    src="/images/prime-commerce-hub-logo.jpg"
                    alt="Prime Commerce Hub Logo"
                    fill
                    className="object-contain"
                    sizes="40px"
                  />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
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
                    className="w-full bg-transparent px-4 text-sm text-white placeholder-white/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-white text-[#16141B] text-xs font-bold hover:bg-neutral-200 transition-colors shrink-0 cursor-pointer"
                  >
                    {subscribed ? "Subscribed!" : "Subscribe"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Prominent Bold Links */}
            <div className="lg:col-span-6 flex flex-col space-y-4 lg:pl-12">
              <a
                href="mailto:contact@primecommercehub.com"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white hover:text-[#FDE047] transition-colors break-all tracking-tight"
              >
                contact@primecommercehub.com
              </a>

              <a
                href="https://wa.me"
                target="_blank"
                rel="noreferrer"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white/90 hover:text-emerald-400 transition-colors tracking-tight"
              >
                Whatsapp Inquiry
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white/90 hover:text-red-400 transition-colors tracking-tight"
              >
                Youtube Lectures
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white/90 hover:text-pink-400 transition-colors tracking-tight"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <div>© 2026 Prime Commerce Hub. All rights reserved. Founded by Parvesh Kumar.</div>

            <div className="flex items-center gap-6">
              <a href="#privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-white transition-colors">
                Terms of Admission
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
