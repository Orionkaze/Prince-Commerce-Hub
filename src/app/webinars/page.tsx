"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { ContactModal } from "@/components/footer/ContactModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  BellRing,
  ArrowRight,
  MonitorPlay,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

interface WebinarItem {
  id: string;
  title: string;
  category: string;
  speaker: string;
  description: string;
  status: string;
  mode: string;
  image?: string;
  scheduled_at?: string;
}

export default function WebinarsPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [registeredWebinar, setRegisteredWebinar] = useState<string | null>(null);
  const [upcomingWebinars, setUpcomingWebinars] = useState<WebinarItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadWebinars() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("webinars")
          .select("*")
          .order("created_at", { ascending: true });

        if (data && !error && data.length > 0) {
          const mapped: WebinarItem[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category || "Commerce",
            speaker: item.speaker || "Parvesh Kumar (Lead Educator)",
            description: item.description || "",
            status: item.status || "Announcing Soon",
            mode: item.mode || "Live Interactive Webinar",
            image: item.image || "/images/accountancy-classroom.jpg",
            scheduled_at: item.scheduled_at,
          }));
          setUpcomingWebinars(mapped);
        } else {
          setUpcomingWebinars([]);
        }
      } catch (err) {
        console.error("Error fetching webinars from database:", err);
        setUpcomingWebinars([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadWebinars();
  }, []);

  const handleRegister = (id: string) => {
    setRegisteredWebinar(id);
    setTimeout(() => {
      setRegisteredWebinar(null);
    }, 3000);
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
              <Badge variant="yellow">LIVE LEARNING SESSIONS</Badge>
            </div>
            <h1 className="text-[38px] sm:text-[52px] lg:text-[64px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white max-w-[850px]">
              Webinars &amp; Learning Sessions
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.6] text-white/85 max-w-[700px] font-normal">
              A dedicated space for educational sessions and additional learning opportunities.
            </p>
          </div>
        </section>

        {/* ================= 1. Upcoming Webinars Section ================= */}
        <section className="py-20 lg:py-28 bg-[#F7F7F9]">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 space-y-12">
            <div className="space-y-3">
              <Badge variant="yellow">UPCOMING SESSIONS</Badge>
              <h2 className="text-[32px] sm:text-[42px] font-extrabold text-[#16141B] tracking-tight">
                Upcoming Live Webinars
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 max-w-xl">
                Interactive live online seminars conducted by Parvesh Kumar focusing on exam strategy, problem solving, and commerce career paths.
              </p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#5B32D6]" />
                <p className="text-sm font-semibold text-neutral-500">Loading upcoming webinars...</p>
              </div>
            ) : upcomingWebinars.length === 0 ? (
              <div className="bg-white rounded-[32px] p-12 text-center border border-dashed border-neutral-300 max-w-lg mx-auto space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center mx-auto">
                  <MonitorPlay className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-[#16141B]">No Live Webinars Scheduled</h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  There are currently no live webinars scheduled. New sessions published via the database will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {upcomingWebinars.map((webinar, idx) => (
                  <motion.div
                    key={webinar.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-white rounded-[32px] overflow-hidden border border-neutral-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Header with Badge Overlay */}
                      <div className="relative h-60 w-full overflow-hidden bg-neutral-900">
                        <Image
                          src={webinar.image || "/images/accountancy-classroom.jpg"}
                          alt={webinar.title}
                          fill
                          className="object-cover object-center brightness-90 group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 600px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                          <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#16141B]">
                            {webinar.category}
                          </span>
                          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E]">
                            {webinar.status}
                          </span>
                        </div>
                        <div className="absolute bottom-5 left-5 right-5 text-white">
                          <div className="text-xs font-medium text-white/80">{webinar.mode}</div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-8 sm:p-10 space-y-4">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-[#16141B] tracking-tight leading-snug">
                          {webinar.title}
                        </h3>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {webinar.description}
                        </p>
                        <div className="pt-2 text-xs text-neutral-500 font-medium">
                          Speaker: <strong>{webinar.speaker}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="p-8 sm:p-10 pt-0 border-t border-neutral-100 flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                        <Clock className="w-4 h-4 text-[#5B32D6]" />
                        <span>60 Mins · Live Zoom</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRegister(webinar.id)}
                        className="px-5 py-2.5 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                      >
                        {registeredWebinar === webinar.id ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Notification Set!</span>
                          </>
                        ) : (
                          <>
                            <BellRing className="w-4 h-4" />
                            <span>Notify Me</span>
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
