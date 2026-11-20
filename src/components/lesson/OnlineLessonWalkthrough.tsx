"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "../ui/Badge";
import { LessonStepCurlyLoop } from "../doodles/Doodles";
import { motion } from "framer-motion";

interface StepItem {
  num: string;
  title: string;
  desc?: string;
  image: string;
  tapeTopRotation: string;
  tapeBottomRotation: string;
}

export function OnlineLessonWalkthrough() {
  const row1Steps: (StepItem & { offsetClass: string })[] = [
    {
      num: "01",
      title: "Join scheduled class on Google Meet.",
      image: "/images/step-01.jpg",
      tapeTopRotation: "rotate-[-3deg]",
      tapeBottomRotation: "rotate-[2deg]",
      offsetClass: "lg:mt-0",
    },
    {
      num: "02",
      title: "Review what you learned last time.",
      image: "/images/step-02.jpg",
      tapeTopRotation: "rotate-[3deg]",
      tapeBottomRotation: "rotate-[-3deg]",
      offsetClass: "lg:mt-20",
    },
    {
      num: "03",
      title: "Learn new English with Jave.",
      image: "/images/step-03.jpg",
      tapeTopRotation: "rotate-[-2deg]",
      tapeBottomRotation: "rotate-[4deg]",
      offsetClass: "lg:mt-40",
    },
  ];

  const row2Steps: (StepItem & { offsetClass: string })[] = [
    {
      num: "06",
      title: "Review and practice before your next lesson.",
      desc: "After class, Jave shares the lesson materials, notes, and short homework or practice activities. When a lesson recording is available, you can also watch it again later.",
      image: "/images/step-06.jpg",
      tapeTopRotation: "rotate-[3deg]",
      tapeBottomRotation: "rotate-[-2deg]",
      offsetClass: "lg:mt-32",
    },
    {
      num: "05",
      title: "Jave helps you fix mistakes as you learn.",
      image: "/images/step-05.jpg",
      tapeTopRotation: "rotate-[-3deg]",
      tapeBottomRotation: "rotate-[3deg]",
      offsetClass: "lg:mt-16",
    },
    {
      num: "04",
      title: "You spend most of the lesson actually using English.",
      image: "/images/step-04.jpg",
      tapeTopRotation: "rotate-[2deg]",
      tapeBottomRotation: "rotate-[-4deg]",
      offsetClass: "lg:mt-0",
    },
  ];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        {/* Centered Header */}
        <div className="text-center max-w-[720px] mx-auto space-y-4 mb-20 lg:mb-24">
          <div>
            <Badge variant="yellow">ONLINE LESSONS</Badge>
          </div>
          <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#16141B]">
            What does an online lesson with Jave look like?
          </h2>
          <p className="text-[16px] lg:text-[18px] leading-[1.6] text-neutral-600 font-normal pt-2">
            Each lesson follows a clear structure with time to learn, practice, get
            feedback, and know what to work on next.
          </p>
        </div>

        {/* Staggered Row 1 (Steps 01, 02, 03 stepping downward left-to-right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-10">
          {row1Steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`flex flex-col space-y-5 ${step.offsetClass}`}
            >
              {/* Header with Muted Lavender Number */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#DDD6FE]">
                  {step.num}
                </span>
                <h3 className="text-[20px] lg:text-[23px] font-bold tracking-[-0.02em] leading-[1.25] text-[#16141B]">
                  {step.title}
                </h3>
              </div>

              {/* Photo Frame with Yellow Tape Bars and Curly Loop */}
              <div className="relative pt-4 pb-4">
                {/* Yellow Highlighter Tape Bar (Top edge) */}
                <div
                  className={`absolute -top-1 left-8 w-28 h-6 bg-[#FDE047] rounded-xs shadow-xs z-0 opacity-90 ${step.tapeTopRotation}`}
                />

                {/* Hand-drawn Purple Curly Loop on Left Edge */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <LessonStepCurlyLoop className="w-6 h-10 text-[#5B32D6]" />
                </div>

                {/* Main Photo Card */}
                <div className="relative z-10 w-full h-[280px] sm:h-[300px] rounded-[24px] overflow-hidden bg-neutral-100 shadow-md border-2 border-white">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 360px"
                  />
                </div>

                {/* Yellow Highlighter Tape Bar (Bottom edge) */}
                <div
                  className={`absolute -bottom-1 right-8 w-28 h-6 bg-[#FDE047] rounded-xs shadow-xs z-0 opacity-90 ${step.tapeBottomRotation}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Staggered Row 2 (Steps 06, 05, 04 stepping upward left-to-right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-10 mt-16 lg:mt-24">
          {row2Steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`flex flex-col space-y-5 ${step.offsetClass}`}
            >
              {/* Header with Muted Lavender Number */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#DDD6FE]">
                  {step.num}
                </span>
                <h3 className="text-[20px] lg:text-[23px] font-bold tracking-[-0.02em] leading-[1.25] text-[#16141B]">
                  {step.title}
                </h3>
              </div>

              {/* Optional paragraph for Step 06 */}
              {step.desc && (
                <p className="text-[14px] lg:text-[15px] leading-[1.6] text-neutral-600">
                  {step.desc}
                </p>
              )}

              {/* Photo Frame with Yellow Tape Bars and Curly Loop */}
              <div className="relative pt-4 pb-4">
                {/* Yellow Highlighter Tape Bar (Top edge) */}
                <div
                  className={`absolute -top-1 left-8 w-28 h-6 bg-[#FDE047] rounded-xs shadow-xs z-0 opacity-90 ${step.tapeTopRotation}`}
                />

                {/* Hand-drawn Purple Curly Loop on Left Edge */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <LessonStepCurlyLoop className="w-6 h-10 text-[#5B32D6]" />
                </div>

                {/* Main Photo Card */}
                <div className="relative z-10 w-full h-[280px] sm:h-[300px] rounded-[24px] overflow-hidden bg-neutral-100 shadow-md border-2 border-white">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 360px"
                  />
                </div>

                {/* Yellow Highlighter Tape Bar (Bottom edge) */}
                <div
                  className={`absolute -bottom-1 right-8 w-28 h-6 bg-[#FDE047] rounded-xs shadow-xs z-0 opacity-90 ${step.tapeBottomRotation}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
