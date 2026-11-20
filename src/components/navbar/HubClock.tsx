"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function HubClock() {
  const [timeStr, setTimeStr] = useState<string>("5:30 PM");
  const [dateStr, setDateStr] = useState<string>("IST · FRI, NOV 20");
  const [mounted, setMounted] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      try {
        const now = new Date();
        const timeOptions: Intl.DateTimeFormatOptions = {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        };
        const dateOptions: Intl.DateTimeFormatOptions = {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: "Asia/Kolkata",
        };

        const formattedTime = new Intl.DateTimeFormat("en-US", timeOptions).format(now);
        const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions)
          .format(now)
          .toUpperCase();

        setTimeStr(formattedTime);
        setDateStr(`IST · ${formattedDate}`);
      } catch {
        setTimeStr("5:30 PM");
        setDateStr("IST · FRI, NOV 20");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative hidden sm:flex flex-col items-end text-right cursor-pointer select-none group shrink-0 whitespace-nowrap"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      <div className="text-[14px] font-bold text-[#16141B] tracking-tight leading-tight flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#5B32D6] transition-colors" />
        <span>{mounted ? timeStr : "5:30 PM"}</span>
      </div>
      <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-0.5">
        <span>{mounted ? dateStr : "IST · FRI, NOV 20"}</span>
        <span className="text-[9px] text-neutral-400">▾</span>
      </div>

      {/* Hover Info Tooltip */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-56 p-3 bg-white rounded-xl shadow-xl border border-neutral-100 z-50 text-left">
          <div className="text-xs font-bold text-neutral-900">New Delhi, India (IST)</div>
          <div className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
            Prime Commerce Hub is open for student admissions, counseling, and scheduled Accountancy batches.
          </div>
          <div className="mt-2 text-[10px] font-medium text-[#5B32D6] bg-[#ECE8FA] px-2 py-1 rounded-md inline-block">
            Commerce Coaching Hub
          </div>
        </div>
      )}
    </div>
  );
}
