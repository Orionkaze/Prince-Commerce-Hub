"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "../ui/Badge";
import { SunburstDoodle } from "../doodles/Doodles";
import { VideoModal } from "./VideoModal";
import { Play, Award, BookOpen, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function InstructorIntro() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section id="about" className="bg-white py-20 lg:py-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Label */}
        <div className="mb-4">
          <Badge variant="yellow">ABOUT US</Badge>
        </div>

        {/* Section Heading */}
        <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#16141B]">
          Empowering Commerce Students
        </h2>

        {/* Indented bold intro paragraphs */}
        <div className="md:ml-[15%] max-w-[780px] my-10 sm:my-12 space-y-5">
          <p className="text-[19px] sm:text-[21px] lg:text-[23px] font-bold leading-[1.4] text-[#16141B] tracking-[-0.015em]">
            Founded by Parvesh Kumar, Prime Commerce Hub is dedicated to providing top-tier accountancy coaching. With over 15 years of experience, we focus on building a rock-solid foundation for Class 11th and 12th students.
          </p>
          <p className="text-[15px] sm:text-[17px] leading-[1.65] text-neutral-600 font-normal">
            Our teaching methodology emphasizes conceptual clarity and personal guidance, ensuring every student not only excels in exams but also develops a deep understanding of financial principles.
          </p>

          {/* Educator Credentials Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECE8FA] flex items-center justify-center text-[#5B32D6]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Founder</div>
                <div className="text-[15px] font-extrabold text-[#16141B]">Parvesh Kumar</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECE8FA] flex items-center justify-center text-[#5B32D6]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Designation</div>
                <div className="text-[15px] font-extrabold text-[#16141B]">FOUNDER &amp; LEAD EDUCATOR</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECE8FA] flex items-center justify-center text-[#5B32D6]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Experience</div>
                <div className="text-[15px] font-extrabold text-[#5B32D6]">30+ years TEACHING EXCELLENCE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Showcase Frame */}
        <div className="relative mt-8">
          {/* Hand-drawn yellow 5-line burst doodle floating outside top-right */}
          <div className="absolute -top-7 -right-3 sm:-top-9 sm:right-4 z-20 pointer-events-none">
            <SunburstDoodle className="w-16 h-16 sm:w-20 sm:h-20 text-[#FACC15]" />
          </div>

          <motion.div
            whileHover={{ scale: 1.008 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsVideoModalOpen(true)}
            className="relative rounded-[28px] overflow-hidden aspect-[16/9] bg-neutral-900 shadow-xl cursor-pointer group border border-neutral-100"
          >
            {/* Full-bleed high-res image of Parvesh Kumar teaching */}
            <Image
              src="/images/accountancy-classroom.jpg"
              alt="Parvesh Kumar teaching Accountancy classroom session at Prime Commerce Hub"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.97]"
              sizes="(max-width: 1240px) 100vw, 1200px"
            />

            {/* Subtle Gradient vignette */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

            {/* Centered White Circular Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-2xl flex items-center justify-center text-[#16141B] pl-1 transition-all group-hover:bg-[#FDE047] cursor-pointer"
                aria-label="Play video introduction"
              >
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current stroke-none text-[#16141B]" />
              </motion.button>
            </div>

            {/* Bottom Caption Pill */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-xs sm:text-sm font-bold text-[#16141B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Watch educator introduction &amp; teaching methodology</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </section>
  );
}
