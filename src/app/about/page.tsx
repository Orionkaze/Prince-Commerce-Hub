"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { ContactModal } from "@/components/footer/ContactModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Users,
  Compass,
  GraduationCap,
  Sparkles,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const advantages = [
    {
      num: "01",
      title: "30+ years experience",
      subtitle: "A decade and a half of proven results and academic excellence in accountancy.",
      desc: "Guiding generations of commerce students to top percentile marks in CBSE and state board exams through disciplined methodology and exam pattern foresight.",
    },
    {
      num: "02",
      title: "Concept-Based Learning",
      subtitle: "Moving beyond rote memorization to deep conceptual understanding of every topic.",
      desc: "Every accounting rule, debit/credit classification, and adjustment entry is broken down into its real-world economic logic so students understand 'why', not just 'how'.",
    },
    {
      num: "03",
      title: "Student-Focused",
      subtitle: "Personalized attention and guidance tailored to each student's learning pace.",
      desc: "Small batch sizes and accessible one-on-one doubt resolution ensure no student falls behind, whether they need extra foundation support or advanced problem sets.",
    },
    {
      num: "04",
      title: "Structured Syllabus",
      subtitle: "Well-organized study plans and easy explanations for complex accounting problems.",
      desc: "From Day 1, students receive a clear chapter sequence, homework assignments, and board-level working note formats to conquer lengthy questions with ease.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#16141B] flex flex-col font-sans selection:bg-[#FDE047] selection:text-[#16141B]">
      <Navbar onOpenContact={() => setIsContactModalOpen(true)} />

      <main className="flex-1">
        {/* Page Hero Header */}
        <section
          className="relative overflow-hidden py-16 sm:py-20 lg:py-24 text-white"
          style={{
            background: "linear-gradient(135deg, #4E2EC2 0%, #371B94 55%, #241068 100%)",
          }}
        >
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 relative z-10 space-y-5">
            <div>
              <Badge variant="yellow">ABOUT US</Badge>
            </div>
            <h1 className="text-[38px] sm:text-[52px] lg:text-[64px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white max-w-[850px]">
              Empowering Commerce Students
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.6] text-white/85 max-w-[700px] font-normal">
              Founded by Parvesh Kumar, Prime Commerce Hub is dedicated to providing top-tier accountancy coaching for Class 11th and 12th Commerce students.
            </p>
          </div>
        </section>

        {/* Section 1: Introduction & Founder Profile */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Founder Photo in Polaroid Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[420px]">
                  {/* Decorative Backing Cards */}
                  <div className="absolute inset-0 bg-[#FDE047] rounded-[32px] transform rotate-[3deg] translate-x-3 translate-y-3 shadow-lg" />
                  <div className="absolute inset-0 bg-[#5B32D6] rounded-[32px] transform -rotate-[2deg] -translate-x-2 -translate-y-2 opacity-20" />

                  <div className="relative bg-white p-4 pb-6 rounded-[30px] shadow-2xl border border-neutral-100 z-10">
                    <div className="relative w-full aspect-[4/4.5] rounded-[22px] overflow-hidden bg-neutral-100">
                      <Image
                        src="/images/parvesh-kumar.jpg"
                        alt="Parvesh Kumar — Founder & Lead Educator"
                        fill
                        priority
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 420px"
                      />
                    </div>

                    <div className="pt-5 px-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-extrabold text-[#16141B] tracking-tight">
                          Parvesh Kumar
                        </h3>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                      </div>
                      <div className="text-sm font-semibold text-[#5B32D6]">
                        FOUNDER &amp; LEAD EDUCATOR
                      </div>
                      <div className="text-xs text-neutral-500 font-medium pt-1">
                        Prime Commerce Hub
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Experience Badge
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FDE047] text-[#16141B]">
                        30+ years TEACHING EXCELLENCE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Founder Bio & Mission */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <Badge variant="yellow">ABOUT US</Badge>
                </div>

                <h2 className="text-[32px] sm:text-[42px] font-extrabold text-[#16141B] tracking-tight leading-tight">
                  Empowering Commerce Students
                </h2>

                <p className="text-[17px] sm:text-[19px] font-bold text-[#16141B] leading-relaxed">
                  Founded by Parvesh Kumar, Prime Commerce Hub is dedicated to providing top-tier accountancy coaching. With over 15 years of experience, we focus on building a rock-solid foundation for Class 11th and 12th students.
                </p>

                <p className="text-[15px] sm:text-[16px] text-neutral-600 leading-relaxed">
                  Our teaching methodology emphasizes conceptual clarity and personal guidance, ensuring every student not only excels in exams but also develops a deep understanding of financial principles.
                </p>

                {/* Experience Discrepancy Editorial Note */}
                <div className="p-4 rounded-2xl bg-[#ECE8FA]/60 border border-[#DDD6FE] text-xs text-neutral-700 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#5B32D6]">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>Editorial Reference Note on Teaching Experience:</span>
                  </div>
                  <p className="leading-relaxed">
                    The source references note <strong>over 15 years</strong> in the narrative overview alongside the landmark <strong>30+ years TEACHING EXCELLENCE</strong> badge, reflecting decades of seasoned coaching mastery and academic mentorship in commerce.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-[#F7F7F9] border border-neutral-200/80 space-y-1">
                    <div className="text-xs font-bold uppercase text-neutral-400">Target Students</div>
                    <div className="text-base font-extrabold text-[#16141B]">Class 11 &amp; 12 Commerce</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F7F7F9] border border-neutral-200/80 space-y-1">
                    <div className="text-xs font-bold uppercase text-neutral-400">Core Specialization</div>
                    <div className="text-base font-extrabold text-[#16141B]">Financial Accountancy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Classroom & Teaching Philosophy */}
        <section className="py-20 lg:py-28 bg-[#F7F7F9]">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 space-y-16">
            <div className="text-center max-w-[720px] mx-auto space-y-4">
              <div>
                <Badge variant="yellow">TEACHING PHILOSOPHY</Badge>
              </div>
              <h2 className="text-[34px] sm:text-[44px] font-extrabold text-[#16141B] tracking-tight">
                Our Core Educational Principles
              </h2>
              <p className="text-sm sm:text-base text-neutral-600">
                At Prime Commerce Hub, we believe that accountancy is not a memorization drill — it is the language of financial decision-making.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-[28px] bg-white border border-neutral-200/80 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#16141B]">Conceptual Clarity</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Moving beyond rote memorization to uncover the economic logic behind every journal entry, ledger balance, and accounting adjustment.
                </p>
              </div>

              <div className="p-8 rounded-[28px] bg-white border border-neutral-200/80 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#16141B]">Personal Guidance</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Understanding that every student has an individual learning pace. Parvesh Sir provides attentive, patient mentorship to resolve every doubt.
                </p>
              </div>

              <div className="p-8 rounded-[28px] bg-white border border-neutral-200/80 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#16141B]">Examination Excellence</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Rigorous preparation with board-pattern marking schemes, format precision, time management drills, and working note accuracy for full marks.
                </p>
              </div>
            </div>

            {/* Classroom Photo Banner */}
            <div className="relative rounded-[32px] overflow-hidden aspect-[16/8] sm:aspect-[16/7] bg-neutral-900 shadow-xl border border-neutral-100">
              <Image
                src="/images/accountancy-classroom.jpg"
                alt="Accountancy classroom batch session at Prime Commerce Hub"
                fill
                className="object-cover object-center brightness-[0.92]"
                sizes="(max-width: 1240px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 right-6 text-white space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#FDE047]">
                  Interactive Classroom
                </span>
                <h4 className="text-xl sm:text-2xl font-extrabold">
                  Where Curiosity Meets Concrete Financial Fundamentals
                </h4>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Why Prime Commerce Hub (The 4 Advantages) */}
        <section className="py-20 lg:py-28 bg-white border-t border-neutral-100">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 space-y-14">
            <div className="space-y-3">
              <div>
                <Badge variant="yellow">WHY CHOOSE US</Badge>
              </div>
              <h2 className="text-[34px] sm:text-[44px] font-extrabold text-[#16141B] tracking-tight">
                The Prime Advantage
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 max-w-xl">
                We provide more than just coaching; we provide a roadmap to academic success in commerce.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {advantages.map((adv) => (
                <div
                  key={adv.num}
                  className="p-8 rounded-[28px] bg-[#F7F7F9] border border-neutral-200/80 space-y-4 hover:bg-[#ECE8FA]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-extrabold text-[#DDD6FE]">
                      {adv.num}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-[#5B32D6] shadow-xs">
                      Core Advantage
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#16141B]">
                    {adv.title}
                  </h3>

                  <p className="text-sm font-semibold text-[#5B32D6]">
                    {adv.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaAndFooter onOpenContact={() => setIsContactModalOpen(true)} />
      </main>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
