import React from "react";

/**
 * High-quality, responsive vector doodles tailored for Accountancy & Commerce.
 * Crisp at any resolution, hand-drawn editorial aesthetic matching the template.
 */

// 1. Starting from zero in Commerce: Open Ledger with Debit/Credit & Growth Sprout
export function AccountingZeroDoodle({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Open Book / Ledger Base */}
      <path
        d="M20 95 C 45 88, 65 92, 70 102 C 75 92, 95 88, 120 95 L 116 45 C 95 38, 75 42, 70 52 C 65 42, 45 38, 24 45 Z"
        fill="#ECE8FA"
        stroke="#16141B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center Spine */}
      <path
        d="M70 52 L 70 102"
        stroke="#5B32D6"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Left Page Ledger Lines (Debit) */}
      <path d="M32 54 H 58" stroke="#16141B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M30 65 H 58" stroke="#16141B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M34 76 H 56" stroke="#16141B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M44 48 V 84" stroke="#5B32D6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
      
      {/* Right Page Ledger Lines (Credit) */}
      <path d="M82 54 H 108" stroke="#16141B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M82 65 H 110" stroke="#16141B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M84 76 H 106" stroke="#16141B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M96 48 V 84" stroke="#5B32D6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />

      {/* Fresh Green Sprout from Center (Learning from Zero) */}
      <path
        d="M70 50 Q 70 30 64 24 Q 60 32 70 36"
        fill="#10B981"
        stroke="#16141B"
        strokeWidth="2"
      />
      <path
        d="M70 34 Q 76 22 84 26 Q 78 34 70 34"
        fill="#34D399"
        stroke="#16141B"
        strokeWidth="2"
      />
      <path d="M70 50 V 30" stroke="#16141B" strokeWidth="2.2" strokeLinecap="round" />

      {/* Yellow Sparkles */}
      <circle cx="108" cy="30" r="3" fill="#FDE047" stroke="#16141B" strokeWidth="1.5" />
      <path d="M26 32 L 28 36 L 24 35 Z" fill="#FDE047" stroke="#16141B" strokeWidth="1" />
    </svg>
  );
}

// 2. Understood in class, stuck at home: Balance Scales (Dr. vs Cr. Equilibrium)
export function LedgerBalanceDoodle({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Base & Stand */}
      <path
        d="M48 116 C 48 112, 92 112, 92 116 Z"
        fill="#16141B"
        stroke="#16141B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M70 114 V 38" stroke="#16141B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="70" cy="36" r="6" fill="#FDE047" stroke="#16141B" strokeWidth="2.5" />

      {/* Crossbar Beam (Slightly tilted) */}
      <path
        d="M26 44 L 114 40"
        stroke="#16141B"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Left Pan (Debit) */}
      <path d="M26 44 L 14 74 M 26 44 L 38 74" stroke="#5B32D6" strokeWidth="1.8" />
      <path
        d="M10 74 Q 26 88 42 74 Z"
        fill="#ECE8FA"
        stroke="#16141B"
        strokeWidth="2.2"
      />
      {/* Dr Label Pill */}
      <rect x="18" y="58" width="16" height="12" rx="3" fill="#FDE047" stroke="#16141B" strokeWidth="1.5" />
      <text x="21" y="67" fontSize="8" fontWeight="bold" fill="#16141B">Dr</text>

      {/* Right Pan (Credit) */}
      <path d="M114 40 L 102 70 M 114 40 L 126 70" stroke="#5B32D6" strokeWidth="1.8" />
      <path
        d="M98 70 Q 114 84 130 70 Z"
        fill="#ECE8FA"
        stroke="#16141B"
        strokeWidth="2.2"
      />
      {/* Cr Label Pill */}
      <rect x="106" y="54" width="16" height="12" rx="3" fill="#FDE047" stroke="#16141B" strokeWidth="1.5" />
      <text x="109" y="63" fontSize="8" fontWeight="bold" fill="#16141B">Cr</text>

      {/* Question mark above scales */}
      <path
        d="M66 18 C 66 12, 74 12, 74 17 C 74 21, 70 22, 70 25"
        stroke="#5B32D6"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="70" cy="29" r="1.5" fill="#5B32D6" />
    </svg>
  );
}

