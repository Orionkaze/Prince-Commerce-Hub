"use client";

import React, { useState } from "react";
import { Badge } from "../ui/Badge";
import { LevelTestModal } from "./LevelTestModal";
import {
  Step1InquiryDoodle,
  Step2AssessmentDoodle,
  Step3BatchDoodle,
  Step4EnrollDoodle,
} from "../doodles/CommerceDoodles";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface StartingIsSimpleProps {
  onOpenContact: () => void;
}

export function StartingIsSimple({ onOpenContact }: StartingIsSimpleProps) {
  const [isLevelTestOpen, setIsLevelTestOpen] = useState(false);

  const steps = [
    {
      step: "STEP 1",
      title: "Tell Parvesh Sir what you need",
      renderDoodle: () => <Step1InquiryDoodle className="w-28 h-28 sm:w-32 sm:h-32" />,
      action: onOpenContact,
      actionLabel: "Send inquiry",
    },
    {
      step: "STEP 2",
      title: "Take the commerce assessment",
      renderDoodle: () => <Step2AssessmentDoodle className="w-28 h-28 sm:w-32 sm:h-32" />,
      action: () => setIsLevelTestOpen(true),
      actionLabel: "Start test now",
    },
    {
      step: "STEP 3",
      title: "Choose your Class 11th or 12th batch",
      renderDoodle: () => <Step3BatchDoodle className="w-28 h-28 sm:w-32 sm:h-32" />,
      href: "#schedule",
      actionLabel: "View schedule",
    },
    {
      step: "STEP 4",
      title: "Confirm, enroll, and excel",
      renderDoodle: () => <Step4EnrollDoodle className="w-28 h-28 sm:w-32 sm:h-32" />,
      action: onOpenContact,
      actionLabel: "Get started",
    },
  ];

  return (
    <section className="bg-white py-24 lg:py-32 border-t border-neutral-100">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section H2 */}
        <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#16141B]">
          Starting is simple.
        </h2>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 mt-14 sm:mt-16">
          {steps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col justify-between space-y-6 p-6 rounded-[24px] bg-[#F7F7F9] hover:bg-[#ECE8FA]/50 transition-colors group cursor-pointer"
              onClick={item.action}
            >
              <div className="space-y-4">
                {/* Yellow Step Tag */}
                <div>
                  <Badge variant="yellow">{item.step}</Badge>
                </div>

                {/* H3 Title */}
                <h3 className="text-[20px] lg:text-[23px] font-bold tracking-[-0.02em] leading-[1.25] text-[#16141B]">
                  {item.title}
                </h3>
              </div>

              {/* Hand-drawn Line-art Vector Doodle */}
              <div className="w-full h-[150px] flex items-center justify-center">
                {item.renderDoodle()}
              </div>

              {/* Interactive micro CTA link */}
              <div className="pt-2 border-t border-neutral-200/50 flex items-center justify-between text-xs font-bold text-[#5B32D6]">
                <span>{item.actionLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Free Level Diagnostic Quiz Modal */}
      <LevelTestModal
        isOpen={isLevelTestOpen}
        onClose={() => setIsLevelTestOpen(false)}
      />
    </section>
  );
}
