"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { CommonChallenges } from "@/components/challenges/CommonChallenges";
import { WhatYoullImprove } from "@/components/improve/WhatYoullImprove";
import { InstructorIntro } from "@/components/instructor/InstructorIntro";
import { StickyCourseCards } from "@/components/courses/StickyCourseCards";
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

  return (
    <div className="min-h-screen bg-white text-[#16141B] flex flex-col font-sans selection:bg-[#FDE047] selection:text-[#16141B]">
      {/* Sticky Multi-page Navbar */}
      <Navbar onOpenContact={handleOpenContact} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Section 1: Hero Section */}
        <HeroSection />

        {/* Section 2: Common Challenges Bento Grid */}
        <CommonChallenges />

        {/* Section 3: Why Choose Us (The Prime Advantage) */}
        <WhatYoullImprove />

        {/* Section 4: About Us Preview & Video Showcase */}
        <InstructorIntro />

        {/* Section 5: Courses Preview (Sticky Stacking Cards) */}
        <StickyCourseCards />

        {/* Section 6: Learning Path 5-Tier Ascending Staircase */}
        <LearningPath />

        {/* Section 8: Upcoming Batches Schedule */}
        <ClassSchedule />

        {/* Section 9: 4-Step Onboarding */}
        <StartingIsSimple onOpenContact={handleOpenContact} />

        {/* Section 10: Reviews & Student Feedback Carousels */}
        <ReviewsSection />

        {/* Section 11: Final CTA Banner & Obsidian Dark Footer */}
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