// 3. Fear of complex adjustments: Financial Calculator & Adjustments Puzzle
export function AdjustmentPuzzleDoodle({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Calculator Body */}
      <rect
        x="36"
        y="24"
        width="68"
        height="92"
        rx="14"
        fill="#F7F7F9"
        stroke="#16141B"
        strokeWidth="2.5"
      />
      {/* Display Screen */}
      <rect
        x="45"
        y="34"
        width="50"
        height="22"
        rx="6"
        fill="#ECE8FA"
        stroke="#16141B"
        strokeWidth="2"
      />
      {/* Ledger Figures on Screen */}
      <path d="M52 45 H 85" stroke="#5B32D6" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Keypad Grid */}
      <circle cx="53" cy="68" r="4.5" fill="#FDE047" stroke="#16141B" strokeWidth="1.5" />
      <circle cx="70" cy="68" r="4.5" fill="#16141B" />
      <circle cx="87" cy="68" r="4.5" fill="#16141B" />
      
      <circle cx="53" cy="83" r="4.5" fill="#16141B" />
      <circle cx="70" cy="83" r="4.5" fill="#FDE047" stroke="#16141B" strokeWidth="1.5" />
      <circle cx="87" cy="83" r="4.5" fill="#16141B" />

      <circle cx="53" cy="98" r="4.5" fill="#16141B" />
      <circle cx="70" cy="98" r="4.5" fill="#16141B" />
      <rect x="81" y="94" width="12" height="8" rx="3" fill="#5B32D6" />

      {/* Adjustment Badge / Tag Overlapping Right */}
      <g transform="translate(86, 42) rotate(12)">
        <rect x="0" y="0" width="34" height="20" rx="6" fill="#FDE047" stroke="#16141B" strokeWidth="2" />
        <text x="6" y="14" fontSize="10" fontWeight="extrabold" fill="#16141B">± Adj</text>
      </g>
    </svg>
  );
}

// 4. Studying hard, but marks stay the same: Structured Progress Chart & Target 100
export function TargetScoreDoodle({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Frame / Chart Board */}
      <rect
        x="22"
        y="24"
        width="96"
        height="92"
        rx="16"
        fill="#FFFFFF"
        stroke="#16141B"
        strokeWidth="2.5"
      />
      {/* Chart Grid Lines */}
      <path d="M34 100 H 106" stroke="#16141B" strokeWidth="2" strokeLinecap="round" />
      <path d="M34 40 V 100" stroke="#16141B" strokeWidth="2" strokeLinecap="round" />

      {/* Ascending Growth Bars */}
      <rect x="42" y="76" width="12" height="24" rx="3" fill="#DDD6FE" stroke="#16141B" strokeWidth="1.8" />
      <rect x="58" y="62" width="12" height="38" rx="3" fill="#C4B5FD" stroke="#16141B" strokeWidth="1.8" />
      <rect x="74" y="48" width="12" height="52" rx="3" fill="#A78BFA" stroke="#16141B" strokeWidth="1.8" />
      <rect x="90" y="34" width="12" height="66" rx="3" fill="#FDE047" stroke="#16141B" strokeWidth="2" />

      {/* Upward Growth Trend Arrow */}
      <path
        d="M40 82 Q 70 54 98 30"
        stroke="#5B32D6"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M90 28 L 100 28 L 100 38" stroke="#5B32D6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* 100/100 Target Stamp */}
      <circle cx="106" cy="30" r="16" fill="#FDE047" stroke="#16141B" strokeWidth="2" />
      <text x="96" y="34" fontSize="10" fontWeight="bold" fill="#16141B">100</text>
    </svg>
  );
}

