"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Badge } from "../ui/Badge";
import {
  FiveStarCrownDoodle,
  HeartRadianceDoodle,
  PurpleQuotation,
} from "../doodles/Doodles";
import { PublicReview, StudentFeedback } from "@/types";

const publicReviews: PublicReview[] = [
  {
    id: "pr-1",
    author: "Google Reviewer",
    platform: "google",
    rating: 5,
    text: "Parvesh Sir's clarity in Partnership and Company Accounts is simply unmatched. I used to be terrified of Cash Flow Statements, but he made the concepts crystal clear. Scored 98 in my Board Exams!",
  },
  {
    id: "pr-2",
    author: "Google Reviewer",
    platform: "google",
    rating: 5,
    text: "The personal attention and step-by-step guidance transformed my confidence in Class 11 and 12 Accountancy. No rote memorization, only deep logic and solid conceptual foundation.",
  },
  {
    id: "pr-3",
    author: "Google Reviewer",
    platform: "google",
    rating: 5,
    text: "Best coaching for Class 11 Commerce fundamentals. The way Parvesh Sir explains the logic behind Debit and Credit makes complex journal entries feel effortless.",
  },
  {
    id: "pr-4",
    author: "Facebook Reviewer",
    platform: "facebook",
    rating: 5,
    text: "His 30+ years of teaching experience really shows. He predicts exact exam patterns, teaches time management, and shows how to write full-mark working notes.",
  },
  {
    id: "pr-5",
    author: "Google Reviewer",
    platform: "google",
    rating: 5,
    text: "After joining Prime Commerce Hub, my score jumped from 62% in school pre-boards to 96% in the final CBSE Board Examination. His guidance changed my academic trajectory.",
  },
];

const studentFeedback: StudentFeedback[] = [
  {
    id: "sf-1",
    author: "Aman Sharma",
    tagline: "Class 12 CBSE Board · 99/100 in Accountancy",
    quote: "I finally understood the 'why' behind every ledger entry instead of just memorizing steps.",
    story:
      "Before joining Prime Commerce Hub, Balance Sheets were a nightmare for me and my adjustments never tallied. Parvesh Sir's concept-first approach completely demystified accounting principles. In the board exam, I finished the paper 25 minutes early with complete working notes.",
    image: "/images/review-lucas.jpg",
  },
  {
    id: "sf-2",
    author: "Pooja Malhotra",
    tagline: "Class 11 & 12 Commerce Student",
    quote: "Parvesh Sir's personal guidance gave me the confidence to pursue top commerce careers.",
    story:
      "I was hesitant when I took Commerce in Class 11. Parvesh Sir broke down difficult concepts into simple real-world financial situations. His structured study plans and regular doubt clearing sessions made Accountancy my highest-scoring subject.",
    image: "/images/review-emma.jpg",
  },
];

