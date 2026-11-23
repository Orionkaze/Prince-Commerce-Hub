import React from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  BookOpen,
  Users,
  CreditCard,
  IndianRupee,
  PlusCircle,
  UploadCloud,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileVideo,
  ShieldCheck,
} from "lucide-react";

export const instant = false;

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  // 1. Fetch Courses Count & Breakdown with course-specific module & lecture counts
  // Exclusively target the two canonical batches: Class 11 and Class 12 Accountancy
  const { data: courses = [] } = await supabase
    .from("courses")
    .select("id, title, price, is_published, category, topics, created_at, updated_at")
    .order("created_at", { ascending: false });

  const rawCourses = (courses || []).filter(
    (c) =>
      c.id === "class-11" ||
      c.id === "class-12" ||
      c.title.includes("Class 11") ||
      c.title.includes("Class 12")
  );

  const coursesWithDetails = await Promise.all(
    rawCourses.map(async (c) => {
      let modCount = 0;
      let lecCount = 0;
      try {
        const [{ count: mCount }, { count: lCount }] = await Promise.all([
          supabase.from("course_modules").select("id", { count: "exact", head: true }).eq("course_id", c.id),
          supabase.from("lectures").select("id", { count: "exact", head: true }).eq("course_id", c.id),
        ]);
        modCount = mCount || (Array.isArray(c.topics) ? c.topics.length : 0);
        lecCount = lCount || 0;
      } catch {
        modCount = Array.isArray(c.topics) ? c.topics.length : 0;
      }
      return {
        ...c,
        modulesCount: modCount,
        lecturesCount: lecCount,
      };
    })
  );

  const totalCourses = coursesWithDetails.length;
  const publishedCourses = coursesWithDetails.filter((c) => Boolean(c.is_published)).length;
  const draftCourses = totalCourses - publishedCourses;

  // 2. Fetch Total Students (from user_roles & profiles)
  let totalStudents = 0;
  try {
    const { count } = await supabase
      .from("user_roles")
      .select("id", { count: "exact", head: true });
    totalStudents = count || 0;
  } catch {
    // fallback
  }

  // 3. Fetch Enrollments & Purchases Count
  let totalEnrollments = 0;
  try {
    const { count: enrollCount } = await supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true });
    totalEnrollments = enrollCount || 0;
  } catch {
    // fallback
  }

  // 4. Fetch Completed Purchases & Total Revenue
  let verifiedRevenue = 0;
  let recentPurchases: any[] = [];
  try {
    const { data: purchases } = await supabase
      .from("purchases")
      .select("id, student_id, course_id, lecture_id, amount, payment_status, transaction_id, created_at")
      .eq("payment_status", "completed")
      .order("created_at", { ascending: false })
      .limit(10);

    if (purchases) {
      recentPurchases = purchases;
      verifiedRevenue = purchases.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      if (totalEnrollments === 0) {
        totalEnrollments = purchases.length;
      }
    }
  } catch {
    // fallback
  }

  // 5. Fetch Total Lectures count
  let totalLectures = 0;
  try {
    const { count: lecCount } = await supabase
      .from("lectures")
      .select("id", { count: "exact", head: true });
    totalLectures = lecCount || 0;
  } catch {
    // fallback
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminHeader
        title="Admin Overview"
        subtitle="Manage institute batches, student enrollments, video recordings, and revenue."
      />

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Courses */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm relative overflow-hidden group hover:border-[#5B32D6]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Courses
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5B32D6] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#16141B]">{totalCourses}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {publishedCourses} Live
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {draftCourses} drafts or archived modules
          </p>
        </div>

        {/* Registered Students */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm relative overflow-hidden group hover:border-[#5B32D6]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Active Students
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#16141B]">{totalStudents}</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Class 11 &amp; 12
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Registered accounts across portal
          </p>
        </div>

        {/* Total Enrollments */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm relative overflow-hidden group hover:border-[#5B32D6]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Course Enrollments
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#16141B]">{totalEnrollments}</span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Access Granted
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Across complete foundation batches
          </p>
        </div>

        {/* Verified Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm relative overflow-hidden group hover:border-[#5B32D6]/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Verified Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#16141B]">
              ₹{verifiedRevenue.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              INR Verified
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Successful Razorpay checkouts
          </p>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="bg-gradient-to-r from-[#1D1136] to-[#16141B] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FDE047] text-[#16141B]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Direct Cloudflare R2 Uploads Enabled
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Manage Institute Curricula &amp; Video Lectures
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Upload recordings directly to Cloudflare R2, structure chapters into organized modules, and configure free preview lectures for prospective students.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/courses/class-11"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white font-bold text-sm shadow-lg transition"
            >
              <BookOpen className="w-4 h-4 text-[#FDE047]" />
              Manage Class 11 Batch
            </Link>
            <Link
              href="/admin/courses/class-12"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 backdrop-blur-sm transition"
            >
              <BookOpen className="w-4 h-4 text-purple-300" />
              Manage Class 12 Batch
            </Link>
          </div>
        </div>
      </div>

      {/* Dual Section: Active Courses & Recent Purchases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Management */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-[#16141B] tracking-tight uppercase">
                Course Management
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Independent batches with separated curriculum &amp; video storage
              </p>
            </div>
            <Link
              href="/admin/courses"
              className="text-xs font-bold text-[#5B32D6] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {coursesWithDetails.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No courses created yet.
              </div>
            ) : (
              coursesWithDetails.map((course) => (
                <div
                  key={course.id}
                  className="p-5 rounded-2xl bg-[#F7F7F9] border border-gray-100 hover:border-purple-200 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5B32D6]">
                          {course.category || "Commerce Batch"}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          course.is_published
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-200 text-gray-700"
                        }`}>
                          {course.is_published ? "PUBLISHED" : "DRAFT"}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-[#16141B] mt-1.5">
                        {course.title}
                      </h4>
                    </div>
                    <span className="text-xs font-extrabold text-gray-700 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shrink-0">
                      ₹{Number(course.price).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-gray-500 pt-1">
                    <span className="flex items-center gap-1 text-[#16141B]">
                      <FileVideo className="w-3.5 h-3.5 text-[#5B32D6]" />
                      {course.lecturesCount} Lectures
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="flex items-center gap-1 text-[#16141B]">
                      <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                      {course.modulesCount} Modules
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 flex items-center justify-end gap-2.5">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold text-[#16141B] hover:bg-gray-100 transition shadow-sm"
                    >
                      Manage Batch
                    </Link>
                    <Link
                      href={`/admin/courses/${course.id}?upload=true`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white text-xs font-bold transition shadow-sm shadow-[#5B32D6]/20"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-[#FDE047]" />
                      <span>Upload Lecture</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Purchases & Orders */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-[#16141B] tracking-tight">
                Recent Transactions
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Verified Razorpay payments
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#5B32D6] hover:underline flex items-center gap-1"
            >
              All orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentPurchases.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <CreditCard className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-sm">No recent transactions recorded yet.</p>
                <p className="text-xs text-gray-400 mt-1">Purchases through checkout will appear here.</p>
              </div>
            ) : (
              recentPurchases.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-[#F7F7F9] border border-gray-100"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-gray-500">
                        {p.transaction_id || "TXN_PENDING"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#16141B] mt-1">
                      {p.course_id ? `Course: ${p.course_id}` : `Lecture Access`}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {new Date(p.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="text-sm font-extrabold text-[#16141B] shrink-0">
                    ₹{Number(p.amount).toLocaleString("en-IN")}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