// 5. Overwhelmed by vast syllabus: Organized Commerce Syllabus & Textbooks
export function SyllabusStackDoodle({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Bottom Book: Class 11 Accountancy */}
      <g transform="translate(24, 88)">
        <rect x="0" y="0" width="92" height="20" rx="4" fill="#371B94" stroke="#16141B" strokeWidth="2.5" />
        <rect x="12" y="3" width="8" height="14" fill="#FDE047" rx="1" />
        <path d="M30 10 H 82" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Middle Book: Class 12 Partnership */}
      <g transform="translate(28, 64)">
        <rect x="0" y="0" width="84" height="20" rx="4" fill="#5B32D6" stroke="#16141B" strokeWidth="2.5" />
        <rect x="12" y="3" width="8" height="14" fill="#FFFFFF" rx="1" />
        <path d="M30 10 H 74" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Top Book: Company Accounts & Cash Flow */}
      <g transform="translate(34, 40)">
        <rect x="0" y="0" width="72" height="20" rx="4" fill="#FDE047" stroke="#16141B" strokeWidth="2.5" />
        <rect x="10" y="3" width="6" height="14" fill="#16141B" rx="1" />
        <path d="M26 10 H 62" stroke="#16141B" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Bookmark Ribbon */}
      <path
        d="M84 40 V 22 Q 84 18 80 18 Q 76 18 76 22 V 40 L 80 34 Z"
        fill="#EF4444"
        stroke="#16141B"
        strokeWidth="1.8"
      />

      {/* Pencil Across */}
      <g transform="translate(30, 26) rotate(-24)">
        <rect x="0" y="0" width="46" height="8" rx="2" fill="#FACC15" stroke="#16141B" strokeWidth="1.8" />
        <polygon points="46,0 54,4 46,8" fill="#16141B" />
        <rect x="0" y="0" width="8" height="8" rx="2" fill="#F472B6" stroke="#16141B" strokeWidth="1.8" />
      </g>
    </svg>
  );
}

// 6. Lost in rote memorization: Conceptual Lightbulb & Accounting Equation
export function ConceptLightbulbDoodle({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Lightbulb Glow Backdrop */}
      <circle cx="70" cy="56" r="32" fill="#FEF08A" opacity="0.6" />

      {/* Bulb Glass */}
      <path
        d="M50 56 C 50 42, 60 32, 70 32 C 80 32, 90 42, 90 56 C 90 66, 82 72, 80 78 L 60 78 C 58 72, 50 66, 50 56 Z"
        fill="#FDE047"
        stroke="#16141B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Bulb Filament forming 'A = L + C' logic */}
      <path
        d="M64 56 Q 70 46 76 56"
        stroke="#16141B"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M70 56 V 68" stroke="#16141B" strokeWidth="2" strokeLinecap="round" />

      {/* Bulb Base */}
      <rect x="60" y="80" width="20" height="6" rx="2" fill="#E5E7EB" stroke="#16141B" strokeWidth="2" />
      <rect x="62" y="87" width="16" height="5" rx="2" fill="#9CA3AF" stroke="#16141B" strokeWidth="2" />
      <path d="M66 93 H 74" stroke="#16141B" strokeWidth="2" strokeLinecap="round" />

      {/* Radiance Rays */}
      <path d="M70 18 V 24" stroke="#5B32D6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 34 L 43 39" stroke="#5B32D6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M102 34 L 97 39" stroke="#5B32D6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M26 56 H 34" stroke="#5B32D6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M106 56 H 114" stroke="#5B32D6" strokeWidth="2.5" strokeLinecap="round" />

      {/* Mini Equation Pill at Bottom */}
      <g transform="translate(30, 104)">
        <rect x="0" y="0" width="80" height="22" rx="7" fill="#ECE8FA" stroke="#16141B" strokeWidth="2" />
        <text x="9" y="15" fontSize="10" fontWeight="extrabold" fill="#5B32D6">A = L + Capital</text>
      </g>
    </svg>
  );
}

