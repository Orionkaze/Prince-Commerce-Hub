"use client";

import React from "react";
import { Badge } from "../ui/Badge";
import { StaircaseArrowDoodle } from "../doodles/Doodles";
import { motion } from "framer-motion";

interface TierItem {
  num: string;
  title: string;
  desc: string;
  heightDesktop: string;
  heightMobile: string;
  bgColor: string;
}

const tiers: TierItem[] = [
  {
    num: "01",
    title: "Starter",
    desc: "Basic vocabulary, simple sentences, listening, and everyday expressions.",
    heightDesktop: "lg:h-[250px]",
    heightMobile: "h-[220px]",
    bgColor: "#352659",
  },
  {
    num: "02",
    title: "Elementary",
    desc: "Common words, questions and answers, basic pronunciation, and simple listening.",
    heightDesktop: "lg:h-[310px]",
    heightMobile: "h-[240px]",
    bgColor: "#412D73",
  },
  {
    num: "03",
    title: "Intermediate",
    desc: "Longer conversations, practical vocabulary, natural sentences, and clearer speech.",
    heightDesktop: "lg:h-[370px]",
    heightMobile: "h-[260px]",
    bgColor: "#4D348C",
  },
  {
    num: "04",
    title: "Upper Intermediate",
    desc: "Work, travel, social situations, longer discussions, and natural expressions.",
    heightDesktop: "lg:h-[430px]",
    heightMobile: "h-[280px]",
    bgColor: "#583BA6",
  },
  {
    num: "05",
    title: "Advanced",
    desc: "Fluency, accuracy, precise vocabulary, and more complex conversations.",
    heightDesktop: "lg:h-[490px]",
    heightMobile: "h-[300px]",
    bgColor: "#6342C2",
  },
];

export function LearningPath() {
  return (
    <section className="bg-[#1D1136] text-white pt-24 lg:pt-32 pb-0 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-20 gap-6">
          <div className="space-y-4 max-w-[660px]">
            <div>
              <Badge variant="yellow">LEARNING PATH</Badge>
            </div>
            <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white">
              Start at your level. <br />
              Know what comes next.
            </h2>
          </div>
          <p className="max-w-[420px] text-[16px] lg:text-[17px] leading-[1.6] text-[#C4B5FD]/90 font-normal">
            Each course is divided into clear 12-week levels, so you always know
            where you're starting and what you're working toward.
          </p>
        </div>

        {/* Staircase Graphic Container */}
        <div className="relative pt-16">
          {/* Centered Yellow Hand-Drawn Curved Arrow pointing up-right above step 03 */}
          <div className="absolute top-2 left-1/2 -translate-x-12 hidden lg:block z-20 pointer-events-none">
            <StaircaseArrowDoodle className="w-20 h-12 text-[#FDE047]" />
          </div>

          {/* 5 Ascending Slanted Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
            {tiers.map((tier, idx) => (
              <motion.div
                key={tier.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative flex flex-col justify-end group"
              >
                {/* Floating Big Number above slanted top */}
                <div className="text-right pr-4 pb-2">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#C4B5FD] select-none group-hover:text-white transition-colors">
                    {tier.num}
                  </span>
                </div>

                {/* Slanted Column Block */}
                <div
                  style={{
                    backgroundColor: tier.bgColor,
                    clipPath: "polygon(0 12%, 100% 0, 100% 100%, 0% 100%)",
                  }}
                  className={`w-full ${tier.heightMobile} ${tier.heightDesktop} rounded-b-xl p-6 sm:p-7 flex flex-col justify-end space-y-2.5 transition-all duration-300 group-hover:brightness-110 shadow-lg`}
                >
                  <h3 className="text-[20px] sm:text-[22px] font-extrabold tracking-[-0.02em] text-white">
                    {tier.title}
                  </h3>
                  <p className="text-[13px] sm:text-[14px] leading-[1.5] text-[#E0D7FE] font-normal">
                    {tier.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
