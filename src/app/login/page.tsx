"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  LogOut,
  User,
  GraduationCap,
} from "lucide-react";

export function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 5c1.54 0 2.94.53 4.04 1.57l3.03-3.03C17.24 1.8 14.8 1 12 1 7.42 1 3.51 3.6 1.63 7.37l3.69 2.87C6.2 7.42 8.87 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.49 12.28c0-.79-.07-1.54-.19-2.28H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.71-4.93 3.71-8.69z"
      />
      <path
        fill="#FBBC05"
        d="M5.32 14.76c-.23-.68-.36-1.41-.36-2.16s.13-1.48.36-2.16L1.63 7.37C.6 9.42 0 11.64 0 12s.6 2.58 1.63 4.63l3.69-2.87z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.08.72-2.45 1.16-4.22 1.16-3.13 0-5.8-2.42-6.68-5.24L1.63 15.99C3.51 19.76 7.42 23 12 23z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { user, isLoading, isConfigured, signInWithGoogle, signOut } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);

    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMessage(error.message);
      setIsSigningIn(false);
    }
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
              Sign in with your Google account for 1-click access to your enrolled Accountancy batches, live sessions, revision notes, and test evaluations.
            </p>
          </div>
        </section>

        {/* Login Section */}
        <section className="py-20 lg:py-28 bg-[#F7F7F9]">
          <div className="max-w-[520px] mx-auto px-5 sm:px-8">
            <div className="bg-white p-8 sm:p-12 rounded-[32px] border border-neutral-200/80 shadow-xl space-y-8">
              {/* Header Logo & Title */}
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
                  Accountancy Batches for Class 11th &amp; 12th by Parvesh Kumar
                </p>
              </div>

              {/* Already Logged In State */}
              {user ? (
                <div className="space-y-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center mx-auto overflow-hidden">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Authenticated</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#16141B]">
                      {user.user_metadata?.full_name || user.email}
                    </h3>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F7F7F9] text-xs text-neutral-700 text-left space-y-2">
                    <div className="font-bold text-[#16141B] flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#5B32D6]" />
                      <span>Student Hub Status</span>
                    </div>
                    <div>You are currently signed in. You can now enroll in courses or access course materials.</div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <Button href="/courses" variant="purple" size="md" className="w-full justify-center">
                      Browse Enrolled Batches
                    </Button>
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="w-full py-2.5 px-4 rounded-full border border-neutral-200 text-neutral-600 hover:text-neutral-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Google Sign In Flow */
                <div className="space-y-6">
                  {errorMessage && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-1 leading-relaxed">
                        <div className="font-bold">Notice:</div>
                        <div>{errorMessage}</div>
                      </div>
                    </div>
                  )}

                  {/* The Single Google Login Button */}
                  <div>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isSigningIn}
                      className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-neutral-50 text-[#16141B] font-bold text-sm sm:text-base border-2 border-neutral-200 hover:border-[#5B32D6] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3.5 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
                    >
                      <GoogleLogo className="w-5 h-5 shrink-0" />
                      <span>{isSigningIn ? "Connecting to Google..." : "Continue with Google"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Support Footer */}
              <div className="pt-6 border-t border-neutral-100 text-center space-y-2 text-xs text-neutral-500">
                <div>
                  New student?{" "}
                  <Link href="/courses" className="text-[#5B32D6] font-bold underline">
                    Explore Batches &amp; Admissions
                  </Link>
                </div>
                <div>
                  Need enrollment help?{" "}
                  <a href="mailto:parveshdhiman1900@gmail.com" className="text-neutral-700 underline font-medium">
                    parveshdhiman1900@gmail.com
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