// 7. Board exam time management: Question Paper & Stopwatch
export function TimeManagementDoodle({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Exam Question Paper */}
      <rect
        x="26"
        y="30"
        width="66"
        height="84"
        rx="8"
        fill="#FFFFFF"
        stroke="#16141B"
        strokeWidth="2.5"
      />
      {/* Paper Header & Checked Notes */}
      <path d="M36 44 H 72" stroke="#5B32D6" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 56 H 64" stroke="#16141B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M36 68 H 58" stroke="#16141B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M36 80 H 68" stroke="#16141B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M36 92 H 54" stroke="#16141B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* Checkmarks */}
      <path d="M78 54 L 81 57 L 86 51" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M78 66 L 81 69 L 86 63" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Overlapping Stopwatch */}
      <g transform="translate(68, 62)">
        <circle cx="28" cy="28" r="24" fill="#FDE047" stroke="#16141B" strokeWidth="2.5" />
        {/* Watch Top Button */}
        <path d="M28 4 V 0 M 24 0 H 32" stroke="#16141B" strokeWidth="2.5" strokeLinecap="round" />
        {/* Clock Hands */}
        <circle cx="28" cy="28" r="3" fill="#16141B" />
        <path d="M28 28 L 28 15" stroke="#16141B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M28 28 L 38 34" stroke="#16141B" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// ================= Onboarding Step Doodles =================

// Step 1: Tell Parvesh Sir what you need (Inquiry & Guidance)
export function Step1InquiryDoodle({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="24" y="32" width="76" height="54" rx="14" fill="#ECE8FA" stroke="#16141B" strokeWidth="2.5" />
      <polygon points="40,86 32,98 52,86" fill="#ECE8FA" stroke="#16141B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M38 52 H 78" stroke="#5B32D6" strokeWidth="3" strokeLinecap="round" />
      <path d="M38 64 H 66" stroke="#16141B" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
      {/* Pen */}
      <g transform="translate(80, 50) rotate(-35)">
        <rect x="0" y="0" width="50" height="10" rx="3" fill="#FDE047" stroke="#16141B" strokeWidth="2" />
        <polygon points="50,0 60,5 50,10" fill="#16141B" />
      </g>
    </svg>
  );
}

// Step 2: Diagnostic Assessment
export function Step2AssessmentDoodle({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="34" y="26" width="72" height="92" rx="12" fill="#FFFFFF" stroke="#16141B" strokeWidth="2.5" />
      <rect x="52" y="20" width="36" height="12" rx="4" fill="#FDE047" stroke="#16141B" strokeWidth="2" />
      <path d="M46 50 H 84" stroke="#5B32D6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M46 68 H 76" stroke="#16141B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M46 86 H 82" stroke="#16141B" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <circle cx="94" cy="94" r="14" fill="#10B981" stroke="#16141B" strokeWidth="2" />
      <path d="M89 94 L 93 98 L 100 90" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Step 3: Choose your Batch (Schedule Calendar)
export function Step3BatchDoodle({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="28" y="32" width="84" height="80" rx="14" fill="#FFFFFF" stroke="#16141B" strokeWidth="2.5" />
      <path d="M28 54 H 112" stroke="#16141B" strokeWidth="2.5" />
      <rect x="28" y="32" width="84" height="22" rx="14" fill="#5B32D6" />
      <circle cx="44" cy="26" r="3" fill="#FDE047" stroke="#16141B" strokeWidth="2" />
      <circle cx="96" cy="26" r="3" fill="#FDE047" stroke="#16141B" strokeWidth="2" />
      {/* Grid Dots */}
      <circle cx="46" cy="70" r="4" fill="#16141B" />
      <circle cx="70" cy="70" r="4" fill="#FDE047" stroke="#16141B" strokeWidth="1.5" />
      <circle cx="94" cy="70" r="4" fill="#16141B" />
      <circle cx="46" cy="90" r="4" fill="#16141B" />
      <circle cx="70" cy="90" r="4" fill="#5B32D6" />
      <circle cx="94" cy="90" r="4" fill="#16141B" />
    </svg>
  );
}

// Step 4: Confirm, Enroll and Excel (Graduation Cap & Trophy)
export function Step4EnrollDoodle({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Trophy Body */}
      <path
        d="M48 38 H 92 V 64 C 92 78, 80 88, 70 88 C 60 88, 48 78, 48 64 Z"
        fill="#FDE047"
        stroke="#16141B"
        strokeWidth="2.5"
      />
      {/* Trophy Handles */}
      <path d="M48 46 C 36 46, 36 62, 48 64" stroke="#16141B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M92 46 C 104 46, 104 62, 92 64" stroke="#16141B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Base */}
      <path d="M70 88 V 104 M 52 104 H 88" stroke="#16141B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Star in Trophy */}
      <polygon
        points="70,50 72,56 78,56 73,60 75,66 70,62 65,66 67,60 62,56 68,56"
        fill="#16141B"
      />
    </svg>
  );
}

// 8. Debit or Credit Confusion: Dual tags [Dr] / [Cr] with question mark & ledger voucher
export function DebitCreditConfusionDoodle({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background Journal Voucher Card */}
      <rect x="24" y="32" width="92" height="76" rx="14" fill="#ECE8FA" stroke="#16141B" strokeWidth="2.5" />
      {/* Top Header Bar */}
      <path d="M24 50 H 116" stroke="#16141B" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />
      
      {/* Left Tag: Dr. */}
      <g transform="translate(32, 54)">
        <rect width="32" height="36" rx="8" fill="#5B32D6" stroke="#16141B" strokeWidth="2" />
        <text x="16" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800" fontFamily="sans-serif">
          Dr.
        </text>
      </g>

      {/* Right Tag: Cr. */}
      <g transform="translate(76, 54)">
        <rect width="32" height="36" rx="8" fill="#FFFFFF" stroke="#16141B" strokeWidth="2" />
        <text x="16" y="24" textAnchor="middle" fill="#16141B" fontSize="14" fontWeight="800" fontFamily="sans-serif">
          Cr.
        </text>
      </g>

      {/* Floating Center Question Mark in Yellow Circle */}
      <circle cx="70" cy="40" r="14" fill="#FDE047" stroke="#16141B" strokeWidth="2" />
      <text x="70" y="46" textAnchor="middle" fill="#16141B" fontSize="17" fontWeight="900" fontFamily="sans-serif">
        ?
      </text>

      {/* Confused/Thinking Curved Arrows between Dr and Cr */}
      <path
        d="M58 84 Q 70 94 82 84"
        stroke="#5B32D6"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Sparkles */}
      <circle cx="22" cy="28" r="3" fill="#FDE047" stroke="#16141B" strokeWidth="1.5" />
      <circle cx="118" cy="36" r="2.5" fill="#5B32D6" />
    </svg>
  );
}

