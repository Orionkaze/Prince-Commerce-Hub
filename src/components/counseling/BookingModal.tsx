"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Clock,
  Video,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";

export interface BookingSlotSelection {
  programId: string;
  date: Date;
  dateStr: string;        // e.g. "FRIDAY, NOV 27"
  formattedShort: string; // e.g. "Fri, Nov 27"
  timeSlot: string;       // e.g. "11:00 AM – 11:30 AM"
  startTime: string;      // e.g. "11:00 AM"
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  programTitle: string;
  programId: string;
  onConfirmSlot: (slot: BookingSlotSelection) => void;
  initialDate?: Date;
  initialSlot?: string;
}

export function BookingModal({
  isOpen,
  onClose,
  programTitle,
  programId,
  onConfirmSlot,
  initialDate,
  initialSlot = "11:00 AM – 11:30 AM",
}: BookingModalProps) {
  // Baseline date deferred into effect to avoid Next.js unstable value warning
  const [today, setToday] = useState<Date | null>(null);

  // Default selected date: null if fresh, or initialDate if passed
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null);

  // Calendar month view navigation state
  const [viewYear, setViewYear] = useState<number>(() =>
    initialDate ? initialDate.getFullYear() : 2026
  );
  const [viewMonth, setViewMonth] = useState<number>(() =>
    initialDate ? initialDate.getMonth() : 10
  ); // 0-indexed (November = 10)

  // Sync today date on mount (client-side only)
  useEffect(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setToday(d);
    if (!initialDate) {
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [initialDate]);

  // Selected time slot (null until chosen, or initialSlot if date was already chosen)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(() => {
    return initialDate ? initialSlot : null;
  });

  if (!isOpen) return null;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const shortMonthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const dayNames = [
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"
  ];

  const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Can user navigate to previous month? (Don't allow months before current month)
  const isCurrentMonthOrPast = today
    ? viewYear < today.getFullYear() ||
      (viewYear === today.getFullYear() && viewMonth <= today.getMonth())
    : false;

  const handlePrevMonth = () => {
    if (isCurrentMonthOrPast) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Days in current view month
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday

  // Standard 30-minute time slots from 9:00 AM to 6:00 PM
  const allSlots = [
    { label: "9:00 AM – 9:30 AM", disabled: false },
    { label: "9:30 AM – 10:00 AM", disabled: false },
    { label: "10:00 AM – 10:30 AM", disabled: false },
    { label: "10:30 AM – 11:00 AM", disabled: true }, // simulation of booked slot
    { label: "11:00 AM – 11:30 AM", disabled: false },
    { label: "11:30 AM – 12:00 PM", disabled: false },
    { label: "12:00 PM – 12:30 PM", disabled: false },
    { label: "12:30 PM – 1:00 PM", disabled: true },
    { label: "1:00 PM – 1:30 PM", disabled: false },
    { label: "2:00 PM – 2:30 PM", disabled: false },
    { label: "2:30 PM – 3:00 PM", disabled: false },
    { label: "3:00 PM – 3:30 PM", disabled: false },
    { label: "3:30 PM – 4:00 PM", disabled: true },
    { label: "4:00 PM – 4:30 PM", disabled: false },
    { label: "4:30 PM – 5:00 PM", disabled: false },
    { label: "5:00 PM – 5:30 PM", disabled: false },
    { label: "5:30 PM – 6:00 PM", disabled: false },
  ];

  // Formatted headers for right column
  const selectedDayName = selectedDate ? dayNames[selectedDate.getDay()] : "";
  const selectedMonthShort = selectedDate
    ? shortMonthNames[selectedDate.getMonth()].toUpperCase()
    : "";
  const selectedDayNum = selectedDate ? selectedDate.getDate() : 0;
  const rightColumnHeader = selectedDate
    ? `${selectedDayName}, ${selectedMonthShort} ${selectedDayNum}`
    : "";

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    newDate.setHours(0, 0, 0, 0);
    if (today && newDate < today) return; // Ignore past dates
    setSelectedDate(newDate);

    // If no slot chosen, select default slot so user can immediately proceed
    if (!selectedSlot) {
      setSelectedSlot("11:00 AM – 11:30 AM");
    }
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedSlot) return;

    const shortDay = shortDayNames[selectedDate.getDay()];
    const shortMonth = shortMonthNames[selectedDate.getMonth()];
    const startTime = selectedSlot.split(" – ")[0];

    const slotData: BookingSlotSelection = {
      programId,
      date: selectedDate,
      dateStr: `${selectedDayName}, ${selectedMonthShort} ${selectedDayNum}`,
      formattedShort: `${shortDay}, ${shortMonth} ${selectedDayNum}`,
      timeSlot: selectedSlot,
      startTime: startTime,
    };

    onConfirmSlot(slotData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#0F1B33]">Book Session 1</h3>
            <p className="text-xs text-neutral-500 font-medium">
              {programTitle} · 30 min
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Columns Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
          {/* Column 1: Session Details */}
          <div className="md:col-span-4 p-6 flex flex-col justify-between space-y-6 bg-neutral-50/50">
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                  SESSION 1 OF 1
                </span>
                <h4 className="text-xl font-extrabold text-[#0F1B33] mt-0.5">Session 1</h4>
              </div>

              <div className="space-y-3.5 text-xs text-neutral-600">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>30 minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>Zoom Meeting</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>1-on-1 with your coach</span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200/70">
                <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 block mb-1.5">
                  AGENDA
                </span>
                <p className="text-xs text-neutral-700 font-medium">
                  doubt solving
                </p>
              </div>
            </div>

            <div className="text-[11px] text-neutral-400">
              Personal meeting link will be emailed once booking is completed.
            </div>
          </div>

          {/* Column 2: REAL DYNAMIC CALENDAR */}
          <div className="md:col-span-4 p-6 space-y-5">
            {/* Month & Year Bar with Navigation */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={isCurrentMonthOrPast}
                className="text-neutral-500 hover:text-neutral-900 p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-[#0F1B33]">
                {monthNames[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="text-neutral-500 hover:text-neutral-900 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Calendar Days Table */}
            <div>
              <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-neutral-400 mb-2">
                <span>SU</span>
                <span>MO</span>
                <span>TU</span>
                <span>WE</span>
                <span>TH</span>
                <span>FR</span>
                <span>SA</span>
              </div>

              <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs">
                {/* Empty placeholders before 1st day of month */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-7 h-7" />
                ))}

                {/* Days of current month */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const dayDate = new Date(viewYear, viewMonth, day);
                  dayDate.setHours(0, 0, 0, 0);

                  // Past dates are strictly disabled!
                  const isPast = today ? dayDate < today : false;

                  // Selected date check
                  const isSelected =
                    selectedDate !== null &&
                    selectedDate.getFullYear() === viewYear &&
                    selectedDate.getMonth() === viewMonth &&
                    selectedDate.getDate() === day;

                  return (
                    <div key={day} className="flex items-center justify-center py-0.5">
                      {isPast ? (
                        <span className="text-neutral-300 select-none text-xs w-7 h-7 flex items-center justify-center cursor-not-allowed">
                          {day}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDateClick(day)}
                          className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#5B54E6] text-white shadow-md scale-105"
                              : "bg-[#EEF2FF] text-[#5B54E6] hover:bg-[#E0E7FF] hover:scale-105"
                          }`}
                        >
                          {day}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timezone Dropdown */}
            <div className="pt-3 border-t border-neutral-100">
              <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1.5 mb-1.5">
                <Globe className="w-3.5 h-3.5 text-neutral-400" />
                TIMEZONE
              </label>
              <div className="text-xs bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-200/80 text-neutral-700 font-medium">
                India Standard Time (GMT+5:30)
              </div>
            </div>
          </div>

          {/* Column 3: Scrollable 30-min Slots (Shows only after date pick!) */}
          <div className="md:col-span-4 p-6 flex flex-col h-[380px] bg-white">
            {selectedDate ? (
              <div className="flex flex-col h-full animate-in fade-in duration-200">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3 pb-2 border-b border-neutral-100 flex items-center justify-between">
                  <span>{rightColumnHeader}</span>
                  <span className="text-[10px] text-[#5B54E6] font-semibold">Select Time</span>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                  {allSlots.map((slot, idx) => {
                    const isSelected = selectedSlot === slot.label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={slot.disabled}
                        onClick={() => setSelectedSlot(slot.label)}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-medium text-center transition-all cursor-pointer ${
                          slot.disabled
                            ? "opacity-35 bg-neutral-100 text-neutral-400 cursor-not-allowed line-through"
                            : isSelected
                            ? "border-2 border-[#5B54E6] text-[#5B54E6] bg-[#5B54E6]/5 font-bold shadow-xs"
                            : "border border-neutral-200/80 hover:border-[#5B54E6]/50 text-neutral-700 hover:bg-neutral-50"
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#EEF2FF] text-[#5B54E6] flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-[#0F1B33]">
                  Select a Date
                </div>
                <p className="text-xs text-neutral-400 max-w-[190px] leading-relaxed">
                  Click on an available date in the calendar to view available time slots.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50/80 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-500 text-center sm:text-left">
            {!selectedDate
              ? "Pick a date on the calendar to view available slots"
              : !selectedSlot
              ? "Select a time slot to hold your booking"
              : "Slot selected! Click continue to proceed"}
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedDate || !selectedSlot}
              onClick={handleContinue}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-[#5B54E6] text-white text-xs font-bold hover:bg-[#4A43D4] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
