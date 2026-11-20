"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SunburstDoodle } from "../doodles/Doodles";
import { VideoModal } from "./VideoModal";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

export function InstructorIntro() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section id="about" className="bg-white py-20 lg:py-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        {/* Left-aligned Section H2 */}
        <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#16141B]">
          Hi, I’m Jave Carter.
        </h2>

        {/* Indented bold intro paragraph */}
        <div className="md:ml-[22%] max-w-[660px] my-10 sm:my-12">
          <p className="text-[20px] sm:text-[22px] lg:text-[24px] font-bold leading-[1.4] text-[#16141B] tracking-[-0.015em]">
            I’m a native English speaker from Ireland with 7+ years of experience
            teaching adults, professionals, young learners, and IELTS students online.
          </p>
        </div>

        {/* Video Container Frame */}
        <div className="relative mt-8">
          {/* Hand-drawn yellow 5-line burst doodle floating outside top-right */}
          <div className="absolute -top-7 -right-3 sm:-top-9 sm:right-4 z-20 pointer-events-none">
            <SunburstDoodle className="w-16 h-16 sm:w-20 sm:h-20 text-[#FACC15]" />
          </div>

          <motion.div
            whileHover={{ scale: 1.008 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsVideoModalOpen(true)}
            className="relative rounded-[28px] overflow-hidden aspect-[16/9] bg-neutral-900 shadow-xl cursor-pointer group"
          >
            {/* Full-bleed high-res image of Jave waving */}
            <Image
              src="/images/intro-video-thumbnail.jpg"
              alt="Jave Carter welcoming students in online English class"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.97]"
              sizes="(max-width: 1240px) 100vw, 1200px"
            />

            {/* Subtle Gradient vignette */}
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-300" />

            {/* Centered White Circular Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-2xl flex items-center justify-center text-[#16141B] pl-1 transition-all group-hover:bg-[#FDE047]"
                aria-label="Play video introduction"
              >
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current stroke-none text-[#16141B]" />
              </motion.button>
            </div>

            {/* Bottom Caption Pill */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-xs sm:text-sm font-bold text-[#16141B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Watch 90-sec teacher introduction & teaching philosophy</span>
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