// 9. Advantage 1: 30+ Years Experience Medallion & Laurel Wreath
export function AdvantageExperienceDoodle({ className = "w-36 h-36" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Laurel Wreath Left */}
      <path
        d="M44 116 C 30 96, 30 64, 46 44"
        stroke="#16141B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse cx="36" cy="56" rx="7" ry="4" transform="rotate(-30 36 56)" fill="#10B981" stroke="#16141B" strokeWidth="1.5" />
      <ellipse cx="32" cy="74" rx="7" ry="4" transform="rotate(-10 32 74)" fill="#34D399" stroke="#16141B" strokeWidth="1.5" />
      <ellipse cx="34" cy="94" rx="7" ry="4" transform="rotate(15 34 94)" fill="#10B981" stroke="#16141B" strokeWidth="1.5" />
      <ellipse cx="44" cy="112" rx="7" ry="4" transform="rotate(40 44 112)" fill="#34D399" stroke="#16141B" strokeWidth="1.5" />

      {/* Laurel Wreath Right */}
      <path
        d="M116 116 C 130 96, 130 64, 114 44"
        stroke="#16141B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse cx="124" cy="56" rx="7" ry="4" transform="rotate(30 124 56)" fill="#10B981" stroke="#16141B" strokeWidth="1.5" />
      <ellipse cx="128" cy="74" rx="7" ry="4" transform="rotate(10 128 74)" fill="#34D399" stroke="#16141B" strokeWidth="1.5" />
      <ellipse cx="126" cy="94" rx="7" ry="4" transform="rotate(-15 126 94)" fill="#10B981" stroke="#16141B" strokeWidth="1.5" />
      <ellipse cx="116" cy="112" rx="7" ry="4" transform="rotate(-40 116 112)" fill="#34D399" stroke="#16141B" strokeWidth="1.5" />

      {/* Bottom Ribbon */}
      <path
        d="M52 118 L 44 142 L 62 134 L 80 140 L 98 134 L 116 142 L 108 118 Z"
        fill="#5B32D6"
        stroke="#16141B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Center Golden Medallion */}
      <circle cx="80" cy="80" r="38" fill="#FDE047" stroke="#16141B" strokeWidth="2.5" />
      <circle cx="80" cy="80" r="32" stroke="#16141B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

      {/* 30+ Text in Medallion */}
      <text x="80" y="85" textAnchor="middle" fill="#16141B" fontSize="25" fontWeight="900" fontFamily="sans-serif">
        30+
      </text>
      <text x="80" y="98" textAnchor="middle" fill="#5B32D6" fontSize="9" fontWeight="800" letterSpacing="1" fontFamily="sans-serif">
        YEARS
      </text>

      {/* Top 5 Stars Arc */}
      <polygon points="80,24 82,28 86,28 83,31 84,35 80,33 76,35 77,31 74,28 78,28" fill="#FDE047" stroke="#16141B" strokeWidth="1" />
      <polygon points="65,28 66,32 70,32 67,35 68,39 65,37 62,39 63,35 60,32 64,32" fill="#FDE047" stroke="#16141B" strokeWidth="1" />
      <polygon points="95,28 96,32 100,32 97,35 98,39 95,37 92,39 93,35 90,32 94,32" fill="#FDE047" stroke="#16141B" strokeWidth="1" />
    </svg>
  );
}

