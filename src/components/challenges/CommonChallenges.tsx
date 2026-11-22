"use client";

import React from "react";
import { Badge } from "../ui/Badge";
import {
  AccountingZeroDoodle,
  LedgerBalanceDoodle,
  TargetScoreDoodle,
} from "../doodles/CommerceDoodles";
import { motion } from "framer-motion";

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
    renderDoodle: () => <TargetScoreDoodle className="w-28 h-28 sm:w-32 sm:h-32" />,
    title: "Studying hard, but marks stay the same",
    description:
      "You practice questions randomly without a structured conceptual framework or marking scheme insights.",
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

        {/* 3 Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doodleChallenges.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
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
        </div>
      </div>
    </section>
  );
}
