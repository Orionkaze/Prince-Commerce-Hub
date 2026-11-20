"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function DublinClock() {
  const [timeStr, setTimeStr] = useState<string>("7:23 PM");
  const [dateStr, setDateStr] = useState<string>("GMT+1 · FRI, NOV 20");
  const [mounted, setMounted] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      try {
        const now = new Date();
        // Format for Dublin / Europe/Dublin or UTC+1
        const timeOptions: Intl.DateTimeFormatOptions = {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Europe/Dublin",
        };
        const dateOptions: Intl.DateTimeFormatOptions = {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: "Europe/Dublin",
        };

        const formattedTime = new Intl.DateTimeFormat("en-US", timeOptions).format(now);
        const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions)
          .format(now)
          .toUpperCase();

        setTimeStr(formattedTime);
        setDateStr(`GMT+1 · ${formattedDate}`);
      } catch {
        // Fallback
        setTimeStr("7:23 PM");
        setDateStr("GMT+1 · FRI, NOV 20");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative hidden sm:flex flex-col items-end text-right cursor-pointer select-none group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      <div className="text-[14px] font-bold text-[#16141B] tracking-tight leading-tight flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#5B32D6] transition-colors" />
        <span>{mounted ? timeStr : "7:23 PM"}</span>
      </div>
      <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-0.5">
        <span>{mounted ? dateStr : "GMT+1 · FRI, NOV 20"}</span>
        <span className="text-[9px] text-neutral-400">▾</span>
      </div>

      {/* Hover Info Tooltip */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-52 p-3 bg-white rounded-xl shadow-xl border border-neutral-100 z-50 text-left">
          <div className="text-xs font-bold text-neutral-900">Dublin, Ireland (GMT+1)</div>
          <div className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
            Jave is currently available for scheduled lessons and student inquiries during GMT+1 hours.
          </div>
          <div className="mt-2 text-[10px] font-medium text-[#5B32D6] bg-[#ECE8FA] px-2 py-1 rounded-md inline-block">
            Online Coaching Studio
          </div>
        </div>
      )}
    </div>
  );
}
