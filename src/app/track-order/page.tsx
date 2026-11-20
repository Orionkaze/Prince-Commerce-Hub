"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [searchedId, setSearchedId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsLoading(true);
    setSearchedId(orderId.trim());

    setTimeout(() => {
      setIsLoading(false);
      setHasSearched(true);
    }, 700);
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
              <Badge variant="yellow">STUDY MATERIAL DISPATCH</Badge>
            </div>
            <h1 className="text-[38px] sm:text-[52px] lg:text-[64px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white max-w-[850px]">
              Track Your Course Order
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.6] text-white/85 max-w-[700px] font-normal">
              Check the dispatch, delivery status, and activation details for your Prime Commerce Hub study materials, printed formula booklets, and course packs.
            </p>
          </div>
        </section>

        {/* Tracking Interface Section */}
        <section className="py-20 lg:py-28 bg-[#F7F7F9]">
          <div className="max-w-[840px] mx-auto px-5 sm:px-8 lg:px-10 space-y-12">
            {/* Input Form Card */}
            <div className="bg-white p-8 sm:p-12 rounded-[32px] border border-neutral-200/80 shadow-xl space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B32D6]">
                  <Package className="w-4 h-4" />
                  <span>Order Tracking Portal</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16141B]">
                  Enter Your Order or Enrollment ID
                </h2>
                <p className="text-sm text-neutral-600">
                  Please provide the order reference sent to your registered email upon enrolling in a batch or ordering hardcopy study packages.
                </p>
              </div>

              <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. PCH-2026-8941"
                    className="w-full px-5 py-3.5 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-[#16141B] uppercase tracking-wider font-semibold placeholder:normal-case placeholder:font-normal"
                  />
                </div>
                <Button
                  variant="purple"
                  size="lg"
                  className="gap-2 justify-center cursor-pointer"
                >
                  {isLoading ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Track Status</span>
                    </>
                  )}
                </Button>
              </form>

              <div className="pt-2 flex items-center gap-2 text-xs text-neutral-500">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Format: PCH-YYYY-XXXX. Cannot find your Order ID? Check your enrollment confirmation email.</span>
              </div>
            </div>

            {/* Order Status Display Area (Backend Ready) */}
            {hasSearched ? (
              <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-neutral-200/80 shadow-md space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Queried Reference
                    </span>
                    <div className="text-xl font-extrabold text-[#16141B]">
                      {searchedId}
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E]">
                    Processing Record
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-[#F7F7F9] space-y-3 text-sm text-neutral-700">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#5B32D6] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#16141B]">Status: Order Verified in Registry</div>
                      <div className="text-xs text-neutral-500 pt-0.5">
                        Your study material package is being processed at the central dispatch desk. Tracking updates refresh automatically every 12 hours.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center text-xs text-neutral-500">
                  Need expedited delivery or have batch-timing inquiries?{" "}
                  <Link href="/contact" className="text-[#5B32D6] font-bold underline">
                    Contact Admissions Desk
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-[28px] bg-white border border-dashed border-neutral-300 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center mx-auto">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#16141B]">
                  No Active Tracking Query Yet
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
                  Enter your Order ID above to check courier tracking numbers, dispatch dates, and printed module delivery milestones.
                </p>
              </div>
            )}
          </div>
        </section>

        <CtaAndFooter />
      </main>
    </div>
  );
}
