"use client";

import React from "react";
import { Modal } from "../ui/Modal";
import { ShieldCheck, Award, BookOpen } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Meet Your Educator — Parvesh Kumar" maxWidth="max-w-4xl">
      <div className="space-y-6">
        {/* Simulated Video Player Container */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl flex items-center justify-center">
          <video
            className="w-full h-full object-cover"
            controls
            autoPlay
            poster="/images/accountancy-classroom.jpg"
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Key Takeaways & Bio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#F7F7F9] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B32D6] uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4" />
              <span>Founder &amp; Lead Educator</span>
            </div>
            <div className="text-sm font-semibold text-[#16141B]">Prime Commerce Hub</div>
            <div className="text-xs text-neutral-500">Dedicated to providing top-tier Accountancy coaching for Class 11th &amp; 12th students.</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F7F9] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B32D6] uppercase tracking-wide">
              <Award className="w-4 h-4" />
              <span>30+ Years Experience</span>
            </div>
            <div className="text-sm font-semibold text-[#16141B]">Proven Academic Excellence</div>
            <div className="text-xs text-neutral-500">Mentoring students to consistent 95%+ and 100/100 scores in Board Exams.</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F7F9] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B32D6] uppercase tracking-wide">
              <BookOpen className="w-4 h-4" />
              <span>Concept-Based Learning</span>
            </div>
            <div className="text-sm font-semibold text-[#16141B]">Deep Logic &amp; Clarity</div>
            <div className="text-xs text-neutral-500">Eliminating rote learning with structured study plans, easy explanations, and personalized guidance.</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
