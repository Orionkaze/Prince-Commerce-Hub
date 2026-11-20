"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { ContactModal } from "@/components/footer/ContactModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CoursesPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const coursesList = [
    {
      id: "class-11",
      category: "Class 11 Commerce",
      badge: "FOUNDATION MODULE",
      title: "Class 11 Accountancy (Comprehensive Foundation)",
      description:
        "Designed to help students build an unbreakable foundation in financial accounting. Covers basic accounting principles, debit/credit logic, journal entries, ledger posting, trial balance, and financial statements.",
      image: "/images/accountancy-classroom.jpg",
      topics: [
        "Introduction to Accounting & Basic Terms",
        "Theory Base of Accounting & Accounting Standards",
        "Rules of Debit and Credit & Accounting Equation",
        "Journal, Ledger, Cash Book & Subsidiary Books",
        "Bank Reconciliation Statement (BRS)",
        "Trial Balance & Rectification of Errors",
        "Depreciation, Provisions and Reserves",
        "Financial Statements with Adjustments",
      ],
      highlights: [
        "Concept-first methodology eliminating rote learning",
        "NCERT and standard reference book coverage",
        "Step-by-step numerical calculations & ledger formats",
        "Regular chapter-end tests & personalized doubt sessions",
      ],
      mode: "Classroom Batches & Live Interactive Sessions",
    },
    {
      id: "class-12",
      category: "Class 12 Commerce",
      badge: "BOARD EXCELLENCE",
      title: "Class 12 Accountancy (Board Excellence)",
      description:
        "Comprehensive, result-oriented learning module for Class 12 Commerce students aiming for top percentiles and 100/100 in Board Examinations. Thorough coverage of Partnership, Company Accounts, and Financial Analysis.",
      image: "/images/course-work.jpg",
      topics: [
        "Accounting for Partnership Firms — Fundamentals",
        "Goodwill: Nature and Valuation",
        "Change in Profit Sharing Ratio & Revaluation",
        "Admission, Retirement & Death of a Partner",
        "Dissolution of Partnership Firm",
        "Accounting for Share Capital (Issue & Forfeiture)",
        "Issue and Redemption of Debentures",
        "Financial Statement Analysis & Ratio Analysis",
        "Cash Flow Statement (As per AS-3)",
      ],
      highlights: [
        "Comprehensive coverage of CBSE & State Board syllabus",
        "In-depth focus on 6-mark & 8-mark numerical adjustments",
        "Speed, accuracy, and presentation formatting drills",
        "Previous 15 years' board questions & chapter-wise papers",
      ],
      mode: "Classroom Batches & Live Interactive Sessions",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#16141B] flex flex-col font-sans selection:bg-[#FDE047] selection:text-[#16141B]">
      <Navbar onOpenContact={() => setIsContactModalOpen(true)} />

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
              <Badge variant="yellow">ACADEMIC PROGRAMS</Badge>
            </div>
            <h1 className="text-[38px] sm:text-[52px] lg:text-[64px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white max-w-[850px]">
              Explore Our Accountancy Courses
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.6] text-white/85 max-w-[700px] font-normal">
              Comprehensive learning modules designed to help Class 11th and 12th Commerce students develop strong accounting fundamentals and achieve academic excellence.
            </p>
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-20 lg:py-28 bg-[#F7F7F9]">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 space-y-16">
            {coursesList.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white rounded-[32px] overflow-hidden border border-neutral-200/80 shadow-md hover:shadow-xl transition-shadow grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Left Visual Column */}
                <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-neutral-900 overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover object-center brightness-[0.88] hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#FDE047]">
                      {course.category}
                    </span>
                    <div className="text-lg font-bold">{course.mode}</div>
                  </div>
                </div>

                {/* Right Content Column */}
                <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="yellow">{course.badge}</Badge>
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                        {course.category}
                      </span>
                    </div>

                    <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#16141B] tracking-tight leading-snug">
                      {course.title}
                    </h2>

                    <p className="text-[15px] sm:text-[16px] text-neutral-600 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Key Highlights */}
                    <div className="space-y-2.5 pt-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Course Highlights &amp; Methodology
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {course.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-2 text-[13px] text-neutral-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Syllabus Overview */}
                    <div className="space-y-2.5 pt-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Core Syllabus Modules
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {course.topics.slice(0, 6).map((topic, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl bg-[#F7F7F9] text-xs font-semibold text-[#16141B] flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5B32D6]" />
                            <span className="truncate">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA Footer */}
                  <div className="pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-xs text-neutral-500 font-medium">
                      Taught directly by <strong>Parvesh Kumar</strong> (30+ Years Exp)
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href="/contact">
                        <Button variant="purple" size="md" className="gap-2">
                          <span>Inquire &amp; Enroll</span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Additional Note on Course Architecture */}
        <section className="py-16 bg-white border-t border-neutral-100">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 text-center space-y-4">
            <h3 className="text-2xl font-extrabold text-[#16141B]">
              Need Help Choosing the Right Batch?
            </h3>
            <p className="text-neutral-600 max-w-xl mx-auto text-sm leading-relaxed">
              Whether you are transitioning from Class 10 into Commerce or preparing for Class 12 Pre-Boards, our counselors and Parvesh Sir provide personalized course orientation.
            </p>
            <div className="pt-2">
              <Link href="/contact">
                <Button variant="purple" size="md">
                  Request Course Counseling
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <CtaAndFooter onOpenContact={() => setIsContactModalOpen(true)} />
      </main>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
