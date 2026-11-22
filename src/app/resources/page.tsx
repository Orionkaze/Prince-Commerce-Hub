"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { ContactModal } from "@/components/footer/ContactModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Download,
  BookOpen,
  Filter,
  CheckCircle2,
  ArrowDownToLine,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

interface ResourceItem {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  description: string;
  fileFormat: string;
  fileUrl?: string | null;
}

export default function ResourcesPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [downloadNotified, setDownloadNotified] = useState<string | null>(null);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "All",
    "Class 11 Resources",
    "Class 12 Resources",
    "Accountancy Notes",
    "PDF Study Materials",
    "Practice Materials",
  ];

  useEffect(() => {
    async function loadResources() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("resources")
          .select("*")
          .order("created_at", { ascending: false });

        if (data && !error && data.length > 0) {
          const mapped: ResourceItem[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category || "General",
            categoryLabel: item.category_label || item.category || "General",
            description: item.description || "",
            fileFormat: item.file_format || "PDF",
            fileUrl: item.file_url || null,
          }));
          setResources(mapped);
        } else {
          setResources([]);
        }
      } catch (err) {
        console.error("Error fetching resources from database:", err);
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadResources();
  }, []);

  const filteredResources =
    selectedFilter === "All"
      ? resources
      : resources.filter(
          (r) =>
            r.categoryLabel.toLowerCase() === selectedFilter.toLowerCase() ||
            r.category.toLowerCase() === selectedFilter.toLowerCase()
        );

  const handleDownload = (id: string) => {
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

            {/* Resources Grid or Loading / Empty */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#5B32D6]" />
                <p className="text-sm font-semibold text-neutral-500">Loading resources...</p>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="bg-white rounded-[32px] p-12 text-center border border-dashed border-neutral-300 max-w-lg mx-auto space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center mx-auto">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-[#16141B]">No Resources Available</h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  There are currently no free study materials found in this category. Resources added via the database will appear here.
                </p>
              </div>
            ) : (
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

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-400">
                        {item.fileFormat}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDownload(item.id)}
                        className="px-4 py-2 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {downloadNotified === item.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <ArrowDownToLine className="w-3.5 h-3.5" />
                            <span>Download Free</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
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
