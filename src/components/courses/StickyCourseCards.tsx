"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { motion, useScroll, useTransform } from "framer-motion";
import { BookOpen, GraduationCap, MonitorPlay, ArrowRight } from "lucide-react";

interface CourseItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  topOffset: string;
  levels: string;
  format: string;
  highlightIcon: React.ReactNode;
}

const courses: CourseItem[] = [
  {
    id: "class-11",
    tag: "COMMERCE FOUNDATION",
    title: "Class 11 Accountancy",
    subtitle:
      "Comprehensive foundational learning module for Class 11 Commerce students, focusing on core concepts, journal entries, ledgers, and financial accounting principles.",
    image: "/images/accountancy-classroom.jpg",
    topOffset: "top-24",
    levels: "Class 11 Commerce",
    format: "Online",
    highlightIcon: <BookOpen className="w-5 h-5 text-[#5B32D6]" />,
  },
  {
    id: "class-12",
    tag: "BOARD EXCELLENCE",
    title: "Class 12 Accountancy",
    subtitle:
      "Comprehensive learning module designed for Class 12 Commerce students, covering Partnership Accounts, Company Accounts, and Financial Analysis for board exam mastery.",
    image: "/images/class-12-accountancy.jpg",
    topOffset: "top-28",
    levels: "Class 12 Commerce",
    format: "Online",
    highlightIcon: <GraduationCap className="w-5 h-5 text-[#5B32D6]" />,
  },
];

function CardStackItem({
  course,
}: {
  course: CourseItem;
  index: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  return (
    <motion.div
      ref={containerRef}
      style={{ scale }}
      className={`sticky ${course.topOffset} min-h-[500px] sm:min-h-[540px] rounded-[32px] overflow-hidden mb-12 shadow-2xl transition-all duration-300 border border-neutral-100`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-neutral-900">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover object-center brightness-[0.78]"
          sizes="(max-width: 1240px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
      </div>

      {/* Card Content Overlay */}
      <div className="relative z-10 p-8 sm:p-12 lg:p-14 h-full flex flex-col justify-between min-h-[500px] sm:min-h-[540px]">
        {/* Top Text Content */}
        <div className="max-w-[620px] space-y-4">
          <Badge variant="white" className="backdrop-blur-sm bg-white/95 text-[#16141B]">
            {course.tag}
          </Badge>

          <h2 className="text-[36px] sm:text-[48px] lg:text-[56px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white">
            {course.title}
          </h2>

          <p className="text-[16px] sm:text-[18px] lg:text-[19px] leading-[1.6] text-white/90 max-w-[520px]">
            {course.subtitle}
          </p>
        </div>

        {/* Bottom Bar: Action and Floating Info Card */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8">
          <div className="flex items-center gap-4">
            <Link href="/courses">
              <Button variant="white" size="md" className="gap-2">
                <span>Explore Full Course</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Floating White Course Info Card */}
          <div className="rounded-[20px] p-5 sm:p-6 bg-white shadow-xl text-[#16141B] max-w-[380px] w-full border border-neutral-100">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center justify-between">
              <span>Program Details</span>
              <span className="text-[#5B32D6] font-bold">Prime Commerce Hub</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-tight flex items-center gap-1">
                  {course.highlightIcon}
                  <span>Target Class</span>
                </div>
                <div className="text-[13px] font-bold text-[#16141B]">
                  {course.levels}
                </div>
              </div>

              <div className="space-y-1 border-l border-neutral-100 pl-4">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-tight flex items-center gap-1">
                  <MonitorPlay className="w-4 h-4 text-emerald-600" />
                  <span>Learning Mode</span>
                </div>
                <div className="text-[13px] font-bold text-[#16141B]">
                  {course.format}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function StickyCourseCards() {
  return (
    <section id="courses" className="bg-white py-16 lg:py-24">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-4 max-w-[680px]">
            <div>
              <Badge variant="yellow">OUR PROGRAMS</Badge>
            </div>
            <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#16141B]">
              Expert Accountancy Courses
            </h2>
            <p className="text-[16px] lg:text-[18px] leading-[1.6] text-neutral-600 font-normal">
              Comprehensive learning modules designed for Class 11 and 12 Commerce students.
            </p>
          </div>

          {/* Explore All Courses Button */}
          <div>
            <Link href="/courses">
              <Button variant="purple" size="md" className="gap-2">
                <span>Explore All Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative">
          {courses.map((course, idx) => (
            <CardStackItem
              key={course.id}
              course={course}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
