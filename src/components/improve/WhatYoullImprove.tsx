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
      "Over three decades of proven results and academic excellence in accountancy.",
    points: [
      {
        title: "30,000+ Students Mentored",
        detail: "Proven track record of guiding students to 95%+ and 100/100 board scores.",
      },
      {
        title: "CBSE Specialization",
        detail: "Deep expertise in question patterns, examiner traps, and marking schemes.",
      },
    ],
    pills: ["30+ Years Trust", "Board Rankers"],
    type: "lavender",
    renderDoodle: () => <AdvantageExperienceDoodle className="w-24 h-24 sm:w-28 sm:h-28" />,
  },
  {
    step: "02",
    badge: "LOGIC OVER ROTE",
    title: "Concept-Based Learning",
    description:
      "Moving beyond rote memorization to deep conceptual understanding of every topic.",
    points: [
      {
        title: "Logic-First Accounting",
        detail: "Clear financial reasoning behind every Debit and Credit transaction.",
      },
      {
        title: "Zero Blind Cramming",
        detail: "Master modern accounting rules intuitively without mugging up formats.",
      },
    ],
    pills: ["Financial Logic", "Modern Rules"],
    type: "card",
    renderDoodle: () => <AdvantageConceptDoodle className="w-24 h-24 sm:w-28 sm:h-28" />,
  },
  {
    step: "03",
    badge: "PERSONAL ATTENTION",
    title: "Student-Focused",
    description:
      "Personalized attention and individual guidance tailored to each student's learning pace.",
    points: [
      {
        title: "Individual Pace Monitoring",
        detail: "Continuous assessment to catch weaknesses before they turn into exam panic.",
      },
      {
        title: "1-on-1 Doubt Sessions",
        detail: "Direct personal clarity with Parvesh Sir for tricky adjustment entries.",
      },
    ],
    pills: ["Small Batch Focus", "Direct Doubts"],
    type: "lavender",
    renderDoodle: () => <AdvantageStudentDoodle className="w-24 h-24 sm:w-28 sm:h-28" />,
  },
  {
    step: "04",
    badge: "BOARD EXAM BLUEPRINT",
    title: "Structured Syllabus",
    description:
      "Well-organized study plans and easy explanations for complex accounting problems.",
    points: [
      {
        title: "Curated Roadmaps",
        detail: "Step-by-step from Partnership to Share Capital and Cash Flow Statements.",
      },
      {
        title: "Full-Mark Working Notes",
        detail: "Training on writing clean, step-by-step working notes per CBSE criteria.",
      },
    ],
    pills: ["Working Notes", "CBSE Scheme"],
    type: "card",
    renderDoodle: () => <AdvantageSyllabusDoodle className="w-24 h-24 sm:w-28 sm:h-28" />,
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
    <section className="bg-white py-16 sm:py-20 lg:py-24 border-t border-neutral-100">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header (Clean: Title & Description only) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="space-y-4 max-w-[620px]">
            <div>
              <Badge variant="yellow">WHY CHOOSE US</Badge>
            </div>
            <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#16141B]">
              The Prime <br className="hidden sm:inline" />
              Advantage.
            </h2>
          </div>
          <div className="max-w-[420px]">
            <p className="text-[16px] lg:text-[17px] leading-[1.6] text-neutral-600 font-normal">
              We provide more than just coaching; we provide a roadmap to academic success in commerce.
            </p>
          </div>
        </div>
      </div>

      {/* Manual Horizontal Scroll Track (Compact, Sleek, Precise Cards) */}
      <div
        ref={trackRef}
        className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 sm:px-8 lg:px-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))] pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none"
      >
        {advantages.map((item) => (
          <div
            key={item.title}
            className={`flex-none w-[290px] sm:w-[330px] lg:w-[350px] rounded-[24px] p-6 sm:p-7 flex flex-col justify-between shadow-xs transition-transform duration-300 hover:-translate-y-1 snap-start border border-neutral-200/70 ${
              item.type === "lavender" ? "bg-[#ECE8FA]" : "bg-[#F7F7F9]"
            }`}
          >
            {/* Top: Header Badge & Vector Illustration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="yellow">{item.badge}</Badge>
                <span className="text-xs font-bold text-[#5B32D6] tracking-wider uppercase">
                  BENEFIT {item.step}
                </span>
              </div>

              {/* Centered Vector Doodle */}
              <div className="w-full h-[115px] flex items-center justify-center pt-1">
                {item.renderDoodle()}
              </div>

              {/* Title & Core Description */}
              <div className="space-y-1.5 pt-1">
                <h3 className="text-[20px] sm:text-[21px] font-bold tracking-[-0.02em] leading-[1.25] text-[#16141B]">
                  {item.title}
                </h3>
                <p className="text-[13px] sm:text-[14px] leading-[1.5] text-neutral-600">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Middle: 2 Crisp Key Points */}
            <div className="my-4 pt-3.5 border-t border-neutral-200/60 space-y-2.5">
              {item.points.map((pt) => (
                <div key={pt.title} className="flex items-start gap-2 text-xs sm:text-[13px] leading-[1.4] text-neutral-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5B32D6] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#16141B]">{pt.title}: </span>
                    <span className="text-neutral-600">{pt.detail}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom: Feature Pills */}
            <div className="pt-3 border-t border-neutral-200/50 flex flex-wrap gap-1.5">
              {item.pills.map((pill) => (
                <span
                  key={pill}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-neutral-200 text-neutral-700 shadow-2xs"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Controls Bar (Below Cards: Progress Indicator + Prev/Next Arrow Buttons) */}
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between pt-6 sm:pt-8">
        {/* Progress Bar Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-28 sm:w-36 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="bg-[#5B32D6] h-full rounded-full transition-all duration-150"
              style={{ width: `${Math.max(scrollProgress * 100, 25)}%` }}
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            {scrollProgress > 0.5 ? "Benefits 3–4" : "Benefits 1–2"}
          </span>
        </div>

        {/* Prev / Next Manual Scroll Chevron Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => scrollByAmount(-370)}
            disabled={!canScrollLeft}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              canScrollLeft
                ? "bg-[#16141B] text-white hover:bg-neutral-800 border-[#16141B]"
                : "bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed"
            }`}
            aria-label="Previous advantages"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(370)}
            disabled={!canScrollRight}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              canScrollRight
                ? "bg-[#16141B] text-white hover:bg-neutral-800 border-[#16141B]"
                : "bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed"
            }`}
            aria-label="Next advantages"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
