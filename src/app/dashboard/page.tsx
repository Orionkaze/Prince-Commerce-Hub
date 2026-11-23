"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { ContactModal } from "@/components/footer/ContactModal";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  TrendingUp,
  CreditCard,
  Layers,
  ArrowRight,
  Loader2,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function StudentDashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login?redirectTo=/dashboard");
      return;
    }

    async function loadDashboard() {
      if (!user) return;
      setIsLoading(true);
      try {
        const res = await fetch("/api/student/dashboard");
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadDashboard();
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar onOpenContact={() => setIsContactModalOpen(true)} />
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-[#5B32D6] mb-4" />
          <p className="text-sm font-semibold text-gray-500">Loading student dashboard...</p>
        </div>
        <CtaAndFooter onOpenContact={() => setIsContactModalOpen(true)} />
      </div>
    );
  }

  const studentName =
    dashboardData?.student?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Commerce Student";

  const stats = dashboardData?.stats || {
    totalEnrolled: 0,
    completedCoursesCount: 0,
    totalCompletedLectures: 0,
    overallProgress: 0,
  };

  const enrolledCourses = dashboardData?.enrolledCourses || [];
  const purchases = dashboardData?.purchases || [];

  return (
    <div className="min-h-screen bg-[#F7F7F9] text-[#16141B] flex flex-col font-sans">
      <Navbar onOpenContact={() => setIsContactModalOpen(true)} />

      <main className="flex-1 pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#1D1136] to-[#16141B] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#5B32D6] text-white flex items-center justify-center font-black text-2xl border-2 border-[#FDE047] shadow-lg">
                {studentName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FDE047] text-[#16141B] mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Student Learning Portal
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Welcome back, {studentName}!
                </h1>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  Ready to continue your Accountancy preparation with Parvesh Sir?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white font-bold text-xs shadow-md transition"
              >
                <BookOpen className="w-4 h-4 text-[#FDE047]" />
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>

        {/* Learning Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-sm">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Enrolled Courses
            </div>
            <div className="text-3xl font-black text-[#16141B] mt-2">
              {stats.totalEnrolled}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Active course access</p>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-sm">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Completed Courses
            </div>
            <div className="text-3xl font-black text-emerald-600 mt-2">
              {stats.completedCoursesCount}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">100% finished</p>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-sm">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Lectures Completed
            </div>
            <div className="text-3xl font-black text-[#5B32D6] mt-2">
              {stats.totalCompletedLectures}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Watch marks earned</p>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-sm">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Overall Progress
            </div>
            <div className="text-3xl font-black text-amber-600 mt-2">
              {stats.overallProgress}%
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* My Courses Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#16141B] tracking-tight">
                My Courses
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Courses you have purchased with active enrollment and recorded lecture access.
              </p>
            </div>
            <Link
              href="/courses"
              className="text-xs font-bold text-[#5B32D6] hover:underline flex items-center gap-1"
            >
              Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 text-center space-y-3">
              <GraduationCap className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">
                You haven&apos;t enrolled in any courses yet
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Explore Class 11 &amp; Class 12 Accountancy foundation modules led by Parvesh Sir to start learning.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white text-xs font-bold shadow-md shadow-[#5B32D6]/20 transition mt-2"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#FDE047]" />
                Explore Available Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((c: any) => {
                const targetLectureId = c.lastWatchedLecture?.id || "first";
                const thumbnailSrc =
                  c.thumbnail_object_key ||
                  c.thumbnail_key ||
                  (c.id === "class-12" ? "/images/class-12-accountancy.jpg" : "/images/accountancy-classroom.jpg");

                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md hover:border-[#5B32D6]/40 transition overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Course Thumbnail Banner */}
                      <div className="relative h-44 w-full bg-gradient-to-tr from-[#1D1136] to-[#5B32D6] overflow-hidden">
                        <img
                          src={thumbnailSrc}
                          alt={c.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback gradient if local image path fails
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#16141B]/85 text-[#FDE047] backdrop-blur-sm">
                            {c.class_level || c.category || "Accountancy"}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="font-extrabold text-lg text-[#16141B] line-clamp-1">
                          {c.title}
                        </h3>
                        <p className="text-xs font-semibold text-gray-500 mt-1">
                          Instructor: <span className="text-[#16141B]">Parvesh Kumar (Founder &amp; Lead Educator)</span>
                        </p>

                        {/* Progress Stats Block */}
                        <div className="mt-5 space-y-2 bg-[#F7F7F9] p-4 rounded-2xl border border-gray-100">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-gray-600">Progress: {c.progressPercent}%</span>
                            <span className="text-[#5B32D6]">
                              {c.completedLectures} / {c.totalLectures} Lectures Completed
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#5B32D6] to-[#7B52F6] h-full rounded-full transition-all duration-300"
                              style={{ width: `${c.progressPercent}%` }}
                            />
                          </div>
                        </div>

                        {c.lastWatchedLecture && (
                          <p className="text-xs text-gray-400 mt-3 truncate">
                            Up next: <strong className="text-gray-700">{c.lastWatchedLecture.title}</strong>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400">
                        {c.modules_count || 0} Modules
                      </span>

                      <Link
                        href={`/learn/${c.id}/${targetLectureId}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white text-xs font-bold shadow-md shadow-[#5B32D6]/20 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-[#FDE047]" />
                        <span>Continue Learning</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Purchase History Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-[#16141B] tracking-tight">
                Order &amp; Purchase History
              </h2>
              <p className="text-xs text-gray-500">
                Verified enrollment receipts and Razorpay transactions.
              </p>
            </div>
            <CreditCard className="w-5 h-5 text-gray-400" />
          </div>

          {purchases.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              No previous purchases recorded for this student account.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {purchases.map((p: any) => (
                <div
                  key={p.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-[#16141B]">
                      {p.course_id ? `Course Enrollment: ${p.course_id}` : "Lecture Access"}
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                      Transaction ID: {p.transaction_id || "TXN_PENDING"}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <span className="font-extrabold text-sm text-[#16141B]">
                      ₹{Number(p.amount).toLocaleString("en-IN")}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Paid
                    </span>
                    <span className="text-gray-400 text-[11px]">
                      {new Date(p.created_at).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <CtaAndFooter onOpenContact={() => setIsContactModalOpen(true)} />
    </div>
  );
}
