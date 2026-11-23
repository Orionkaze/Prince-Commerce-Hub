import React from "react";
import Link from "next/link";
import { PlusCircle, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

export function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  const ActionIcon = action?.icon || PlusCircle;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16141B] tracking-tight">
            {title}
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-[#5B32D6]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Admin
          </span>
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white font-bold text-sm shadow-md shadow-[#5B32D6]/20 transition shrink-0"
        >
          <ActionIcon className="w-4 h-4 text-[#FDE047]" />
          <span>{action.label}</span>
        </Link>
      )}
    </div>
  );
}
