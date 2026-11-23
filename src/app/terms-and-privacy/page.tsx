"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldCheck,
  FileText,
  RotateCcw,
  Lock,
  Mail,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function TermsAndPrivacyPage() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy" | "refund">("terms");

  return (
    <div className="min-h-screen bg-white text-[#16141B] flex flex-col font-sans selection:bg-[#FDE047] selection:text-[#16141B]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Header */}
        <section
          className="relative overflow-hidden py-16 sm:py-20 lg:py-24 text-white"
          style={{
            background: "linear-gradient(135deg, #4E2EC2 0%, #371B94 55%, #241068 100%)",
          }}
        >
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 relative z-10 space-y-5">
            <div>
              <Badge variant="yellow">LEGAL &amp; COMPLIANCE</Badge>
            </div>
            <h1 className="text-[38px] sm:text-[52px] lg:text-[60px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white max-w-[850px]">
              Privacy Policy &amp; Terms of Service
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.6] text-white/85 max-w-[700px] font-normal">
              Clear, transparent terms regarding your enrollment, privacy, study materials, and student rights at Prime Commerce Hub.
            </p>
            <div className="text-xs text-white/60 font-medium pt-2">
              Last Updated: November 2026 • Effective Date: January 1, 2026
            </div>
          </div>
        </section>

        {/* Content Section with Sticky Navigation */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F7F7F9]">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
            {/* Tabs Selector */}
            <div className="flex flex-wrap items-center gap-3 pb-8 mb-8 border-b border-neutral-200">
              <button
                type="button"
                onClick={() => setActiveTab("terms")}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "terms"
                    ? "bg-[#5B32D6] text-white shadow-md shadow-[#5B32D6]/20"
                    : "bg-white text-neutral-600 hover:text-[#16141B] border border-neutral-200"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Terms of Service</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("privacy")}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "privacy"
                    ? "bg-[#5B32D6] text-white shadow-md shadow-[#5B32D6]/20"
                    : "bg-white text-neutral-600 hover:text-[#16141B] border border-neutral-200"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Privacy Policy</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("refund")}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "refund"
                    ? "bg-[#5B32D6] text-white shadow-md shadow-[#5B32D6]/20"
                    : "bg-white text-neutral-600 hover:text-[#16141B] border border-neutral-200"
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Cancellation &amp; Refund Policy</span>
              </button>
            </div>

            {/* Main Policy Card Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Document Body */}
              <div className="lg:col-span-8 bg-white rounded-[32px] p-8 sm:p-12 border border-neutral-200/80 shadow-md space-y-10 text-neutral-700 leading-relaxed">
                {/* 1. TERMS OF SERVICE */}
                {activeTab === "terms" && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16141B] tracking-tight">
                        Terms of Service
                      </h2>
                      <p className="text-sm text-neutral-500 mt-1">
                        Please review these terms before enrolling in courses or accessing our learning materials.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#16141B] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#ECE8FA] text-[#5B32D6] text-xs flex items-center justify-center font-extrabold">1</span>
                        <span>Acceptance of Terms</span>
                      </h3>
                      <p className="text-sm text-neutral-600">
                        By visiting, accessing, or enrolling in educational programs on Prime Commerce Hub (primecommerceclasses.com), you agree to be bound by these Terms of Service, applicable laws, and regulations. If you disagree with any part of these terms, you are prohibited from accessing the website and its educational resources.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#16141B] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#ECE8FA] text-[#5B32D6] text-xs flex items-center justify-center font-extrabold">2</span>
                        <span>Educational Offerings &amp; Course Access</span>
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Prime Commerce Hub provides online coaching, crash courses, foundation modules, revision notes, and doubt-clearing sessions primarily focused on Class 11th and 12th Commerce Accountancy curriculum, led by Parvesh Kumar. Enrolled students are granted a limited, personal, non-exclusive, non-transferable license to view lectures and download designated PDF notes for individual academic preparation.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#16141B] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#ECE8FA] text-[#5B32D6] text-xs flex items-center justify-center font-extrabold">3</span>
                        <span>Intellectual Property &amp; Copyright</span>
                      </h3>
                      <p className="text-sm text-neutral-600">
                        All instructional content, including recorded video lectures, proprietary balance sheet templates, question banks, study notes, branding, logos, and course designs, are the intellectual property of Prime Commerce Hub and Parvesh Kumar. Unauthorized copying, recording, redistributing, reselling, or public broadcasting of any material is strictly prohibited and subject to legal action under the Indian Copyright Act.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#16141B] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#ECE8FA] text-[#5B32D6] text-xs flex items-center justify-center font-extrabold">4</span>
                        <span>Student Conduct &amp; Account Security</span>
                      </h3>
                      <ul className="text-sm text-neutral-600 space-y-2 list-disc list-inside">
                        <li>Students must maintain the confidentiality of their login credentials (Google Authentication).</li>
                        <li>Account sharing or credential distribution among multiple individuals is not allowed and will result in immediate termination of batch access.</li>
                        <li>Students must participate respectfully during live sessions, doubt webinars, and discussions.</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#16141B] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#ECE8FA] text-[#5B32D6] text-xs flex items-center justify-center font-extrabold">5</span>
                        <span>Fee Payment &amp; Payment Gateway</span>
                      </h3>
                      <p className="text-sm text-neutral-600">
                        All course enrollment fees are clearly stated in Indian Rupees (INR) and processed securely through Razorpay. Access to batches and study materials is activated automatically upon receipt of successful payment confirmation.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. PRIVACY POLICY */}
                {activeTab === "privacy" && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16141B] tracking-tight">
                        Privacy Policy
                      </h2>
                      <p className="text-sm text-neutral-500 mt-1">
                        How we collect, protect, and responsibly use your personal information.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#16141B] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#ECE8FA] text-[#5B32D6] text-xs flex items-center justify-center font-extrabold">1</span>
                        <span>Information We Collect</span>
                      </h3>
                      <p className="text-sm text-neutral-600">
                        We collect only the minimum necessary information to deliver high-quality educational services:
                      </p>
                      <ul className="text-sm text-neutral-600 space-y-2 list-disc list-inside">
                        <li><strong>Account Details:</strong> Name, email address, and profile photo provided via Google OAuth sign-in.</li>
                        <li><strong>Enrollment Information:</strong> Selected course batches, class grade (Class 11 or 12), state of residence, and contact phone number.</li>
                        <li><strong>Transaction Records:</strong> Razorpay payment identifiers, transaction dates, and purchased batch history (we never store debit/credit card numbers or banking passwords).</li>
                        <li><strong>Learning Progress:</strong> Completed lectures, assignment submissions, and test performance.</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#16141B] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#ECE8FA] text-[#5B32D6] text-xs flex items-center justify-center font-extrabold">2</span>
                        <span>How We Use Your Information</span>
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Your information is used strictly to provide course access, generate invoices/receipts, send batch schedule notifications, provide academic support, and prevent unauthorized account access. We do not sell, rent, or trade student data with third-party marketers or advertisers.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#16141B] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#ECE8FA] text-[#5B32D6] text-xs flex items-center justify-center font-extrabold">3</span>
                        <span>Data Security &amp; Storage</span>
                      </h3>
                      <p className="text-sm text-neutral-600">
                        All student data is stored using industry-standard encryption protocols. Authentication and database records are managed via Supabase, while video lectures and educational resources are securely delivered through Cloudflare R2 infrastructure.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#16141B] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#ECE8FA] text-[#5B32D6] text-xs flex items-center justify-center font-extrabold">4</span>
                        <span>Cookies &amp; Local Storage</span>
                      </h3>
                      <p className="text-sm text-neutral-600">
                        We utilize essential authentication cookies and secure local storage solely to keep you signed in to your student dashboard across visits. You can control cookie preferences in your browser settings.
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. REFUND POLICY */}
                {activeTab === "refund" && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16141B] tracking-tight">
                        Cancellation &amp; Refund Policy
                      </h2>
                      <p className="text-sm text-neutral-500 mt-1">
                        Clear terms regarding enrollments, course batch bookings, and refund eligibility.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#16141B] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#ECE8FA] text-[#5B32D6] text-xs flex items-center justify-center font-extrabold">1</span>
                        <span>Digital Courses &amp; Crash Course Access</span>
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Due to the digital nature of recorded lecture materials, study notes, and instant access to proprietary course content, course fees are generally non-refundable once content access has been granted and activated on your account.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#16141B] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#ECE8FA] text-[#5B32D6] text-xs flex items-center justify-center font-extrabold">2</span>
                        <span>Duplicate or Erroneous Transactions</span>
                      </h3>
                      <p className="text-sm text-neutral-600">
                        If an accidental duplicate payment occurs for the same course or batch due to network delays or gateway glitches, the duplicate amount will be refunded in full back to the original payment method within 5 to 7 business days upon verification.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-[#16141B] flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#ECE8FA] text-[#5B32D6] text-xs flex items-center justify-center font-extrabold">3</span>
                        <span>Batch Transfer Requests</span>
                      </h3>
                      <p className="text-sm text-neutral-600">
                        Students who wish to change their batch timing or transfer to an alternative course offering may request an adjustment within 7 days of enrollment by emailing support.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Quick Info */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#16141B]">Have Questions?</h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      If you have any questions regarding these terms, enrollment details, or privacy practices, feel free to reach out directly.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex items-center gap-3 text-neutral-700">
                      <Mail className="w-4 h-4 text-[#5B32D6] shrink-0" />
                      <a href="mailto:parveshdhiman1900@gmail.com" className="font-semibold hover:underline">
                        parveshdhiman1900@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-700">
                      <Lock className="w-4 h-4 text-[#5B32D6] shrink-0" />
                      <span>Punjab, India</span>
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#5B32D6] text-white text-xs font-bold hover:bg-[#4E2EC2] transition cursor-pointer shadow-xs"
                  >
                    <span>Contact Support</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-6 rounded-[28px] bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-100 text-xs text-neutral-700 space-y-3">
                  <div className="font-bold text-[#16141B] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Academic Standards</span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    Prime Commerce Hub operates in strict accordance with Indian educational compliance and e-commerce consumer guidelines.
                  </p>
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
