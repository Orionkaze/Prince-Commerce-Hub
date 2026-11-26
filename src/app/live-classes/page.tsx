"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { ContactModal } from "@/components/footer/ContactModal";
import {
  Video,
  Calendar,
  Clock,
  User,
  Lock,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  LogIn,
  Radio,
} from "lucide-react";
import { motion } from "framer-motion";
import { StudentLiveClassAccessResponse } from "@/types/lms";
import { formatTime12Hr, formatDateReadable } from "@/lib/utils/live-class";

export default function LiveClassesPage() {
  const router = useRouter();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [data, setData] = useState<StudentLiveClassAccessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLiveClass() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/live-classes/active", {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Unable to load live class schedule.");
        }
        const json: StudentLiveClassAccessResponse = await res.json();
        setData(json);
      } catch (err: any) {
        console.error("Live class fetch error:", err);
        setError(err?.message || "Failed to load live class details.");
      } finally {
        setLoading(false);
      }
    }

    fetchLiveClass();
  }, []);

  const liveClass = data?.liveClass;
  const status = liveClass?.computed_status || liveClass?.status || "Upcoming";
  const hasAccess = Boolean(data?.hasAccess);
  const isAuthenticated = Boolean(data?.isAuthenticated);

  // Status Badge Component
  const renderStatusBadge = () => {
    switch (status) {
      case "Live Now":
        return (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            <span>Live Now</span>
          </div>
        );
      case "Upcoming":
        return (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#5B32D6]/10 border border-[#5B32D6]/20 text-[#5B32D6] text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-[#5B32D6]" />
            <span>Upcoming Session</span>
          </div>
        );
      case "Completed":
        return (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
            <span>Completed</span>
          </div>
        );
      case "Cancelled":
        return (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Session Rescheduled / Cancelled</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#16141B] flex flex-col font-sans selection:bg-[#5B32D6] selection:text-white">
      {/* Global Navigation */}
      <Navbar onOpenContact={() => setIsContactModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Live Batch Mentorship</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#16141B] tracking-tight leading-tight">
            Live Classes &amp; Mentorship
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Attend real-time problem-solving sessions, concept deep dives, and live doubt clearance directly with faculty.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl p-12 border border-neutral-200/80 shadow-sm flex flex-col items-center justify-center min-h-[360px] text-center">
            <Loader2 className="w-8 h-8 text-[#5B32D6] animate-spin mb-4" />
            <h3 className="text-lg font-bold text-neutral-800">Checking Live Class Schedule...</h3>
            <p className="text-sm text-neutral-500 mt-1">Verifying your student enrollment credentials.</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-rose-50 rounded-3xl p-8 border border-rose-200 text-center max-w-xl mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-rose-900">Unable to load live class</h3>
            <p className="text-sm text-rose-700 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-5 py-2.5 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-rose-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State: No Live Class Scheduled */}
        {!loading && !error && !liveClass && (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-neutral-200/80 shadow-sm text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#5B32D6]/10 text-[#5B32D6] flex items-center justify-center mx-auto mb-5">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-[#16141B]">No Live Class Scheduled Right Now</h3>
            <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
              Our faculty schedules upcoming live problem-solving and doubt-clearing sessions regularly. Please check back soon or explore our comprehensive crash courses.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#5B32D6] text-white font-bold text-sm shadow-md shadow-[#5B32D6]/20 hover:bg-[#4A23C2] transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Course Batches</span>
              </Link>
            </div>
          </div>
        )}

        {/* EXACTLY ONE SINGLE LIVE CLASS CARD */}
        {!loading && !error && liveClass && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl border border-neutral-200/90 shadow-xl shadow-black/5 overflow-hidden"
          >
            {/* Top Bar with Status and Badge */}
            <div className="p-6 sm:p-8 border-b border-neutral-100 bg-gradient-to-r from-neutral-50/70 to-white flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                {renderStatusBadge()}

                {liveClass.course?.title && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-bold border border-neutral-200/80">
                    <BookOpen className="w-3.5 h-3.5 text-[#5B32D6]" />
                    <span>{liveClass.course.title}</span>
                  </span>
                )}
              </div>

              {/* Faculty Name */}
              <div className="flex items-center gap-2 text-sm text-neutral-700 font-semibold">
                <div className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-800 flex items-center justify-center text-xs font-black border border-amber-300">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>Faculty: {liveClass.teacher_name || "Parvesh Kumar"}</span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-6 sm:p-8 lg:p-10 space-y-6">
              {/* Title & Description */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#16141B] tracking-tight leading-snug">
                  {liveClass.title}
                </h2>
                {liveClass.description && (
                  <p className="mt-3 text-base text-neutral-600 leading-relaxed">
                    {liveClass.description}
                  </p>
                )}
              </div>

              {/* Timing & Schedule Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 px-5 rounded-2xl bg-[#F7F7F9] border border-neutral-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-[#5B32D6] shrink-0 shadow-xs">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Scheduled Date
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-[#16141B]">
                      {formatDateReadable(liveClass.scheduled_date)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Timings (IST)
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-[#16141B]">
                      {formatTime12Hr(liveClass.start_time)} – {formatTime12Hr(liveClass.end_time)}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION ZONE BASED ON ENROLLMENT ACCESS */}
              <div className="pt-2">
                {/* CASE A: STUDENT HAS PURCHASED COURSE (OR ADMIN) */}
                {hasAccess && (
                  <div className="space-y-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3.5">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <span className="font-bold text-emerald-900">Enrolled Student Access Verified!</span>
                        <p className="text-emerald-700 text-xs sm:text-sm mt-0.5 leading-relaxed">
                          You have full access to this live interactive session via your course enrollment.
                          Click below to launch Google Meet directly.
                        </p>
                      </div>
                    </div>

                    {liveClass.google_meet_url ? (
                      <a
                        href={liveClass.google_meet_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#5B32D6] hover:bg-[#4A23C2] text-white font-black text-base shadow-lg shadow-[#5B32D6]/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
                      >
                        <Video className="w-5 h-5 text-[#FDE047]" />
                        <span>Join Live Class (Google Meet)</span>
                        <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
                      </a>
                    ) : (
                      <div className="p-4 rounded-xl bg-amber-50 text-amber-800 text-sm font-medium border border-amber-200">
                        The Google Meet link will be activated shortly before class starts.
                      </div>
                    )}

                    <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                      Tip: Ensure you are logged into your Google account before opening the meeting room.
                    </p>
                  </div>
                )}

                {/* CASE B: STUDENT IS LOGGED IN BUT HAS NOT PURCHASED */}
                {isAuthenticated && !hasAccess && (
                  <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-neutral-50 to-[#5B32D6]/5 border-2 border-dashed border-[#5B32D6]/20 text-center sm:text-left space-y-4">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#5B32D6]/10 text-[#5B32D6] flex items-center justify-center shrink-0">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-extrabold text-[#16141B]">
                          Want to attend this live class?
                        </h3>
                        <p className="text-sm text-neutral-600 mt-1 leading-relaxed max-w-2xl">
                          This live class is exclusively available to enrolled students. Purchase the course to unlock access to live classes and exclusive learning resources.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <Link
                        href={liveClass.course?.slug ? `/courses/${liveClass.course.slug}` : "/courses"}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#5B32D6] hover:bg-[#4A23C2] text-white font-extrabold text-sm shadow-md shadow-[#5B32D6]/20 transition"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>
                          Buy Course {liveClass.course?.price ? `(₹${liveClass.course.price})` : ""}
                        </span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>

                      <span className="text-xs text-neutral-500 font-medium">
                        Instant access unlocked upon purchase completion.
                      </span>
                    </div>
                  </div>
                )}

                {/* CASE C: VISITOR IS NOT LOGGED IN */}
                {!isAuthenticated && (
                  <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-neutral-50 to-[#5B32D6]/5 border border-neutral-200 text-center sm:text-left space-y-4">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                        <LogIn className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-extrabold text-[#16141B]">
                          Student Login Required
                        </h3>
                        <p className="text-sm text-neutral-600 mt-1 leading-relaxed max-w-2xl">
                          Please log in or register with your student account to verify your course enrollment and access the live meeting link.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <Link
                        href="/login?redirectTo=/live-classes"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#5B32D6] hover:bg-[#4A23C2] text-white font-extrabold text-sm shadow-md shadow-[#5B32D6]/20 transition"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Login / Register to Attend</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>

                      <Link
                        href="/courses"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-neutral-300 text-neutral-700 font-bold text-sm hover:bg-neutral-50 transition"
                      >
                        <span>View All Courses</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <CtaAndFooter onOpenContact={() => setIsContactModalOpen(true)} />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
