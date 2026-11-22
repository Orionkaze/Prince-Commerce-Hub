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
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  BellRing,
  ArrowRight,
  MonitorPlay,
} from "lucide-react";
import { motion } from "framer-motion";

export default function WebinarsPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [registeredWebinar, setRegisteredWebinar] = useState<string | null>(null);

  const upcomingWebinars = [
    {
      id: "web-1",
      title: "Mastering Board Exam High-Weightage Chapters: Partnership & Cash Flow",
      category: "Class 12 Commerce",
      speaker: "Parvesh Kumar (Founder & Lead Educator)",
      description:
        "An intensive orientation session detailing step-by-step presentation techniques, common board exam traps, and working note formatting for maximum marks.",
      status: "Announcing Soon",
      mode: "Live Interactive Webinar",
      image: "/images/accountancy-classroom.jpg",
    },
    {
      id: "web-2",
      title: "Class 10 to 11 Commerce Transition: Building Logical Debit & Credit Foundations",
      category: "Class 11 Commerce",
      speaker: "Parvesh Kumar (Founder & Lead Educator)",
      description:
        "Learn why commerce is the cornerstone of modern business and how to master early accounting concepts without ever resorting to rote memorization.",
      status: "Announcing Soon",
      mode: "Live Interactive Webinar",
      image: "/images/improve-understand-faster.jpg",
    },
  ];

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingWebinars.map((webinar, idx) => (
                <motion.div
                  key={webinar.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white rounded-[28px] overflow-hidden border border-neutral-200/80 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="relative h-56 sm:h-64 w-full bg-neutral-900 overflow-hidden">
                    <Image
                      src={webinar.image}
                      alt={webinar.title}
                      fill
                      className="object-cover object-center brightness-[0.85]"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FDE047] text-[#16141B]">
                        {webinar.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Video className="w-4 h-4 text-[#FDE047]" />
                        {webinar.mode}
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md">
                        {webinar.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-[#16141B] tracking-tight leading-snug">
                        {webinar.title}
                      </h3>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {webinar.description}
                      </p>
                      <div className="pt-2 text-xs font-semibold text-neutral-500">
                        Instructor: <span className="text-[#5B32D6] font-bold">{webinar.speaker}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-neutral-100 flex items-center justify-between gap-4">
                      <span className="text-xs text-neutral-400">
                        Dates to be announced
                      </span>
                      <Button
                        variant={registeredWebinar === webinar.id ? "white" : "purple"}
                        size="md"
                        onClick={() => handleRegister(webinar.id)}
                      >
                        {registeredWebinar === webinar.id ? "Notification Saved!" : "Notify Me"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 2. Recorded Webinars Section ================= */}
        <section className="py-20 lg:py-28 bg-white border-t border-neutral-100">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 space-y-12">
            <div className="space-y-3">
              <Badge variant="yellow">ARCHIVE &amp; SESSIONS</Badge>
              <h2 className="text-[32px] sm:text-[42px] font-extrabold text-[#16141B] tracking-tight">
                Recorded Webinars &amp; Class Archives
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 max-w-xl">
                Class recordings, doubt-clearing archives, and concept sessions conducted by Parvesh Sir are shared directly with enrolled students through the Student Portal and Google Classroom.
              </p>
            </div>

            <div className="p-8 sm:p-12 rounded-[28px] bg-[#F7F7F9] border border-neutral-200/80 text-center space-y-4 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center mx-auto">
                <MonitorPlay className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#16141B]">
                Session Recordings Accessible Upon Enrollment
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed max-w-lg mx-auto">
                Enrolled students receive instant cloud access to HD session recordings after each live batch class. For public webinars, registration announcements will appear above.
              </p>
              <div className="pt-2">
                <Link href="/courses">
                  <Button variant="purple" size="md">
                    Explore Batch Programs
                  </Button>
                </Link>
              </div>
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
