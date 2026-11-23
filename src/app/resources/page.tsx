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
import { LecturePlayerModal } from "@/components/player/LecturePlayerModal";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Download,
  BookOpen,
  Filter,
  CheckCircle2,
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
  const [resources, setResources] = useState<ResourceRecord[]>([]);
  const [freeLectures, setFreeLectures] = useState<LectureRecord[]>([]);
  const [downloadNotified, setDownloadNotified] = useState<string | null>(null);
  const [activePlayerLecture, setActivePlayerLecture] = useState<LectureRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamically derive category filter pills from database records
  const dynamicCategories = Array.from(
    new Set(
      resources
        .map((r) => r.category_label?.trim())
        .filter((cat): cat is string => Boolean(cat && cat.length > 0))
    )
  );
  const categories = Array.from(new Set(["All", "Free Lectures", ...dynamicCategories]));

  // Fetch dynamic free content from Supabase / API (strictly dynamic, no hardcoded mock data)
  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // 1. Fetch free published resources from Supabase
        const { data: resData } = await supabase
          .from("resources")
          .select("*")
          .eq("access_type", "free")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (resData) {
          setResources(resData);
        } else {
          setResources([]);
        }

        // 2. Fetch free video lectures from Supabase
        const { data: lecData } = await supabase
          .from("lectures")
          .select("*")
          .eq("access_type", "free")
          .eq("is_published", true)
          .order("created_at", { ascending: true });

        if (lecData) {
          setFreeLectures(lecData);
        } else {
          setFreeLectures([]);
        }
      } catch (err) {
        console.error("Failed to load resources:", err);
        setResources([]);
        setFreeLectures([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
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

  const showLectures =
    (selectedFilter === "All" || selectedFilter === "Free Lectures") &&
    freeLectures.length > 0;
  const showResources =
    selectedFilter !== "Free Lectures" && filteredResources.length > 0;
  const hasContent = showLectures || showResources;

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

            {/* Loading state */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#5B32D6]" />
                <p className="text-sm font-semibold text-neutral-500">Loading resources from database...</p>
              </div>
            ) : !hasContent ? (
              <div className="bg-white rounded-[32px] p-12 text-center border border-dashed border-neutral-300 max-w-lg mx-auto space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center mx-auto">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-[#16141B]">No Resources Available</h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  {selectedFilter === "All"
                    ? "There are currently no free study materials or lectures published yet. Resources added via the admin dashboard will appear here."
                    : `There are currently no free materials available under "${selectedFilter}".`}
                </p>
              </div>
            ) : (
              <>
                {/* Free Video Lectures (if selected or All) */}
                {showLectures && (
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
                          className="bg-white rounded-[24px] border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
                          onClick={() => setActivePlayerLecture(lec)}
                        >
                          {/* 16:9 YouTube style Thumbnail Preview */}
                          <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                            {lec.thumbnail_key ? (
                              <img
                                src={`/api/storage/thumbnail?key=${encodeURIComponent(lec.thumbnail_key)}`}
                                alt={lec.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#1F1347] via-[#2F1B69] to-[#120A2B]">
                                <Play className="w-8 h-8 text-white/50 mb-1" />
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Video Lecture</span>
                              </div>
                            )}

                            {/* Hover Play Button Overlay */}
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/95 text-[#5B32D6] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                              </div>
                            </div>

                            {/* Duration chip */}
                            {lec.duration && (
                              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-bold font-mono tracking-tight shadow">
                                {lec.duration}
                              </div>
                            )}

                            {/* Free badge */}
                            <div className="absolute top-2 left-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-white shadow">
                                Free Lecture
                              </span>
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <h3 className="font-bold text-base text-[#16141B] group-hover:text-[#5B32D6] transition-colors line-clamp-2">
                                {lec.title}
                              </h3>
                              {lec.description && (
                                <p className="text-xs text-neutral-500 line-clamp-2">
                                  {lec.description}
                                </p>
                              )}
                            </div>

                            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                              <span className="text-xs text-[#5B32D6] font-bold">No Paywall</span>
                              <Button
                                variant="purple"
                                size="sm"
                                className="gap-2 cursor-pointer"
                                onClick={() => setActivePlayerLecture(lec)}
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Watch Free</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PDF & Study Notes Grid */}
                {showResources && (
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
              </>
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
