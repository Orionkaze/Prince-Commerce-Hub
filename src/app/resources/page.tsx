"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { ContactModal } from "@/components/footer/ContactModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ResourceRecord, LectureRecord } from "@/types/lms";
import { initialResources } from "@/lib/lms/content";
import { LecturePlayerModal } from "@/components/player/LecturePlayerModal";
import {
  FileText,
  Download,
  BookOpen,
  CheckCircle2,
  Filter,
  Play,
  FileCheck,
  Video,
  Layers,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ResourcesPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [resources, setResources] = useState<ResourceRecord[]>(initialResources);
  const [freeLectures, setFreeLectures] = useState<LectureRecord[]>([]);
  const [downloadNotified, setDownloadNotified] = useState<string | null>(null);
  const [activePlayerLecture, setActivePlayerLecture] = useState<LectureRecord | null>(null);

  const categories = [
    "All",
    "Free Lectures",
    "Class 11 Resources",
    "Class 12 Resources",
    "Accountancy Notes",
    "PDF Study Materials",
    "Practice Materials",
  ];

  // Fetch dynamic free content from Supabase
  useEffect(() => {
    fetch("/api/content/manage")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.resources && data.resources.length > 0) {
          const existingKeys = new Set(data.resources.map((r: any) => r.file_key));
          const merged = [
            ...data.resources.filter((r: any) => r.access_type === "free" && r.is_published),
            ...initialResources.filter((r) => !existingKeys.has(r.file_key)),
          ];
          setResources(merged);
        }
        if (data.lectures) {
          const free = data.lectures.filter(
            (l: LectureRecord) => l.access_type === "free" && l.is_published
          );
          setFreeLectures(free);
        }
      })
      .catch((err) => console.warn("Using offline resource cache:", err));
  }, []);

  const handleDownload = async (resourceId: string, title: string) => {
    setDownloadNotified(resourceId);

    try {
      const res = await fetch(`/api/content/access?type=resource&id=${resourceId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.downloadUrl) {
          const link = document.createElement("a");
          link.href = data.downloadUrl;
          link.download = `${title}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (err) {
      console.warn("Download fallback");
    }

    setTimeout(() => {
      setDownloadNotified(null);
    }, 2800);
  };

  const filteredResources =
    selectedFilter === "All"
      ? resources
      : selectedFilter === "Free Lectures"
      ? []
      : resources.filter(
          (r) =>
            r.category_label?.toLowerCase().includes(selectedFilter.toLowerCase()) ||
            selectedFilter.toLowerCase().includes((r.category_label || "").toLowerCase())
        );

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
              <Badge variant="yellow">FREE STUDY LIBRARY &amp; LECTURES</Badge>
            </div>
            <h1 className="text-[38px] sm:text-[52px] lg:text-[64px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white max-w-[850px]">
              Free Learning Resources
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.6] text-white/85 max-w-[700px] font-normal">
              Access educational materials, recorded sessions, and PDF formula sheets designed to support your Accountancy preparation without any paywall.
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

            {/* Free Video Lectures (if selected or All) */}
            {(selectedFilter === "All" || selectedFilter === "Free Lectures") &&
              freeLectures.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#5B32D6]" />
                    <h2 className="text-2xl font-extrabold text-[#16141B]">
                      Free Recorded Lectures &amp; Masterclasses
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {freeLectures.map((lec) => (
                      <div
                        key={lec.id}
                        className="bg-white rounded-[28px] p-6 border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                              Free Video Lecture
                            </span>
                            <span className="text-xs text-neutral-400 font-semibold">
                              {lec.duration || "40 mins"}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-[#16141B]">{lec.title}</h3>
                          <p className="text-xs text-neutral-500">
                            {lec.description || "Free conceptual session with Parvesh Sir."}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                          <span className="text-xs text-[#5B32D6] font-bold">No Paywall</span>
                          <Button
                            variant="purple"
                            size="sm"
                            className="gap-2"
                            onClick={() => setActivePlayerLecture(lec)}
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Watch Free</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* PDF & Study Notes Grid */}
            {selectedFilter !== "Free Lectures" && (
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
                          {item.category_label || "Study Material"}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-[#16141B] tracking-tight leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom Row: Format & Download Button */}
                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-400">
                        {item.file_format || "PDF Document"}
                      </span>

                      <Button
                        variant={downloadNotified === item.id ? "white" : "purple"}
                        size="sm"
                        className="gap-2 cursor-pointer"
                        onClick={() => handleDownload(item.id, item.title)}
                      >
                        {downloadNotified === item.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Free</span>
                          </>
                        )}
                      </Button>
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

      {/* Free Lecture Video Player Modal */}
      <LecturePlayerModal
        isOpen={Boolean(activePlayerLecture)}
        onClose={() => setActivePlayerLecture(null)}
        lecture={activePlayerLecture}
      />
    </div>
  );
}
