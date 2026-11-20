"use client";

import React from "react";
import { Modal } from "../ui/Modal";
import { Play, Volume2, ShieldCheck, CheckCircle } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Meet Your Teacher — Jave Carter" maxWidth="max-w-4xl">
      <div className="space-y-6">
        {/* Simulated Video Player Container */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl flex items-center justify-center">
          <video
            className="w-full h-full object-cover"
            controls
            autoPlay
            poster="/images/intro-video-thumbnail.jpg"
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
              <span>CELTA Certified</span>
            </div>
            <div className="text-sm font-semibold text-[#16141B]">Cambridge Assessment</div>
            <div className="text-xs text-neutral-500">Official accreditation for teaching English to adult speakers worldwide.</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F7F9] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B32D6] uppercase tracking-wide">
              <Volume2 className="w-4 h-4" />
              <span>Native Irish Accent</span>
            </div>
            <div className="text-sm font-semibold text-[#16141B]">Clear Dublin Pronunciation</div>
            <div className="text-xs text-neutral-500">Neutral, internationally intelligible pacing tailored to your ears.</div>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F7F9] space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B32D6] uppercase tracking-wide">
              <CheckCircle className="w-4 h-4" />
              <span>7+ Years Experience</span>
            </div>
            <div className="text-sm font-semibold text-[#16141B]">1,200+ Students Taught</div>
            <div className="text-xs text-neutral-500">Specializing in workplace confidence, kids, and IELTS 7.5+ band prep.</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
