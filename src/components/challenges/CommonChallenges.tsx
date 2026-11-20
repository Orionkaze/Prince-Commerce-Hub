"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "../ui/Badge";
import { PurpleQuotation, PurpleCurvedArrow } from "../doodles/Doodles";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface DoodleChallenge {
  type: "lavender" | "card";
  doodle: string;
  title: string;
  description: string;
}

const doodleChallenges: DoodleChallenge[] = [
  {
    type: "lavender",
    doodle: "/images/doodle-starting-zero.png",
    title: "Starting from zero",
    description: "You know very little English and don't know where to begin.",
  },
  {
    type: "card",
    doodle: "/images/doodle-understand-cant-speak.png",
    title: "You understand but can't speak",
    description:
      "You understand a lot, but answering quickly is still difficult.",
  },
  {
    type: "card",
    doodle: "/images/doodle-afraid-mistakes.png",
    title: "You're afraid of making mistakes when you speak",
    description:
      "You avoid speaking because you worry about saying something wrong.",
  },
  {
    type: "card",
    doodle: "/images/doodle-score-same.png",
    title: "You keep studying, but your score stays the same",
    description:
      "You need a clear roadmap instead of studying randomly.",
  },
  {
    type: "card",
    doodle: "/images/doodle-travel-abroad.png",
    title: "You want to travel or move abroad, but your English holds you back",
    description:
      "You worry about handling everyday situations without relying on translation.",
  },
  {
    type: "card",
    doodle: "/images/doodle-too-old.png",
    title: "You feel too old to start",
    description:
      "You worry that most English classes are for younger students, or that you'll feel out of place learning with them.",
  },
  {
    type: "card",
    doodle: "/images/doodle-struggle-colleagues.png",
    title: "You struggle to communicate with colleagues in English",
    description:
      "You know what you want to say, but meetings, chats, and everyday conversations at work can still feel difficult.",
  },
];

export function CommonChallenges() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <div className="space-y-4 max-w-[620px]">
            <div>
              <Badge variant="yellow">COMMON CHALLENGES</Badge>
            </div>
            <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#16141B]">
              Does this sound like you?
            </h2>
          </div>
          <p className="max-w-[380px] text-[16px] lg:text-[17px] leading-[1.6] text-neutral-600 font-normal">
            These are some of the common challenges you may be facing while learning
            and using English.
          </p>
        </div>

        {/* 3x3 Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Hesitant Speaker Photo Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative h-[340px] rounded-[24px] overflow-hidden bg-neutral-100 shadow-xs group"
          >
            <Image
              src="/images/hesitant-speaker.jpg"
              alt="Hesitant English speaker looking thoughtful"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            {/* Floating Pill Badge: I... um... */}
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-xs py-2 px-3.5 rounded-full shadow-lg border border-neutral-200/60 flex items-center gap-1.5 z-10">
              <Sparkles className="w-3.5 h-3.5 text-[#5B32D6]" />
              <span className="text-xs font-bold text-[#16141B]">I... um...</span>
            </div>
          </motion.div>

          {/* Cards 2 - 8 */}
          {doodleChallenges.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx + 1) * 0.05 }}
              className={`h-[340px] rounded-[24px] p-8 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 ${
                item.type === "lavender" ? "bg-[#ECE8FA]" : "bg-[#F7F7F9]"
              }`}
            >
              {/* Line-art Doodle Illustration */}
              <div className="relative w-full h-[150px] flex items-center justify-center">
                <div className="relative w-36 h-36">
                  <Image
                    src={item.doodle}
                    alt={item.title}
                    fill
                    className="object-contain"
                    sizes="160px"
                  />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-[20px] lg:text-[22px] font-bold tracking-[-0.02em] leading-[1.25] text-[#16141B]">
                  {item.title}
                </h3>
                <p className="text-[14px] lg:text-[15px] leading-[1.5] text-neutral-600">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Card 9: Lavender Reassurance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="h-[340px] rounded-[24px] bg-[#ECE8FA] p-8 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
          >
            {/* Top Quotes and Hand-drawn Arrow */}
            <div className="space-y-2">
              <PurpleQuotation className="w-9 h-9 text-[#7C3AED]" />
              <div className="pl-2 pt-2">
                <PurpleCurvedArrow className="w-10 h-10 text-[#7C3AED]" />
              </div>
            </div>

            {/* Reassurance text */}
            <div className="space-y-2">
              <h3 className="text-[20px] lg:text-[22px] font-bold tracking-[-0.02em] leading-[1.3] text-[#16141B]">
                You don’t need to be good at English before you start.
              </h3>
              <p className="text-[16px] lg:text-[17px] font-bold text-[#5B32D6]">
                We’ll begin from your current level.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
