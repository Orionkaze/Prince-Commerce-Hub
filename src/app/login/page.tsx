"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setAuthNotice(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setAuthNotice(
        "Authentication service initialized. For student batch access credentials or account activation, please contact your Prime Commerce Hub course coordinator."
      );
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white text-[#16141B] flex flex-col font-sans selection:bg-[#FDE047] selection:text-[#16141B]">
      <Navbar />

      <main className="flex-1">
        {/* Page Hero Header */}
        <section
          className="relative overflow-hidden py-16 sm:py-20 lg:py-24 text-white"
          style={{
            background: "linear-gradient(135deg, #4E2EC2 0%, #371B94 55%, #241068 100%)",
          }}
        >
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 relative z-10 space-y-5">
            <div>
              <Badge variant="yellow">STUDENT PORTAL</Badge>
            </div>
            <h1 className="text-[38px] sm:text-[52px] lg:text-[64px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white max-w-[850px]">
              Student &amp; Member Login
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.6] text-white/85 max-w-[700px] font-normal">
              Access your enrolled Accountancy batch dashboard, class recordings, revision notes, and test evaluations.
            </p>
          </div>
        </section>

        {/* Login Form Section */}
        <section className="py-20 lg:py-28 bg-[#F7F7F9]">
          <div className="max-w-[560px] mx-auto px-5 sm:px-8">
            <div className="bg-white p-8 sm:p-12 rounded-[32px] border border-neutral-200/80 shadow-xl space-y-8">
              <div className="text-center space-y-2">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-neutral-200 mx-auto bg-white mb-3">
                  <Image
                    src="/images/prime-commerce-hub-logo.jpg"
                    alt="Prime Commerce Hub"
                    fill
                    className="object-contain"
                    sizes="48px"
                  />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16141B] tracking-tight">
                  Welcome to Prime Commerce Hub
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500">
                  Enter your registered student credentials to continue
                </p>
              </div>

              {authNotice && (
                <div className="p-4 rounded-2xl bg-[#ECE8FA] border border-[#DDD6FE] text-xs text-neutral-700 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-[#5B32D6] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{authNotice}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                    Student Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-[#16141B]"
                    />
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setAuthNotice(
                          "To reset your password, please contact the Prime Commerce Hub administrative desk at contact@primecommercehub.com with your student enrollment ID."
                        )
                      }
                      className="text-xs font-semibold text-[#5B32D6] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-11 pr-11 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-[#16141B]"
                    />
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-neutral-300 text-[#5B32D6] focus:ring-[#5B32D6]"
                    />
                    <span className="text-xs font-medium text-neutral-600">
                      Remember this browser
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <Button
                    variant="purple"
                    size="lg"
                    className="w-full justify-center cursor-pointer"
                  >
                    {isSubmitting ? "Authenticating..." : "Sign In to Portal"}
                  </Button>
                </div>
              </form>

              <div className="pt-4 border-t border-neutral-100 text-center space-y-2 text-xs text-neutral-500">
                <div>
                  New to Prime Commerce Hub?{" "}
                  <Link href="/contact" className="text-[#5B32D6] font-bold underline">
                    Inquire for New Batch Admission
                  </Link>
                </div>
                <div>
                  Need technical assistance?{" "}
                  <a href="mailto:contact@primecommercehub.com" className="text-neutral-700 underline font-medium">
                    contact@primecommercehub.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CtaAndFooter />
      </main>
    </div>
  );
}
