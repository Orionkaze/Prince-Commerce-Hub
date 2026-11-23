"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "purple" | "white" | "outline-white" | "dark" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: boolean;
  className?: string;
  onClick?: () => void;
  href?: string;
  as?: "button" | "span" | "div";
}

export function Button({
  children,
  variant = "purple",
  size = "md",
  icon = true,
  className = "",
  onClick,
  href,
  as = "button",
  ...props
}: ButtonProps) {
  // Size styles
  const sizeClasses = {
    sm: "pl-4 pr-1.5 py-1.5 text-[13px] gap-2.5",
    md: "pl-5 pr-2 py-2 text-[15px] gap-3",
    lg: "pl-6 pr-2.5 py-2.5 text-[16px] gap-3.5",
  }[size];

  // Variant styles
  const variantClasses = {
    purple: "bg-[#5B32D6] text-white hover:bg-[#4A23C2] shadow-sm",
    white: "bg-white text-[#16141B] hover:bg-neutral-100 shadow-sm",
    "outline-white": "border border-white/40 text-white hover:bg-white/10 backdrop-blur-xs",
    dark: "bg-[#16141B] text-white hover:bg-neutral-800 shadow-sm",
    ghost: "bg-transparent text-neutral-800 hover:text-[#5B32D6]",
  }[variant];

  // Arrow badge styles
  const badgeClasses = {
    purple: "bg-white text-[#5B32D6]",
    white: "bg-[#16141B] text-white",
    "outline-white": "bg-white text-[#16141B]",
    dark: "bg-white text-[#16141B]",
    ghost: "bg-neutral-100 text-neutral-900",
  }[variant];

  const content = (
    <>
      <span className="font-bold tracking-tight">{children}</span>
      {icon && (
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ease-out group-hover:rotate-45 ${badgeClasses}`}
        >
          <ArrowUpRight className="w-4 h-4 stroke-[2.4]" />
        </span>
      )}
    </>
  );

  const baseClasses = `group inline-flex items-center justify-between rounded-full transition-all duration-200 cursor-pointer select-none active:scale-[0.98] ${sizeClasses} ${variantClasses} ${className}`;

  if (href) {
    if (href.startsWith("/") || href.startsWith("#")) {
      return (
        <Link href={href} className={baseClasses} onClick={onClick}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} className={baseClasses} onClick={onClick} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  if (as === "span") {
    return (
      <span className={baseClasses} onClick={onClick}>
        {content}
      </span>
    );
  }

  return (
    <button type="button" className={baseClasses} onClick={onClick} {...props}>
      {content}
    </button>
  );
}
