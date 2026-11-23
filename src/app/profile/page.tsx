"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Shield,
  GraduationCap,
  Calendar,
  CreditCard,
  LogOut,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function StudentProfilePage() {
  const { user, role, signOut, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login?redirectTo=/profile");
      return;
    }

    async function loadData() {
      if (!user) return;
      setIsLoading(true);
      try {
        const res = await fetch("/api/student/dashboard");
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch (err) {
        console.error("Profile error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      loadData();
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar onOpenContact={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-[#5B32D6] mb-4" />
          <p className="text-sm font-semibold text-gray-500">Loading student profile...</p>
        </div>
        <CtaAndFooter onOpenContact={() => {}} />
      </div>
    );
  }

  const name =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Student";

  return (
    <div className="min-h-screen bg-[#F7F7F9] text-[#16141B] flex flex-col font-sans">
      <Navbar onOpenContact={() => {}} />

      <main className="flex-1 pt-32 pb-20 max-w-3xl mx-auto px-4 sm:px-6 w-full space-y-6">
        <h1 className="text-3xl font-black text-[#16141B] tracking-tight">
          Student Profile
        </h1>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#5B32D6] text-white flex items-center justify-center font-black text-2xl border-2 border-[#FDE047] shadow-md">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xl font-black text-[#16141B]">{name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-[#5B32D6]">
                  {role?.toUpperCase() || "STUDENT"}
                </span>
                <span className="text-[11px] text-gray-400 font-semibold">
                  {dashboardData?.enrolledCourses?.length || 0} Enrolled Courses
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="p-4 rounded-2xl bg-[#F7F7F9] space-y-1">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Registered Email
              </span>
              <div className="font-bold text-[#16141B] truncate">{user?.email}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F7F9] space-y-1">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Authentication
              </span>
              <div className="font-bold text-emerald-600">Google OAuth / Supabase</div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white text-xs font-bold transition shadow-sm"
            >
              Go to Dashboard
            </Link>

            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:text-rose-600 hover:border-rose-200 text-xs font-bold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </main>

      <CtaAndFooter onOpenContact={() => {}} />
    </div>
  );
}
