"use client";

import React, { useState } from "react";
import { Badge } from "../ui/Badge";
import { ScheduleItem } from "@/types";
import { BookingModal } from "./BookingModal";
import { motion } from "framer-motion";

interface ScheduleGroup {
  groupName: string;
  items: ScheduleItem[];
}

const scheduleData: ScheduleGroup[] = [
  {
    groupName: "Class 11 Accountancy (Foundation & Conceptual Clarity)",
    items: [
      {
        id: "c11-1",
        courseName: "Class 11 Accountancy",
        level: "Class 11",
        days: "Mon · Wed · Fri",
        startDate: "Admissions Open",
        time: "4:30 PM – 6:00 PM",
        price: "Inquire",
        status: "Open",
      },
      {
        id: "c11-2",
        courseName: "Class 11 Accountancy",
        level: "Class 11",
        days: "Tue · Thu · Sat",
        startDate: "Admissions Open",
        time: "6:00 PM – 7:30 PM",
        price: "Inquire",
        status: "Open",
      },
    ],
  },
  {
    groupName: "Class 12 Accountancy (Board Excellence & Target 100/100)",
    items: [
      {
        id: "c12-1",
        courseName: "Class 12 Accountancy",
        level: "Class 12",
        days: "Mon · Wed · Fri",
        startDate: "Admissions Open",
        time: "6:00 PM – 7:30 PM",
        price: "Inquire",
        status: "2 Slots Left",
      },
      {
        id: "c12-2",
        courseName: "Class 12 Accountancy",
        level: "Class 12",
        days: "Tue · Thu · Sat",
        startDate: "Admissions Open",
        time: "4:30 PM – 6:00 PM",
        price: "Inquire",
        status: "Open",
      },
    ],
  },
];

export function ClassSchedule() {
  const [selectedSlot, setSelectedSlot] = useState<ScheduleItem | null>(null);

  const getStatusBadge = (status: ScheduleItem["status"], item: ScheduleItem) => {
    switch (status) {
      case "Open":
        return (
          <button
            type="button"
            onClick={() => setSelectedSlot(item)}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#E6F8DC] text-[#2C6E14] hover:bg-[#D4F3C4] transition-colors cursor-pointer select-none"
          >
            Enroll
          </button>
        );
      case "2 Slots Left":
        return (
          <button
            type="button"
            onClick={() => setSelectedSlot(item)}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A] transition-colors cursor-pointer select-none"
          >
            2 Slots Left
          </button>
        );
      case "Full":
        return (
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#991B1B] cursor-not-allowed select-none">
            Full
          </span>
        );
    }
  };

  return (
    <section id="schedule" className="bg-[#1D1136] text-white py-24 lg:py-32">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        {/* Header Section */}
        <div className="space-y-4 max-w-[760px] mb-12 sm:mb-16">
          <div>
            <Badge variant="yellow">UPCOMING BATCHES</Badge>
          </div>
          <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white">
            Class Schedule
          </h2>
          <p className="text-[16px] lg:text-[18px] leading-[1.6] text-[#C4B5FD]/90 font-normal">
            Structured batches for Class 11th and Class 12th Commerce students. Personalized attention, interactive concept discussions, and individual doubt-clearing sessions led by Parvesh Kumar.
          </p>
          <div className="text-sm font-bold text-white pt-1">
            All batch schedules are shown in IST (New Delhi).
          </div>
        </div>

        {/* Column Header Row (Desktop only) */}
        <div className="hidden md:grid grid-cols-12 px-8 pb-4 text-sm font-semibold text-[#C4B5FD] select-none">
          <div className="col-span-2">Class</div>
          <div className="col-span-2">Days</div>
          <div className="col-span-2">Start Status</div>
          <div className="col-span-3">Time</div>
          <div className="col-span-1 text-right">Fee</div>
          <div className="col-span-2 text-right">Enrollment</div>
        </div>

        {/* Grouped White Schedule Cards */}
        <div className="space-y-6">
          {scheduleData.map((group, gIdx) => (
            <motion.div
              key={group.groupName}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gIdx * 0.1 }}
              className="bg-white text-[#16141B] rounded-[24px] p-6 md:p-8 shadow-xl"
            >
              {/* Group Title */}
              <h3 className="text-[20px] lg:text-[22px] font-bold tracking-tight text-[#16141B] pb-4 border-b border-neutral-100 mb-4">
                {group.groupName}
              </h3>

              {/* Rows */}
              <div className="divide-y divide-neutral-100">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-3 md:gap-0 hover:bg-neutral-50/60 rounded-xl px-2 transition-colors"
                  >
                    {/* Level */}
                    <div className="md:col-span-2 font-bold text-[#16141B] text-[15px]">
                      {item.level}
                    </div>

                    {/* Days */}
                    <div className="md:col-span-2 text-neutral-600 text-[14px]">
                      <span className="md:hidden font-semibold text-neutral-400 mr-2">
                        Days:
                      </span>
                      {item.days}
                    </div>

                    {/* Start Date */}
                    <div className="md:col-span-2 text-neutral-600 text-[14px]">
                      <span className="md:hidden font-semibold text-neutral-400 mr-2">
                        Status:
                      </span>
                      {item.startDate}
                    </div>

                    {/* Time */}
                    <div className="md:col-span-3 text-neutral-600 text-[14px]">
                      <span className="md:hidden font-semibold text-neutral-400 mr-2">
                        Time:
                      </span>
                      {item.time}
                    </div>

                    {/* Price */}
                    <div className="md:col-span-1 md:text-right font-extrabold text-[#5B32D6] text-[15px]">
                      {item.price}
                    </div>

                    {/* Status Badge */}
                    <div className="md:col-span-2 md:text-right w-full md:w-auto pt-2 md:pt-0 flex justify-between md:justify-end items-center">
                      <span className="md:hidden text-xs text-neutral-500">
                        Enrollment:
                      </span>
                      {getStatusBadge(item.status, item)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking / Reservation Modal */}
      <BookingModal
        isOpen={!!selectedSlot}
        onClose={() => setSelectedSlot(null)}
        selectedSlot={selectedSlot}
      />
    </section>
  );
}