// 10. Advantage 2: Concept-Based Learning (Illuminated Logic Lightbulb)
export function AdvantageConceptDoodle({ className = "w-36 h-36" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Lightbulb Dome */}
      <path
        d="M52 74 C 52 48, 62 34, 80 34 C 98 34, 108 48, 108 74 C 108 88, 98 94, 96 104 H 64 C 62 94, 52 88, 52 74 Z"
        fill="#FDE047"
        stroke="#16141B"
        strokeWidth="2.5"
      />
      {/* Screw Cap */}
      <rect x="65" y="104" width="30" height="7" rx="3" fill="#ECE8FA" stroke="#16141B" strokeWidth="2" />
      <rect x="68" y="111" width="24" height="6" rx="2" fill="#ECE8FA" stroke="#16141B" strokeWidth="2" />
      <path d="M72 117 C 72 122, 88 122, 88 117 Z" fill="#16141B" stroke="#16141B" strokeWidth="1.5" />

      {/* Internal Logic Filament: Balance Symbol or M-Loop */}
      <path
        d="M68 84 L 74 60 L 80 72 L 86 60 L 92 84"
        stroke="#5B32D6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="80" cy="50" r="4" fill="#5B32D6" />

      {/* Radiating Light Beams */}
      <path d="M80 18 V 26" stroke="#5B32D6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 42 L 46 48" stroke="#5B32D6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M122 42 L 114 48" stroke="#5B32D6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M28 74 H 36" stroke="#16141B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M132 74 H 124" stroke="#16141B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Sparkles */}
      <circle cx="34" cy="100" r="3" fill="#FDE047" stroke="#16141B" strokeWidth="1.5" />
      <circle cx="126" cy="102" r="3" fill="#5B32D6" />
    </svg>
  );
}

