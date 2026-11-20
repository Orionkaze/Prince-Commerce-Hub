"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "../ui/Badge";
import { PurpleQuotation, PurpleCurvedArrow } from "../doodles/Doodles";
import {
  AccountingZeroDoodle,
  LedgerBalanceDoodle,
  AdjustmentPuzzleDoodle,
  TargetScoreDoodle,
  SyllabusStackDoodle,
  ConceptLightbulbDoodle,
  TimeManagementDoodle,
} from "../doodles/CommerceDoodles";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

interface DoodleChallenge {
  type: "lavender" | "card";
  renderDoodle: () => React.ReactNode;
  title: string;
  description: string;
}

const doodleChallenges: DoodleChallenge[] = [
  {
    type: "lavender",
    renderDoodle: () => <AccountingZeroDoodle className="w-28 h-28 sm:w-32 sm:h-32" />,
    title: "Starting from zero in Commerce",
    description: "You find accounting fundamentals, debits and credits confusing and don't know where to begin.",
  },
  {
    type: "card",
    renderDoodle: () => <LedgerBalanceDoodle className="w-28 h-28 sm:w-32 sm:h-32" />,
    title: "Understood in class, stuck at home",
    description:
      "Journal entries make sense in lecture, but balancing ledgers and final accounts independently feels daunting.",
  },
  {
    type: "card",
    renderDoodle: () => <AdjustmentPuzzleDoodle className="w-28 h-28 sm:w-32 sm:h-32" />,
    title: "Fear of complex adjustments",
    description:
      "You worry about tricky adjustment entries in Partnership, Share Capital, or Cash Flow Statements.",
  },
  {
    type: "card",
    renderDoodle: () => <TargetScoreDoodle className="w-28 h-28 sm:w-32 sm:h-32" />,
    title: "Studying hard, but marks stay the same",
    description:
      "You practice questions randomly without a structured conceptual framework or marking scheme insights.",
  },
  {
    type: "card",
    renderDoodle: () => <SyllabusStackDoodle className="w-28 h-28 sm:w-32 sm:h-32" />,
    title: "Overwhelmed by the vast syllabus",
    description:
      "You struggle to balance theory, ledger formats, and time-consuming numerical problems under exam conditions.",
  },
  {
    type: "card",
    renderDoodle: () => <ConceptLightbulbDoodle className="w-28 h-28 sm:w-32 sm:h-32" />,
    title: "Lost in rote memorization",
    description:
      "Memorizing golden rules without understanding the financial logic behind them leads to silly mistakes and exam panic.",
  },
  {
    type: "card",
    renderDoodle: () => <TimeManagementDoodle className="w-28 h-28 sm:w-32 sm:h-32" />,
    title: "Board exam time management",
    description:
      "Lengthy 6-mark numerical problems leave you rushing through the question paper without finishing working notes.",
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
            These are some of the common challenges commerce students face while studying Accountancy and preparing for board exams.
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
              alt="Commerce student pondering accounting problem"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            {/* Floating Pill Badge: Debit or Credit? */}
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-xs py-2 px-3.5 rounded-full shadow-lg border border-neutral-200/60 flex items-center gap-1.5 z-10">
              <HelpCircle className="w-3.5 h-3.5 text-[#5B32D6]" />
              <span className="text-xs font-bold text-[#16141B]">Debit or Credit?</span>
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
              {/* Crisp Vector Doodle Illustration */}
              <div className="w-full h-[140px] flex items-center justify-center">
                {item.renderDoodle()}
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
                You don’t need to be an accounting genius before you start.
              </h3>
              <p className="text-[16px] lg:text-[17px] font-bold text-[#5B32D6]">
                We’ll build your concepts step by step from the ground up.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