export function ReviewsSection() {
  // Public reviews carousel
  const [emblaRefPublic] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
    align: "start",
  });

  // Student feedback carousel with progress bar
  const [emblaRefStudent, emblaApiStudent] = useEmblaCarousel({
    containScroll: "trimSnaps",
    align: "start",
  });

  const [studentProgress, setStudentProgress] = useState(0);

  const onStudentScroll = useCallback(() => {
    if (!emblaApiStudent) return;
    const progress = Math.max(0, Math.min(1, emblaApiStudent.scrollProgress()));
    setStudentProgress(progress * 100);
  }, [emblaApiStudent]);

  useEffect(() => {
    if (!emblaApiStudent) return;
    onStudentScroll();
    emblaApiStudent.on("scroll", onStudentScroll);
    emblaApiStudent.on("reInit", onStudentScroll);
  }, [emblaApiStudent, onStudentScroll]);

  return (
    <section id="reviews" className="bg-[#F7F7F9] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        {/* Top Header */}
        <div className="space-y-4 mb-20">
          <div>
            <Badge variant="yellow">REVIEWS</Badge>
          </div>
          <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#16141B]">
            Different goals. <br />
            Proven excellence.
          </h2>
        </div>

        {/* ================= Subsection 1: Public Reviews ================= */}
        <div className="mb-24">
          <div className="text-center space-y-3 mb-12">
            <div className="flex justify-center">
              <FiveStarCrownDoodle className="w-16 h-8 text-[#FACC15]" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#16141B] tracking-tight">
              Public Reviews
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 max-w-md mx-auto">
              Read reviews shared publicly on Google, Facebook, and by our student community.
            </p>
          </div>

          {/* Embla Public Reviews Slider */}
          <div
            className="embla -mx-5 sm:-mx-8 lg:-mx-10 px-5 sm:px-8 lg:px-10 cursor-grab active:cursor-grabbing"
            ref={emblaRefPublic}
          >
            <div className="embla__container flex gap-6 pb-2">
              {publicReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="embla__slide flex-none w-[300px] sm:w-[350px] lg:w-[370px] bg-white rounded-[24px] p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="space-y-5">
                    {/* Top Row: Stars on left, Platform Icon on right */}
                    <div className="flex items-center justify-between">
                      <div className="flex text-[#16141B] tracking-widest text-sm font-bold select-none">
                        ★★★★★
                      </div>
                      {rev.platform === "google" ? (
                        <div className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-800">
                          G
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-800">
                          f
                        </div>
                      )}
                    </div>

                    {/* Purple Quote Marks */}
                    <div>
                      <PurpleQuotation className="w-8 h-8 text-[#7C3AED]" />
                    </div>

                    {/* Review Text */}
                    <p className="text-[15px] sm:text-[16px] leading-[1.55] font-bold text-[#16141B]">
                      "{rev.text}"
                    </p>
                  </div>

                  <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                    <span>Verified Student / Parent</span>
                    <span className="capitalize">{rev.platform} Reviews</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= Subsection 2: Student Feedback ================= */}
        <div>
          <div className="text-center space-y-3 mb-12">
            <div className="flex justify-center">
              <HeartRadianceDoodle className="w-12 h-12 text-[#FACC15]" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#16141B] tracking-tight">
              Student Feedback
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 max-w-md mx-auto">
              See feedback from students after mastering Accountancy with Parvesh Sir.
            </p>
          </div>

          {/* Embla Student Feedback Split Cards */}
          <div
            className="embla -mx-5 sm:-mx-8 lg:-mx-10 px-5 sm:px-8 lg:px-10 cursor-grab active:cursor-grabbing"
            ref={emblaRefStudent}
          >
            <div className="embla__container flex gap-6 pb-4">
              {studentFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className="embla__slide flex-none w-[320px] sm:w-[580px] lg:w-[680px] bg-white rounded-[28px] p-6 sm:p-8 flex flex-col md:flex-row gap-6 sm:gap-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Left: Student Portrait */}
                  <div className="relative w-full md:w-[220px] h-[240px] sm:h-[280px] rounded-[20px] overflow-hidden bg-neutral-100 shrink-0">
                    <Image
                      src={fb.image}
                      alt={fb.author}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 240px"
                    />
                  </div>

                  {/* Right: Quote, Story, Author attribution */}
                  <div className="flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <PurpleQuotation className="w-8 h-8 text-[#7C3AED]" />

                      <h4 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#16141B] leading-snug">
                        "{fb.quote}"
                      </h4>

                      <p className="text-[14px] sm:text-[15px] leading-[1.6] text-neutral-600 font-normal">
                        {fb.story}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-100">
                      <div className="font-extrabold text-[15px] text-[#16141B]">
                        {fb.author}
                      </div>
                      <div className="text-[13px] text-neutral-500 font-medium">
                        {fb.tagline}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Centered Pill Progress Bar Indicator */}
          <div className="flex justify-center mt-10">
            <div className="w-48 h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="bg-[#5B32D6] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(studentProgress, 50)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
