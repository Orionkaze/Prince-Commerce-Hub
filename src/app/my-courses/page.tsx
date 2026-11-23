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
  Play,
  Layers,
  Video,
  Clock,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function MyCoursesPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login?redirectTo=/my-courses");
      return;
    }

    async function loadMyCourses() {
      if (!user) return;
      setIsLoading(true);
      try {
        const res = await fetch("/api/student/dashboard");
        if (res.ok) {
          const data = await res.json();
          setCourses(data.enrolledCourses || []);
        }
      } catch (err) {
        console.error("Failed to load enrolled courses:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadMyCourses();
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar onOpenContact={() => setIsContactModalOpen(true)} />
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-[#5B32D6] mb-4" />
          <p className="text-sm font-semibold text-gray-500">Loading your enrolled courses...</p>
        </div>
        <CtaAndFooter onOpenContact={() => setIsContactModalOpen(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F9] text-[#16141B] flex flex-col font-sans">
      <Navbar onOpenContact={() => setIsContactModalOpen(true)} />

      <main className="flex-1 pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div>
          <h1 className="text-3xl font-black text-[#16141B] tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Access your course recordings, downloadable study materials, and watch progress.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-200 text-center space-y-4 max-w-md mx-auto">
            <GraduationCap className="w-14 h-14 text-gray-300 mx-auto" />
            <h2 className="text-lg font-bold text-gray-800">No courses enrolled yet</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Explore our Class 11 and Class 12 Accountancy comprehensive foundation and board excellence batches.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white text-xs font-bold shadow-md shadow-[#5B32D6]/20 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FDE047]" />
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => {
              const targetLectureId = c.lastWatchedLecture?.id || "first";

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-[#5B32D6]/40 transition flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-gradient-to-tr from-[#1D1136] to-[#5B32D6] overflow-hidden">
                    {c.thumbnail_object_key || c.thumbnail_key ? (
                      <img
                        src={c.thumbnail_object_key || c.thumbnail_key}
                        alt={c.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#16141B]/80 text-[#FDE047] backdrop-blur-sm">
                        {c.class_level || c.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-[#16141B] line-clamp-1">
                        {c.title}
                      </h3>
                      <p className="text-xs font-semibold text-gray-500 mt-0.5">
                        Instructor: <span className="text-[#16141B]">Parvesh Kumar (Founder &amp; Lead Educator)</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {c.description}
                      </p>

                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-[#5B32D6]">{c.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#5B32D6] to-[#7B52F6] h-full rounded-full"
                            style={{ width: `${c.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400">
                        {c.completedLectures} / {c.totalLectures} Lectures
                      </span>

                      <Link
                        href={`/learn/${c.id}/${targetLectureId}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white text-xs font-bold transition shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-[#FDE047]" />
                        <span>Continue Learning</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <CtaAndFooter onOpenContact={() => setIsContactModalOpen(true)} />
    </div>
  );
}
