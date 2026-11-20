"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { motion, useScroll, useTransform } from "framer-motion";
import { BarChart3, MonitorPlay, GraduationCap, ArrowRight } from "lucide-react";

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
    id: "work",
    tag: "PROFESSIONAL ENGLISH",
    title: "English for Work",
    subtitle:
      "Practice meetings, emails, presentations, and workplace English so you can communicate more clearly at work.",
    image: "/images/course-work.jpg",
    topOffset: "top-24",
    levels: "4 Levels (Elementary–Advanced)",
    format: "100% Online",
    highlightIcon: <BarChart3 className="w-5 h-5 text-[#5B32D6]" />,
  },
  {
    id: "kids",
    tag: "KIDS ENGLISH",
    title: "English for Kids",
    subtitle:
      "Build speaking, listening, pronunciation, and vocabulary so children can use English more confidently in everyday situations.",
    image: "/images/course-kids.jpg",
    topOffset: "top-28",
    levels: "3 Levels (Beginner–Intermediate)",
    format: "100% Online",
    highlightIcon: <GraduationCap className="w-5 h-5 text-[#5B32D6]" />,
  },
  {
    id: "ielts",
    tag: "EXAM PREPARATION",
    title: "IELTS Preparation",
    subtitle:
      "Build your IELTS skills step by step with a clear band-based study plan for Listening, Reading, Writing, and Speaking.",
    image: "/images/course-ielts.jpg",
    topOffset: "top-32",
    levels: "Target: Band 6.0 – 8.0+",
    format: "100% Online",
    highlightIcon: <MonitorPlay className="w-5 h-5 text-[#5B32D6]" />,
  },
];

function CardStackItem({
  course,
  index,
  onSelectCourse,
}: {
  course: CourseItem;
  index: number;
  onSelectCourse: (courseId: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  // Subtle scale down as user scrolls past
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
            <Button
              variant="white"
              size="md"
              onClick={() => onSelectCourse(course.id)}
              href="#schedule"
            >
              Check Class Schedule
            </Button>
          </div>

          {/* Floating White Course Info Card */}
          <div className="rounded-[20px] p-5 sm:p-6 bg-white shadow-xl text-[#16141B] max-w-[380px] w-full border border-neutral-100">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center justify-between">
              <span>Course Info</span>
              <span className="text-[#5B32D6] font-bold">12-Week Module</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-tight flex items-center gap-1">
                  {course.highlightIcon}
                  <span>Course Levels</span>
                </div>
                <div className="text-[13px] font-bold text-[#16141B]">
                  {course.levels}
                </div>
              </div>

              <div className="space-y-1 border-l border-neutral-100 pl-4">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-tight flex items-center gap-1">
                  <MonitorPlay className="w-4 h-4 text-emerald-600" />
                  <span>Class Format</span>
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

export function StickyCourseCards({
  onSelectCourse,
}: {
  onSelectCourse: (courseId: string) => void;
}) {
  return (
    <section id="courses" className="bg-white py-16 lg:py-24">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="relative">
          {courses.map((course, idx) => (
            <CardStackItem
              key={course.id}
              course={course}
              index={idx}
              onSelectCourse={onSelectCourse}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
