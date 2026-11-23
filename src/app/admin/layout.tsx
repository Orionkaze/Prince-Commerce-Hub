import React from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/roles";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";



export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    if (auth.status === 401) {
      redirect("/login?redirectTo=/admin");
    }

    return (
      <div className="min-h-screen bg-[#F7F7F9] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#16141B] tracking-tight">
            Restricted Admin Area
          </h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Your authenticated account (<span className="font-semibold text-gray-800">{auth.user?.email}</span>) does not have administrative permissions for Prime Commerce Hub.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-full bg-[#5B32D6] text-white font-bold text-sm hover:bg-[#4A23C2] transition"
            >
              Go to Student Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F9] flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
