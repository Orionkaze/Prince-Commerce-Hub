"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ContactModal } from "./ContactModal";
import { Check, Mail } from "lucide-react";
import { motion } from "framer-motion";

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
    { name: "Blog", href: "#reviews" },
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
                Tell me what you want to improve, and I'll help you choose the
                right course, starting level, and learning format.
              </p>

              <div className="pt-2">
                <Button variant="white" size="lg" onClick={onOpenContact}>
                  Contact Jave
                </Button>
              </div>
            </div>

            {/* Right Column: Jave Photo with Nameplate */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] h-[340px] sm:h-[400px] rounded-[28px] overflow-hidden bg-neutral-800 shadow-2xl border border-white/10 group">
                <Image
                  src="/images/cta-jave.jpg"
                  alt="Jave Carter smiling ready to help you learn English"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.95]"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Nameplate at bottom left */}
                <div className="absolute bottom-6 left-6 z-10">
                  <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Jave Carter
                  </div>
                  <div className="text-xs text-white/70 font-medium">
                    CELTA Certified · Dublin, Ireland
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
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Jave English
              </h3>

              <p className="text-[15px] sm:text-[16px] text-white/70 leading-relaxed max-w-[440px]">
                Practical online English lessons with Jave Carter — small groups
                and private 1-on-1 lessons.
              </p>

              <div className="pt-2 space-y-3">
                <div className="text-[13px] text-white/80 font-medium">
                  Subscribe to get an email when I share a new English tip,
                  lesson, or video.
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
                href="mailto:hello@mrjaveenglish.com"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white hover:text-[#FDE047] transition-colors break-all tracking-tight"
              >
                hello@mrjaveenglish.com
              </a>

              <a
                href="https://wa.me"
                target="_blank"
                rel="noreferrer"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white/90 hover:text-emerald-400 transition-colors tracking-tight"
              >
                Whatsapp
              </a>

              <a
                href="https://messenger.com"
                target="_blank"
                rel="noreferrer"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white/90 hover:text-blue-400 transition-colors tracking-tight"
              >
                Messenger
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white/90 hover:text-red-400 transition-colors tracking-tight"
              >
                Youtube Channel
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
            <div>© 2026 Jave English. All rights reserved.</div>

            <div className="flex items-center gap-6">
              <span>Created by RedSignal.Red</span>
              <a href="#privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-white transition-colors">
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
