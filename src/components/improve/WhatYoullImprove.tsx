"use client";

import React, { useRef, useState, useEffect } from "react";
import { Badge } from "../ui/Badge";
import {
  AdvantageExperienceDoodle,
  AdvantageConceptDoodle,
  AdvantageStudentDoodle,
  AdvantageSyllabusDoodle,
} from "../doodles/CommerceDoodles";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

interface AdvantagePoint {
  title: string;
  detail: string;
}

interface AdvantageItem {
  step: string;
  badge: string;
  title: string;
  description: string;
  points: AdvantagePoint[];
  pills: string[];
  type: "lavender" | "card";
  renderDoodle: () => React.ReactNode;
}

const advantages: AdvantageItem[] = [
  {
    step: "01",
    badge: "HERITAGE & TRUST",
    title: "30+ years experience",
    description:
      "Three decades of proven results and academic excellence in accountancy, mentoring commerce students to top ranks.",
    points: [
      {
        title: "10,000+ Students Mentored",
        detail: "Decades of guiding Class 11th and 12th students to 95%+ and 100/100 board scores.",
      },
      {
        title: "CBSE & ISC Blueprint Expertise",
        detail: "Deep understanding of syllabus trends, tricky examiner traps, and marking schemes.",
      },
      {
        title: "Proven Pedagogical Methods",
        detail: "Time-tested teaching frameworks that make complex financial statements simple.",
      },
    ],
    pills: ["30+ Years Trust", "CBSE Specialization", "Board Rankers"],
    type: "lavender",
    renderDoodle: () => <AdvantageExperienceDoodle className="w-32 h-32 sm:w-36 sm:h-36" />,
  },
  {
    step: "02",
    badge: "LOGIC OVER ROTE",
    title: "Concept-Based Learning",
    description:
      "Moving beyond blind memorization to deep conceptual clarity of every accounting standard and principle.",
    points: [
      {
        title: "Accounting Logic First",
        detail: "Understanding the financial reasoning behind every Debit and Credit entry.",
      },
      {
        title: "Zero Rote Cramming",
        detail: "Mastering modern accounting rules intuitively without mugging up endless formats.",
      },
      {
        title: "Practical Business Context",
        detail: "Connecting textbook ledger entries to real-world corporate balance sheets.",
      },
    ],
    pills: ["Zero Blind Cramming", "Modern Rules", "Financial Logic"],
    type: "card",
    renderDoodle: () => <AdvantageConceptDoodle className="w-32 h-32 sm:w-36 sm:h-36" />,
  },
  {
    step: "03",
    badge: "PERSONAL ATTENTION",
    title: "Student-Focused",
    description:
      "Personalized attention and individual guidance tailored to each student's unique learning pace and doubts.",
    points: [
      {
        title: "Individual Pace Monitoring",
        detail: "Continuous assessment to catch weaknesses early before they turn into exam panic.",
      },
      {
        title: "Direct 1-on-1 Doubt Sessions",
        detail: "Personalized doubt clearing with Parvesh Sir for tricky adjustment entries.",
      },
      {
        title: "Supportive Mentorship",
        detail: "Encouraging environment where no student hesitates to ask foundational questions.",
      },
    ],
    pills: ["Small Batch Focus", "1-on-1 Doubts", "Paced Learning"],
    type: "lavender",
    renderDoodle: () => <AdvantageStudentDoodle className="w-32 h-32 sm:w-36 sm:h-36" />,
  },
  {
    step: "04",
    badge: "BOARD EXAM BLUEPRINT",
    title: "Structured Syllabus",
    description:
      "Well-organized study plans, comprehensive working notes, and easy explanations for complex numerical problems.",
    points: [
      {
        title: "Curated Chapter Roadmaps",
        detail: "Step-by-step coverage from Partnership to Share Capital and Cash Flow Statements.",
      },
      {
        title: "Full-Mark Working Notes",
        detail: "Detailed training on writing clean, step-by-step working notes per CBSE marking criteria.",
      },
      {
        title: "Timed Mock Drills",
        detail: "Regular exam-condition tests to build speed, composure, and calculation accuracy.",
      },
    ],
    pills: ["Working Notes Mastery", "CBSE Marking Scheme", "Chapter-Wise Tests"],
    type: "card",
    renderDoodle: () => <AdvantageSyllabusDoodle className="w-32 h-32 sm:w-36 sm:h-36" />,
  },
];

