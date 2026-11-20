"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "../ui/Badge";
import {
  SpeechBubbleOutline,
  HeartRayOutline,
  AsteriskSparkle,
} from "../doodles/Doodles";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

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

        {/* Scroll-Driven Horizontal Track */}
        <div className="w-full overflow-hidden pl-5 sm:pl-8 lg:pl-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))]">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-6 will-change-transform pr-10"
          >
            {/* Card 1: 30+ years experience */}
            <div className="flex-none w-[320px] sm:w-[400px] lg:w-[440px] h-[440px] sm:h-[480px] rounded-[28px] overflow-hidden relative shadow-md group select-none">
              <Image
                src="/images/accountancy-classroom.jpg"
                alt="30+ years experience in Accountancy coaching"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 320px, 440px"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Top-Right Speech Bubble Icon */}
              <div className="absolute top-6 right-6">
                <SpeechBubbleOutline className="w-9 h-9 text-white/90" />
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <h3 className="text-[22px] lg:text-[24px] font-bold tracking-[-0.02em] leading-[1.25]">
                  30+ years experience
                </h3>
                <p className="text-[14px] lg:text-[15px] leading-[1.5] text-white/80">
                  A decade and a half of proven results and academic excellence in accountancy.
                </p>
              </div>
            </div>

            {/* Card 2: Concept-Based Learning */}
            <div className="flex-none w-[320px] sm:w-[400px] lg:w-[440px] h-[440px] sm:h-[480px] rounded-[28px] overflow-hidden relative shadow-md group select-none">
              <Image
                src="/images/improve-understand-faster.jpg"
                alt="Concept-Based Learning in Commerce"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 320px, 440px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Top-Right Heart Outline Icon */}
              <div className="absolute top-6 right-6">
                <HeartRayOutline className="w-9 h-9 text-white/90" />
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <h3 className="text-[22px] lg:text-[24px] font-bold tracking-[-0.02em] leading-[1.25]">
                  Concept-Based Learning
                </h3>
                <p className="text-[14px] lg:text-[15px] leading-[1.5] text-white/80">
                  Moving beyond rote memorization to deep conceptual understanding of every topic.
                </p>
              </div>
            </div>

            {/* Card 3: Student-Focused (White Split Card) */}
            <div className="flex-none w-[320px] sm:w-[400px] lg:w-[440px] h-[440px] sm:h-[480px] rounded-[28px] bg-white border border-neutral-200/90 p-7 flex flex-col justify-between shadow-xs select-none">
              {/* Top Text */}
              <div className="space-y-3">
                <h3 className="text-[22px] lg:text-[24px] font-bold tracking-[-0.02em] leading-[1.25] text-[#16141B]">
                  Student-Focused
                </h3>
                <p className="text-[14px] lg:text-[15px] leading-[1.5] text-neutral-600">
                  Personalized attention and guidance tailored to each student's learning pace.
                </p>
              </div>

              {/* Bottom Rounded Photo with Doodle */}
              <div className="relative w-full h-[220px] sm:h-[230px] rounded-[20px] overflow-hidden bg-neutral-100">
                <Image
                  src="/images/improve-pronounce-clearly.jpg"
                  alt="Student focused personalized guidance"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 320px, 440px"
                />
                <div className="absolute top-4 right-4 z-10 pointer-events-none">
                  <AsteriskSparkle className="w-10 h-10 text-white drop-shadow-md" />
                </div>
              </div>
            </div>

            {/* Card 4: Structured Syllabus (White Split Card) */}
            <div className="flex-none w-[320px] sm:w-[400px] lg:w-[440px] h-[440px] sm:h-[480px] rounded-[28px] bg-white border border-neutral-200/90 p-7 flex flex-col justify-between shadow-xs select-none">
              {/* Top Rounded Photo */}
              <div className="relative w-full h-[220px] sm:h-[230px] rounded-[20px] overflow-hidden bg-neutral-100">
                <Image
                  src="/images/improve-what-to-say.jpg"
                  alt="Structured syllabus and exam preparation"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 320px, 440px"
                />
              </div>

              {/* Bottom Text */}
              <div className="space-y-3 pt-4">
                <h3 className="text-[22px] lg:text-[24px] font-bold tracking-[-0.02em] leading-[1.25] text-[#16141B]">
                  Structured Syllabus
                </h3>
                <p className="text-[14px] lg:text-[15px] leading-[1.5] text-neutral-600">
                  Well-organized study plans and easy explanations for complex accounting problems.
                </p>
              </div>
            </div>
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