// 11. Advantage 3: Student-Focused (Target Bullseye with Warm Heart & Direct Arrow)
export function AdvantageStudentDoodle({ className = "w-36 h-36" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Target Ring */}
      <circle cx="80" cy="80" r="48" fill="#ECE8FA" stroke="#16141B" strokeWidth="2.5" />
      {/* Middle Target Ring */}
      <circle cx="80" cy="80" r="34" fill="#FFFFFF" stroke="#16141B" strokeWidth="2" />
      {/* Inner Bullseye */}
      <circle cx="80" cy="80" r="20" fill="#5B32D6" stroke="#16141B" strokeWidth="2" />

      {/* Center Heart inside Bullseye */}
      <path
        d="M80 87 C 80 87, 72 81, 72 75 C 72 70, 76 68, 80 72 C 84 68, 88 70, 88 75 C 88 81, 80 87, 80 87 Z"
        fill="#FDE047"
        stroke="#16141B"
        strokeWidth="1.5"
      />

      {/* Direct Arrow Piercing Bullseye */}
      <path d="M30 30 L 74 74" stroke="#16141B" strokeWidth="3" strokeLinecap="round" />
      {/* Arrow Feathers */}
      <path d="M24 36 L 36 24 M 20 44 L 40 24 M 26 50 L 46 30" stroke="#5B32D6" strokeWidth="2.5" strokeLinecap="round" />

      {/* Focus Brackets [ ] */}
      <path d="M22 66 H 16 V 94 H 22" stroke="#16141B" strokeWidth="2" strokeLinecap="round" />
      <path d="M138 66 H 144 V 94 H 138" stroke="#16141B" strokeWidth="2" strokeLinecap="round" />
      {/* Sparkles */}
      <circle cx="134" cy="40" r="3.5" fill="#FDE047" stroke="#16141B" strokeWidth="1.5" />
      <circle cx="120" cy="124" r="2.5" fill="#10B981" />
    </svg>
  );
}

// 12. Advantage 4: Structured Syllabus (Organized Study Plan Checklist Binder)
export function AdvantageSyllabusDoodle({ className = "w-36 h-36" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Clipboard / Binder Base */}
      <rect x="36" y="26" width="88" height="110" rx="14" fill="#FFFFFF" stroke="#16141B" strokeWidth="2.5" />
      {/* Binder Clip */}
      <rect x="62" y="18" width="36" height="16" rx="5" fill="#FDE047" stroke="#16141B" strokeWidth="2" />
      <circle cx="80" cy="26" r="3" fill="#16141B" />

      {/* Checklist Item 1: Concept Foundation */}
      <circle cx="54" cy="56" r="7" fill="#10B981" stroke="#16141B" strokeWidth="1.5" />
      <path d="M51 56 L 53 58 L 57 53" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M68 56 H 106" stroke="#16141B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Checklist Item 2: Working Notes Mastery */}
      <circle cx="54" cy="78" r="7" fill="#5B32D6" stroke="#16141B" strokeWidth="1.5" />
      <path d="M51 78 L 53 80 L 57 75" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M68 78 H 108" stroke="#16141B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Checklist Item 3: Board Exam Numerical Drills */}
      <circle cx="54" cy="100" r="7" fill="#FDE047" stroke="#16141B" strokeWidth="1.5" />
      <path d="M51 100 L 53 102 L 57 97" stroke="#16141B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M68 100 H 98" stroke="#16141B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Ruler / Pencil at Corner */}
      <g transform="translate(104, 94) rotate(45)">
        <rect width="10" height="34" rx="2" fill="#5B32D6" stroke="#16141B" strokeWidth="1.5" />
        <path d="M0 34 L 5 44 L 10 34 Z" fill="#FDE047" stroke="#16141B" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
