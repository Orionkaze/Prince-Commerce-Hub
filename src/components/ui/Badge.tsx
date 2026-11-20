import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "yellow" | "white" | "lavender" | "outline";
  className?: string;
}

export function Badge({ children, variant = "yellow", className = "" }: BadgeProps) {
  const variantStyles = {
    yellow: "bg-[#FDE047] text-[#16141B]",
    white: "bg-white text-[#16141B] shadow-xs",
    lavender: "bg-[#ECE8FA] text-[#5B32D6]",
    outline: "border border-neutral-300 text-neutral-700 bg-white",
  }[variant];

  return (
    <span
      className={`inline-block text-[11px] font-extrabold uppercase tracking-[0.08em] px-2.5 py-1 rounded-[4px] leading-tight select-none ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
}
