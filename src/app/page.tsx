"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { CommonChallenges } from "@/components/challenges/CommonChallenges";
import { WhatYoullImprove } from "@/components/improve/WhatYoullImprove";
import { InstructorIntro } from "@/components/instructor/InstructorIntro";
import { StickyCourseCards } from "@/components/courses/StickyCourseCards";
import { OnlineLessonWalkthrough } from "@/components/lesson/OnlineLessonWalkthrough";
import { LearningPath } from "@/components/path/LearningPath";
import { ClassSchedule } from "@/components/schedule/ClassSchedule";
import { StartingIsSimple } from "@/components/onboarding/StartingIsSimple";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { ContactModal } from "@/components/footer/ContactModal";

export default function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleOpenContact = () => {
    setIsContactModalOpen(true);
  };

  const handleScrollToCourses = () => {
    const el = document.getElementById("courses");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectCourse = (courseId: string) => {
    const el = document.getElementById("schedule");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#16141B] flex flex-col font-sans selection:bg-[#FDE047] selection:text-[#16141B]">
      {/* Sticky Navigation Bar */}
      <Navbar onOpenContact={handleOpenContact} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Section B: Hero Section */}
        <HeroSection
          onOpenContact={handleOpenContact}
          onExploreCourses={handleScrollToCourses}
        />

        {/* Section C: Common Challenges Bento Grid */}
        <CommonChallenges />

        {/* Section D: What You'll Improve Carousel */}
        <WhatYoullImprove />

        {/* Section E: Instructor Intro & Video Showcase */}
        <InstructorIntro />

        {/* Section F: Sticky Stacking Course Cards */}
        <StickyCourseCards onSelectCourse={handleSelectCourse} />

        {/* Section G: Online Lesson 6-Step Walkthrough */}
        <OnlineLessonWalkthrough />

        {/* Section H: Learning Path 5-Tier Ascending Staircase */}
        <LearningPath />

        {/* Section I: Class Schedule Dark Section */}
        <ClassSchedule />

        {/* Section J: Starting is Simple 4-Step Onboarding */}
        <StartingIsSimple onOpenContact={handleOpenContact} />

        {/* Section K: Reviews & Student Feedback Carousels */}
        <ReviewsSection />

        {/* Section L: Final CTA Banner & Obsidian Dark Footer */}
        <CtaAndFooter onOpenContact={handleOpenContact} />
      </main>

      {/* Global Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
