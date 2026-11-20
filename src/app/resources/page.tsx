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
  FileText,
  Download,
  BookOpen,
  CheckCircle2,
  Filter,
  FileCheck,
  Calculator,
  Layers,
  ArrowDownToLine,
} from "lucide-react";
import { motion } from "framer-motion";

interface ResourceItem {
  id: string;
  title: string;
  category: "Class 11" | "Class 12" | "Notes" | "PDF Materials" | "Practice";
  categoryLabel: string;
  description: string;
  fileFormat: string;
}

export default function ResourcesPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [downloadNotified, setDownloadNotified] = useState<string | null>(null);

  const categories = [
    "All",
    "Class 11 Resources",
    "Class 12 Resources",
    "Accountancy Notes",
    "PDF Study Materials",
    "Practice Materials",
  ];

  const resources: ResourceItem[] = [
    {
      id: "res-1",
      title: "Class 11: Rules of Debit & Credit Quick Reference Chart",
      category: "Class 11",
      categoryLabel: "Class 11 Resources",
      description:
        "A clear, structured visual reference chart categorizing traditional rules (Personal, Real, Nominal) alongside modern classification (Assets, Liabilities, Capital, Revenue, Expenses).",
      fileFormat: "PDF Summary",
    },
    {
      id: "res-2",
      title: "Class 12: Partnership Accounts — Goodwill Valuation & Revaluation Notes",
      category: "Class 12",
      categoryLabel: "Class 12 Resources",
      description:
        "Comprehensive formula sheet and adjustment templates for Average Profits, Super Profits, Capitalization methods, and revaluation account journal sequences.",
      fileFormat: "PDF Notes",
    },
    {
      id: "res-3",
      title: "Cash Flow Statement (AS-3 Revised) Format & Working Notes Template",
      category: "Notes",
      categoryLabel: "Accountancy Notes",
      description:
        "Step-by-step master format for Operating, Investing, and Financing activities, including provision for tax and proposed dividend treatment guidelines.",
      fileFormat: "Format Sheet",
    },
    {
      id: "res-4",
      title: "Company Accounts: Issue of Shares & Pro-Rata Table Guide",
      category: "PDF Materials",
      categoryLabel: "PDF Study Materials",
      description:
        "Essential multi-step pro-rata calculation tables and forfeiture/reissue journal entries structured to prevent common numerical errors.",
      fileFormat: "PDF Guide",
    },
    {
      id: "res-5",
      title: "Class 11: Bank Reconciliation Statement (BRS) Logic Matrix",
      category: "Class 11",
      categoryLabel: "Class 11 Resources",
      description:
        "Logical plus/minus chart for favorable vs. overdraft balances in Passbook and Cash Book, built to resolve reconciliation doubts quickly.",
      fileFormat: "Study Matrix",
    },
    {
      id: "res-6",
      title: "Board Exam Presentation & Time Management Checklist",
      category: "Practice",
      categoryLabel: "Practice Materials",
      description:
        "Official guidelines for margin drawing, ledger formatting, narration writing, and marks-per-minute pacing in board examination conditions.",
      fileFormat: "Checklist PDF",
    },
  ];

  const filteredResources =
    selectedFilter === "All"
      ? resources
      : resources.filter(
          (r) =>
            r.categoryLabel.toLowerCase() === selectedFilter.toLowerCase() ||
            r.category.toLowerCase() === selectedFilter.toLowerCase()
        );

  const handleDownload = (id: string, title: string) => {
    setDownloadNotified(id);
    setTimeout(() => {
      setDownloadNotified(null);
    }, 2800);
  };

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
              <Badge variant="yellow">STUDY LIBRARY</Badge>
            </div>
            <h1 className="text-[38px] sm:text-[52px] lg:text-[64px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white max-w-[850px]">
              Free Learning Resources
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.6] text-white/85 max-w-[700px] font-normal">
              Access educational materials and study resources designed to support your Accountancy preparation.
            </p>
          </div>
        </section>

        {/* ================= Filter Tabs & Resource Grid ================= */}
        <section className="py-16 lg:py-24 bg-[#F7F7F9]">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 space-y-12">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                Categories:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedFilter === cat
                      ? "bg-[#5B32D6] text-white shadow-md"
                      : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredResources.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white rounded-[28px] p-7 sm:p-8 border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon & Category */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-neutral-100 text-neutral-700">
                        {item.categoryLabel}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-[#16141B] tracking-tight leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Bottom / Download Action */}
                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      {item.fileFormat}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDownload(item.id, item.title)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all bg-[#ECE8FA] text-[#5B32D6] hover:bg-[#5B32D6] hover:text-white cursor-pointer"
                    >
                      {downloadNotified === item.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Ready Soon!</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownToLine className="w-3.5 h-3.5" />
                          <span>Get Resource</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Future Uploads Notice Box */}
            <div className="p-8 rounded-[28px] bg-white border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-[#16141B]">
                  Looking for chapter-specific revision notes?
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600">
                  New chapter worksheets, question banks, and answer keys are uploaded regularly for registered students.
                </p>
              </div>
              <Link href="/contact" className="shrink-0">
                <Button variant="purple" size="md">
                  Request Study Material
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
