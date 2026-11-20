"use client";

import React from "react";

// 4-point white star sparkle SVG for Hero
export function HeroSparkle({ className = "w-8 h-8 text-white/90" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M24 4 C24 14 34 24 44 24 C34 24 24 34 24 44 C24 34 14 24 4 24 C14 24 24 14 24 4 Z" />
    </svg>
  );
}

// Hand-drawn curly loop arrow pointing to the polaroid card
export function HeroCurlyArrow({ className = "w-24 h-24 text-white/80" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Loop the loop curved arrow */}
      <path d="M12 25 C25 15, 45 10, 48 28 C50 44, 30 55, 25 42 C20 30, 45 40, 68 55 C78 62, 85 70, 92 78" />
      {/* Arrowhead */}
      <path d="M80 78 L92 78 L90 66" />
    </svg>
  );
}

// Handwritten note "Learn / Explore / grow" with 2 sketchy white underline strokes
export function HeroHandwrittenNote({ className = "" }: { className?: string }) {
  return (
    <div className={`text-white select-none pointer-events-none font-sans ${className}`}>
      <div className="flex flex-col text-sm md:text-base font-semibold tracking-wide text-white/95 leading-tight">
        <span>Learn</span>
        <span>Explore</span>
        <span>grow</span>
      </div>
      <svg
        viewBox="0 0 70 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="w-16 h-4 text-white/90 mt-1"
      >
        <path d="M3 6 Q 35 3 67 7" />
        <path d="M8 14 Q 38 12 62 15" />
      </svg>
    </div>
  );
}

// Rotated translucent yellow highlighter tape rectangle with slightly organic edges
export function YellowTape({
  className = "",
  rotation = "-2deg",
}: {
  className?: string;
  rotation?: string;
}) {
  return (
    <div
      style={{ transform: `rotate(${rotation})` }}
      className={`bg-[#FDE047] h-8 rounded-sm shadow-sm opacity-95 ${className}`}
    />
  );
}

// Small purple curly-loop doodle for lesson step cards
export function LessonStepCurlyLoop({ className = "w-7 h-10 text-[#5B32D6]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 4 C24 8, 28 20, 18 24 C8 28, 4 38, 14 44 C20 48, 26 44, 28 38" />
    </svg>
  );
}

// Purple outlined quotation marks “
export function PurpleQuotation({ className = "w-10 h-10 text-[#7C3AED]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* First quote */}
      <path d="M6 18 C6 13, 10 8, 15 6 L15 12 C11 12, 10 14, 10 16 L15 16 L15 26 L6 26 Z" />
      {/* Second quote */}
      <path d="M22 18 C22 13, 26 8, 31 6 L31 12 C27 12, 26 14, 26 16 L31 16 L31 26 L22 26 Z" />
    </svg>
  );
}

// Curved purple hand-drawn arrow pointing to bold statement
export function PurpleCurvedArrow({ className = "w-12 h-12 text-[#7C3AED]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 50 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 10 C10 32, 20 42, 38 40" />
      <path d="M30 32 L40 40 L30 46" />
    </svg>
  );
}

// Yellow 5-line burst doodle floating outside the top-right corner of the video frame
export function SunburstDoodle({ className = "w-14 h-14 text-[#FACC15]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      className={className}
    >
      <line x1="10" y1="50" x2="22" y2="38" />
      <line x1="24" y1="48" x2="32" y2="30" />
      <line x1="38" y1="46" x2="44" y2="22" />
      <line x1="48" y1="40" x2="52" y2="14" />
      <line x1="56" y1="32" x2="58" y2="8" />
    </svg>
  );
}

// 8-point white hand-drawn asterisk/sparkle doodle
export function AsteriskSparkle({ className = "w-12 h-12 text-white" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      className={className}
    >
      <line x1="30" y1="6" x2="30" y2="54" />
      <line x1="6" y1="30" x2="54" y2="30" />
      <line x1="12" y1="12" x2="48" y2="48" />
      <line x1="48" y1="12" x2="12" y2="48" />
    </svg>
  );
}

// Yellow 5-star crown SVG above Public Reviews
export function FiveStarCrownDoodle({ className = "w-16 h-8 text-[#FACC15]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* 5 mini stars arced */}
      <polygon points="12,18 14,12 16,18 10,14 18,14" fill="currentColor" />
      <polygon points="26,12 28,6 30,12 24,8 32,8" fill="currentColor" />
      <polygon points="40,9 42,3 44,9 38,5 46,5" fill="currentColor" />
      <polygon points="54,12 56,6 58,12 52,8 60,8" fill="currentColor" />
      <polygon points="68,18 70,12 72,18 66,14 74,14" fill="currentColor" />
      {/* Curved smile underline */}
      <path d="M16 28 Q 40 38 64 28" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M22 34 Q 40 40 58 34" stroke="currentColor" strokeWidth="1.8" fill="none" />
    </svg>
  );
}

// Yellow heart doodle with top radiance rays for Student Feedback
export function HeartRadianceDoodle({ className = "w-12 h-12 text-[#FACC15]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        d="M30 48 C16 38, 8 28, 8 18 C8 10, 14 6, 21 6 C26 6, 29 9, 30 12 C31 9, 34 6, 39 6 C46 6, 52 10, 52 18 C52 28, 44 38, 30 48 Z"
        fill="none"
      />
      {/* Top 3 radiance marks */}
      <line x1="30" y1="2" x2="30" y2="4" strokeWidth="2.5" />
      <line x1="20" y1="2" x2="22" y2="4" strokeWidth="2" />
      <line x1="40" y1="2" x2="38" y2="4" strokeWidth="2" />
    </svg>
  );
}

// Yellow hand-drawn curved arrow SVG pointing up-right above step 03 in Learning Path
export function StaircaseArrowDoodle({ className = "w-16 h-10 text-[#FDE047]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 32 C28 28, 52 18, 68 8" />
      <path d="M54 7 L70 8 L65 20" />
    </svg>
  );
}

// Speech bubble icon outline (Card 1 of What you'll improve)
export function SpeechBubbleOutline({ className = "w-9 h-9 text-white" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 18 C6 10, 12 6, 18 6 C24 6, 30 10, 30 18 C30 24, 24 28, 18 28 C15 28, 12 29, 8 31 C9 29, 9 27, 8 26 C6.8 23.8, 6 21, 6 18 Z" />
      <line x1="12" y1="16" x2="24" y2="16" />
      <line x1="12" y1="20" x2="20" y2="20" />
    </svg>
  );
}

// Heart outline icon with 3 ray marks (Card 2 of What you'll improve)
export function HeartRayOutline({ className = "w-9 h-9 text-white" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 32 C10 24, 4 18, 4 11 C4 6, 8 3, 13 3 C16.5 3, 19 5, 20 7 C21 5, 23.5 3, 27 3 C32 3, 36 6, 36 11 C36 18, 30 24, 20 32 Z" />
      {/* 3 top rays */}
      <line x1="20" y1="0" x2="20" y2="1.5" />
      <line x1="13" y1="0.5" x2="14" y2="2" />
      <line x1="27" y1="0.5" x2="26" y2="2" />
    </svg>
  );
}