export function WhatYoullImprove() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update scroll buttons and progress indicator on manual scroll
  const handleScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    const maxScrollLeft = scrollWidth - clientWidth;
    
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < maxScrollLeft - 20);

    if (maxScrollLeft > 0) {
      setScrollProgress(scrollLeft / maxScrollLeft);
    }
  };

  useEffect(() => {
    handleScroll();
    const track = trackRef.current;
    if (track) {
      track.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll);
    }
    return () => {
      if (track) track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Manual scroll handlers (clicking chevron buttons)
  const scrollByAmount = (amount: number) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white py-20 lg:py-28 border-t border-neutral-100">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-14 gap-6">
          <div className="space-y-4 max-w-[620px]">
            <div>
              <Badge variant="yellow">WHY CHOOSE US</Badge>
            </div>
            <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#16141B]">
              The Prime <br className="hidden sm:inline" />
              Advantage.
            </h2>
          </div>
          <div className="max-w-[420px] space-y-4">
            <p className="text-[16px] lg:text-[17px] leading-[1.6] text-neutral-600 font-normal">
              We provide more than just coaching; we provide a structured roadmap to conceptual mastery and board exam excellence in commerce.
            </p>
            {/* Desktop Navigation Controls in Header */}
            <div className="flex items-center gap-4 pt-1">
              {/* Progress Bar Indicator */}
              <div className="flex items-center gap-2.5">
                <div className="w-24 sm:w-28 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="bg-[#5B32D6] h-full rounded-full transition-all duration-150"
                    style={{ width: `${Math.max(scrollProgress * 100, 20)}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">
                  {scrollProgress > 0.5 ? "Benefits 3–4" : "Benefits 1–2"}
                </span>
              </div>

              {/* Prev / Next Manual Scroll Buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => scrollByAmount(-440)}
                  disabled={!canScrollLeft}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                    canScrollLeft
                      ? "bg-[#16141B] text-white hover:bg-neutral-800 border-[#16141B]"
                      : "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
                  }`}
                  aria-label="Previous advantages"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByAmount(440)}
                  disabled={!canScrollRight}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                    canScrollRight
                      ? "bg-[#16141B] text-white hover:bg-neutral-800 border-[#16141B]"
                      : "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
                  }`}
                  aria-label="Next advantages"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Horizontal Scroll Track (Natural, No Page Lock, Snap-Scrollable) */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 sm:px-8 lg:px-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))] pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none"
      >
        {advantages.map((item) => (
          <div
            key={item.title}
            className={`flex-none w-[320px] sm:w-[380px] lg:w-[410px] rounded-[28px] p-7 sm:p-8 flex flex-col justify-between shadow-xs transition-transform duration-300 hover:-translate-y-1.5 snap-start border border-neutral-200/70 ${
              item.type === "lavender" ? "bg-[#ECE8FA]" : "bg-[#F7F7F9]"
            }`}
          >
            {/* Top: Header Badge & Vector Illustration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="yellow">{item.badge}</Badge>
                <span className="text-xs font-bold text-[#5B32D6] tracking-wider uppercase">
                  BENEFIT {item.step}
                </span>
              </div>

              {/* Centered Vector Doodle */}
              <div className="w-full h-[140px] flex items-center justify-center pt-1">
                {item.renderDoodle()}
              </div>

              {/* Title & Core Description */}
              <div className="space-y-2 pt-2">
                <h3 className="text-[22px] sm:text-[24px] font-extrabold tracking-[-0.02em] leading-[1.2] text-[#16141B]">
                  {item.title}
                </h3>
                <p className="text-[14px] leading-[1.55] text-neutral-600">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Middle: Precise Key Points */}
            <div className="my-5 pt-4 border-t border-neutral-200/60 space-y-3">
              <div className="text-[11px] font-extrabold tracking-wider uppercase text-[#5B32D6]">
                Key Educational Highlights:
              </div>
              <ul className="space-y-2.5">
                {item.points.map((pt) => (
                  <li key={pt.title} className="flex items-start gap-2.5 text-xs sm:text-[13px] leading-[1.45] text-neutral-700">
                    <CheckCircle2 className="w-4 h-4 text-[#5B32D6] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold text-[#16141B]">{pt.title}: </strong>
                      <span className="text-neutral-600">{pt.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom: Feature Pills */}
            <div className="pt-3 border-t border-neutral-200/50 flex flex-wrap gap-1.5">
              {item.pills.map((pill) => (
                <span
                  key={pill}
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-neutral-200 text-neutral-700 shadow-2xs"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
