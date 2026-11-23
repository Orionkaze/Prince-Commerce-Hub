"use client";

import React, { use, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { CheckCircle2, Play, ArrowRight, BookOpen, ShieldCheck, Loader2 } from "lucide-react";

function PurchaseSuccessContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") || "class-12";
  const paymentId = searchParams.get("paymentId") || "PAY_CONFIRMED";

  return (
    <div className="min-h-screen bg-[#F7F7F9] text-[#16141B] flex flex-col font-sans">
      <Navbar onOpenContact={() => {}} />

      <main className="flex-1 flex items-center justify-center p-4 pt-32 pb-20">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/90 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-md shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" /> Payment Verified
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#16141B] tracking-tight">
              Enrollment Confirmed!
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Congratulations! Your course access is activated. A receipt and confirmation email has been sent to your registered email address.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F7F9] border border-gray-100 text-left text-xs space-y-2 font-medium">
            <div className="flex justify-between">
              <span className="text-gray-400">Transaction ID:</span>
              <span className="font-mono font-bold text-[#16141B]">{paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Course Identifier:</span>
              <span className="font-bold text-[#16141B]">{courseId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Access Type:</span>
              <span className="font-bold text-emerald-600">Full Batch + Recordings</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/learn/${courseId}/first`}
              className="flex-1 py-3.5 px-6 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#5B32D6]/20 transition"
            >
              <Play className="w-4 h-4 fill-current text-[#FDE047]" />
              <span>Start Learning Now</span>
            </Link>
            <Link
              href="/dashboard"
              className="py-3.5 px-6 rounded-full border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </main>

      <CtaAndFooter onOpenContact={() => {}} />
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#5B32D6]" />
        </div>
      }
    >
      <PurchaseSuccessContent />
    </Suspense>
  );
}
