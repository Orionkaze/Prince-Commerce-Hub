"use client";

import React, { useRef, useState, useEffect } from "react";
import { Badge } from "../ui/Badge";
import {
  AdvantageExperienceDoodle,
  AdvantageConceptDoodle,
  AdvantageStudentDoodle,
  AdvantageSyllabusDoodle,
} from "../doodles/CommerceDoodles";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface AdvantageItem {
  step: string;
  badge: string;
  title: string;
  description: string;
  pills: string[];
  type: "lavender" | "card";
  renderDoodle: () => React.ReactNode;
}

const advantages: AdvantageItem[] = [
  {
    step: "01",
    badge: "HERITAGE & EXCELLENCE",
    title: "30+ years experience",
    description:
      "A decade and a half of proven results and academic excellence in accountancy, guiding generations of commerce students to top ranks.",
    pills: ["30+ Years Trust", "CBSE Specialization", "Proven Pedagogy"],
    type: "lavender",
    renderDoodle: () => <AdvantageExperienceDoodle className="w-36 h-36 sm:w-40 sm:h-40" />,
  },
  {
    step: "02",
    badge: "LOGIC OVER ROTE",
    title: "Concept-Based Learning",
    description:
      "Moving beyond rote memorization to deep conceptual understanding of every accounting standard, financial principle, and adjustment.",
    pills: ["Zero Rote Cramming", "Modern Accounting Rules", "Conceptual Logic"],
    type: "card",
    renderDoodle: () => <AdvantageConceptDoodle className="w-36 h-36 sm:w-40 sm:h-40" />,
  },
  {
    step: "03",
    badge: "PERSONAL ATTENTION",
    title: "Student-Focused",
    description:
      "Personalized attention and individual guidance tailored to each student's learning pace, clearing doubts before they become bottlenecks.",
    pills: ["1-on-1 Guidance", "Instant Doubt Resolution", "Individual Pace"],
    type: "lavender",
    renderDoodle: () => <AdvantageStudentDoodle className="w-36 h-36 sm:w-40 sm:h-40" />,
  },
  {
    step: "04",
    badge: "BOARD EXAM BLUEPRINT",
    title: "Structured Syllabus",
    description:
      "Well-organized study plans, comprehensive working notes, and easy explanations for complex 6-mark board exam numerical problems.",
    pills: ["Working Notes Mastery", "CBSE Marking Scheme", "Chapter-Wise Tests"],
    type: "card",
    renderDoodle: () => <AdvantageSyllabusDoodle className="w-36 h-36 sm:w-40 sm:h-40" />,
  },
];

export function WhatYoullImprove() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(800);
  const [scrollPercent, setScrollPercent] = useState(0);

  // Measure track scrollable distance
  useEffect(() => {
    const updateDimensions = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        // Padding offset so the last card aligns comfortably at the right edge
        const distance = Math.max(0, trackWidth - viewportWidth + 80);
        setMaxScroll(distance);
      }
    };

    updateDimensions();
    const timer = setTimeout(updateDimensions, 600);
    window.addEventListener("resize", updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track progress percentage for buttons and indicator
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollPercent(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Framer-quality smooth spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 25,
    mass: 0.6,
  });

  const x = useTransform(smoothProgress, [0, 1], [0, -maxScroll]);

  // Navigation button handlers
  const handleNext = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentScroll = window.scrollY;
    const sectionTop = currentScroll + rect.top;
    const scrollableDistance = containerRef.current.scrollHeight - window.innerHeight;
    
    window.scrollTo({
      top: Math.min(sectionTop + scrollableDistance, window.scrollY + window.innerHeight * 0.9),
      behavior: "smooth",
    });
  };

  const handlePrev = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentScroll = window.scrollY;
    const sectionTop = currentScroll + rect.top;
    
    window.scrollTo({
      top: Math.max(sectionTop, window.scrollY - window.innerHeight * 0.9),
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative h-[250vh] sm:h-[280vh] bg-white border-t border-neutral-100"
    >
      {/* Sticky Full-Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-12 sm:py-16">
        <div className="max-w-[1240px] w-full mx-auto px-5 sm:px-8 lg:px-10">
          {/* Header Row (Stays pinned in view while cards move) */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 sm:mb-10 gap-6">
            <div className="space-y-4 max-w-[620px]">
              <div>
                <Badge variant="yellow">WHY CHOOSE US</Badge>
              </div>
              <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#16141B]">
                The Prime <br className="hidden sm:inline" />
                Advantage.
              </h2>
            </div>
            <div className="max-w-[400px] space-y-2">
              <p className="text-[16px] lg:text-[17px] leading-[1.6] text-neutral-600 font-normal">
                We provide more than just coaching; we provide a roadmap to academic success in commerce.
              </p>
              {/* Subtle scroll hint */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#5B32D6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5B32D6] animate-ping" />
                <span>Scroll down to explore all benefits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll-Driven Horizontal Track (Clean Uniform Illustrated Advantage Cards) */}
        <div className="w-full overflow-hidden pl-5 sm:pl-8 lg:pl-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))]">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-6 will-change-transform pr-10"
          >
            {advantages.map((item) => (
              <div
                key={item.title}
                className={`flex-none w-[320px] sm:w-[380px] lg:w-[420px] h-[440px] sm:h-[480px] rounded-[28px] p-7 sm:p-9 flex flex-col justify-between shadow-xs transition-transform duration-300 hover:-translate-y-2 select-none border border-neutral-200/70 ${
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
                  <div className="w-full h-[160px] sm:h-[180px] flex items-center justify-center pt-2">
                    {item.renderDoodle()}
                  </div>
                </div>

                {/* Bottom: Title, Description & Feature Pills */}
                <div className="space-y-3 pt-4 border-t border-neutral-200/50">
                  <h3 className="text-[22px] sm:text-[25px] font-extrabold tracking-[-0.02em] leading-[1.2] text-[#16141B]">
                    {item.title}
                  </h3>
                  <p className="text-[14px] sm:text-[15px] leading-[1.55] text-neutral-600">
                    {item.description}
                  </p>

                  {/* Micro Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.pills.map((pill) => (
                      <span
                        key={pill}
                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/80 border border-neutral-200/80 text-neutral-700 shadow-2xs"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Carousel Bottom Controls & Progress Sync */}
        <div className="max-w-[1240px] w-full mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between pt-4">
          {/* Progress Bar Indicator */}
          <div className="flex items-center gap-3">
            <div className="w-28 sm:w-36 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="bg-[#5B32D6] h-full rounded-full transition-all duration-150"
                style={{ width: `${Math.max(scrollPercent * 100, 15)}%` }}
              />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              {scrollPercent > 0.6 ? "Benefits 3–4" : "Benefits 1–2"}
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={scrollPercent <= 0.05}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                scrollPercent > 0.05
                  ? "bg-[#16141B] text-white hover:bg-neutral-800"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
              aria-label="Previous benefits"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={scrollPercent >= 0.95}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                scrollPercent < 0.95
                  ? "bg-[#16141B] text-white hover:bg-neutral-800"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
              aria-label="Next benefits"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
