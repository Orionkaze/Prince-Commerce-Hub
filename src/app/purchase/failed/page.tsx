"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { AlertCircle, ArrowLeft, RefreshCw, HelpCircle, Loader2 } from "lucide-react";

function PurchaseFailedContent() {
  const searchParams = useSearchParams();
  const errorMsg = searchParams.get("error") || "Transaction could not be completed or was cancelled.";

  return (
    <div className="min-h-screen bg-[#F7F7F9] text-[#16141B] flex flex-col font-sans">
      <Navbar onOpenContact={() => {}} />

      <main className="flex-1 flex items-center justify-center p-4 pt-32 pb-20">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-md shadow-rose-500/10">
            <AlertCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
              Transaction Incomplete
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#16141B] tracking-tight">
              Payment Not Completed
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              {errorMsg}
            </p>
          </div>

          <p className="text-xs text-gray-400">
            No funds have been debited for this attempt. If amount was deducted, Razorpay will initiate an automatic reversal within 3-5 business days.
          </p>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/courses"
              className="w-full py-3.5 px-6 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#5B32D6]/20 transition"
            >
              <RefreshCw className="w-4 h-4 text-[#FDE047]" />
              <span>Retry Payment</span>
            </Link>
            <Link
              href="/"
              className="py-3 px-6 rounded-full border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>

      <CtaAndFooter onOpenContact={() => {}} />
    </div>
  );
}

export default function PurchaseFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
        </div>
      }
    >
      <PurchaseFailedContent />
    </Suspense>
  );
}
