"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Orders & Payments", href: "/admin/orders", icon: CreditCard },
  { label: "Platform Status", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#16141B] text-white border-r border-[#2A2634] w-64">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#2A2634]">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B32D6] to-[#7B52F6] flex items-center justify-center text-white font-bold shadow-md shadow-[#5B32D6]/30">
            <GraduationCap className="w-5 h-5 text-[#FDE047]" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight text-white group-hover:text-[#FDE047] transition">
              PRIME COMMERCE
            </div>
            <div className="text-[10px] font-bold tracking-wider text-[#FDE047] uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FDE047] animate-pulse"></span>
              Admin Portal
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpenMobile(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-[#5B32D6] text-white shadow-md shadow-[#5B32D6]/30"
                  : "text-gray-300 hover:text-white hover:bg-[#231F2E]"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-[#FDE047]" : "text-gray-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
          Student Experience
        </div>
        <Link
          href="/courses"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-[#231F2E] transition"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#FDE047]" />
            <span>Public Catalog</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </Link>
        <Link
          href="/dashboard"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-[#231F2E] transition"
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span>Student Dashboard</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </Link>
      </div>

      {/* User profile & logout footer */}
      <div className="p-4 border-t border-[#2A2634] bg-[#121016]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#5B32D6] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user?.user_metadata?.full_name || "Lead Educator"}
              </div>
              <div className="text-[11px] text-gray-400 truncate">
                {user?.email || "Admin Account"}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg bg-[#231F2E] hover:bg-rose-950/60 hover:text-rose-300 text-gray-300 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-2 rounded-xl bg-[#16141B] text-white border border-[#2A2634] shadow-lg"
          aria-label="Toggle Menu"
        >
          {isOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </div>

      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen">
        {navContent}
      </div>
    </>
  );
}
