"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  HeroSparkle,
  HeroCurlyArrow,
  HeroHandwrittenNote,
} from "../doodles/Doodles";
import { Video, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onOpenContact: () => void;
  onExploreCourses: () => void;
}

export function HeroSection({ onOpenContact, onExploreCourses }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-16 pb-24 lg:py-24"
      style={{
        background: "linear-gradient(135deg, #4E2EC2 0%, #371B94 55%, #241068 100%)",
      }}
    >
      {/* Background ambient glow circles */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (lg:col-span-7) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 text-white space-y-6"
          >
            {/* Yellow Tag */}
            <div>
              <Badge variant="yellow">YOUR ENGLISH. YOUR EVERYDAY LIFE.</Badge>
            </div>

            {/* H1 Heading */}
            <h1 className="text-[44px] sm:text-[60px] lg:text-[74px] font-extrabold tracking-[-0.035em] leading-[1.03] text-white">
              Speak English <br />
              with more <br />
              confidence in <br />
              <span className="relative inline-block">
                <span className="relative z-10">real life.</span>
                {/* Soft brush-stroke highlighter backdrop */}
                <span
                  className="absolute left-0 -bottom-1 w-[105%] h-8 sm:h-11 bg-white/20 rounded-md -rotate-1 z-0 pointer-events-none"
                  style={{ backdropFilter: "blur(2px)" }}
                />
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-[16px] sm:text-[18px] lg:text-[19px] leading-[1.6] text-white/85 max-w-[540px] font-normal pt-2">
              Practical online English lessons for everyday conversation, travel,
              work, young learners, and international exam preparation — from
              beginner level and up.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button variant="white" size="lg" onClick={onOpenContact}>
                Contact Jave
              </Button>
              <Button
                variant="outline-white"
                size="lg"
                onClick={onExploreCourses}
                href="#courses"
              >
                Find English Course
              </Button>
            </div>

            {/* Sparkle and Curly Arrow Doodles */}
            <div className="relative pt-4 hidden sm:block">
              <div className="absolute left-[380px] -top-12">
                <HeroSparkle className="w-10 h-10 text-white/70 animate-pulse" />
              </div>
              <div className="absolute left-[400px] top-4">
                <HeroCurlyArrow className="w-28 h-28 text-white/60 -rotate-12" />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Polaroid Scrapbook Stack (lg:col-span-5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >
            {/* Top right floating note: Learn / Explore / grow */}
            <div className="absolute -top-10 right-6 z-20 hidden sm:block">
              <HeroHandwrittenNote />
            </div>

            {/* Polaroid Scrapbook Container */}
            <div className="relative w-full max-w-[390px] sm:max-w-[430px] my-6">
              {/* Backing Yellow Highlighter Paper 1 (Rotated +3deg) */}
              <div
                className="absolute inset-0 bg-[#FDE047] rounded-[28px] transform rotate-[3deg] shadow-lg translate-x-2 translate-y-3 pointer-events-none"
                style={{ width: "98%", height: "100%" }}
              />

              {/* Backing Yellow Highlighter Paper 2 (Rotated -4deg) */}
              <div
                className="absolute inset-0 bg-[#FACC15] rounded-[28px] transform -rotate-[4deg] opacity-90 shadow-md -translate-x-3 -translate-y-2 pointer-events-none"
                style={{ width: "102%", height: "98%" }}
              />

              {/* Smaller Peek Card Behind: Dublin Harbor */}
              <div
                className="absolute -right-8 sm:-right-12 top-28 w-36 sm:w-44 h-48 sm:h-56 bg-white p-2 pb-4 rounded-[18px] shadow-xl transform rotate-[7deg] z-0 overflow-hidden border border-neutral-100 hidden xs:block"
              >
                <div className="relative w-full h-full rounded-[12px] overflow-hidden">
                  <Image
                    src="/images/hero-dublin.jpg"
                    alt="Dublin Coastline"
                    fill
                    className="object-cover"
                    sizes="180px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white tracking-wider">
                    DUBLIN, IE
                  </div>
                </div>
              </div>

              {/* Main Polaroid Frame (Rotated -2deg) */}
              <motion.div
                whileHover={{ rotate: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 bg-white p-3.5 pb-5 rounded-[26px] shadow-2xl transform -rotate-[2deg] transition-transform cursor-pointer border border-white/50"
              >
                {/* Main Photo of Jave Carter */}
                <div className="relative w-full aspect-[4/4.2] rounded-[20px] overflow-hidden bg-neutral-100">
                  <Image
                    src="/images/hero-jave.jpg"
                    alt="Jave Carter — CELTA Certified English Teacher"
                    fill
                    priority
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 420px"
                  />
                </div>

                {/* Nameplate Footer */}
                <div className="pt-4 px-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-[22px] tracking-tight text-[#16141B]">
                      Jave Carter
                    </h3>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                  </div>
                  <div className="text-[14px] font-medium text-neutral-600">
                    CELTA Certified English Teacher
                  </div>
                  <div className="text-[13px] text-neutral-400">
                    Native Speaker / Dublin, Ireland
                  </div>
                </div>

                {/* Overlapping Floating Pill Badge: 100% online */}
                <div className="absolute -bottom-3 right-6 bg-white py-2 px-3.5 rounded-full shadow-lg border border-neutral-200/80 flex items-center gap-2 z-20">
                  <Video className="w-4 h-4 text-[#5B32D6]" />
                  <span className="text-xs font-bold text-[#16141B] tracking-tight">
                    100% online
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
