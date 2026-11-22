"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { CourseLevel, QuizQuestion } from "@/types";
import { CheckCircle2, Award, ArrowRight, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

interface LevelTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLevelSchedule?: (level: CourseLevel) => void;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "When solving an Accountancy question, what usually happens?",
    options: [
      {
        label: "I get confused with debit and credit rules and struggle to start journal entries.",
        level: "Foundation",
      },
      {
        label: "I know basic ledgers, but trial balance rectification and adjustments trip me up.",
        level: "Class 11",
      },
      {
        label: "I am comfortable with Class 11 basics and want to master Class 12 Partnership and Shares.",
        level: "Class 12",
      },
      {
        label: "I know the theory well, but need speed, accuracy, and board exam presentation mastery.",
        level: "Board Prep",
      },
    ],
  },
  {
    id: 2,
    question: "Which academic stage or class are you currently preparing for?",
    options: [
      {
        label: "Class 11 Commerce — Building rock-solid fundamentals from scratch.",
        level: "Foundation",
      },
      {
        label: "Class 11 Commerce — Covering the complete syllabus and scoring top marks in school exams.",
        level: "Class 11",
      },
      {
        label: "Class 12 Commerce — Mastering Partnership, Company Accounts & Cash Flow.",
        level: "Class 12",
      },
      {
        label: "Class 12 Commerce — Targeted revision, mock tests, and 100/100 board preparation.",
        level: "Board Prep",
      },
    ],
  },
  {
    id: 3,
    question: "What is your primary goal with Prime Commerce Hub?",
    options: [
      {
        label: "Move beyond rote memorization to deep conceptual understanding of accounting principles.",
        level: "Foundation",
      },
      {
        label: "Build high confidence in solving complex numerical problems independently.",
        level: "Class 11",
      },
      {
        label: "Achieve 95%+ in Class 12 Board Examinations with Parvesh Sir's proven roadmap.",
        level: "Class 12",
      },
      {
        label: "Master board-pattern question papers, time management, and error-free working notes.",
        level: "Board Prep",
      },
    ],
  },
];

export function LevelTestModal({
  isOpen,
  onClose,
  onSelectLevelSchedule,
}: LevelTestModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<CourseLevel[]>([]);
  const [resultLevel, setResultLevel] = useState<CourseLevel | null>(null);

  const handleSelectOption = (level: CourseLevel) => {
    const updated = [...answers, level];
    setAnswers(updated);

    if (currentStep + 1 < quizQuestions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      const counts: Record<string, number> = {};
      updated.forEach((l) => {
        counts[l] = (counts[l] || 0) + 1;
      });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const recommended = (sorted[0]?.[0] as CourseLevel) || "Class 12";
      setResultLevel(recommended);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResultLevel(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={resultLevel ? "Commerce Assessment Result" : `Commerce Assessment (${currentStep + 1}/${quizQuestions.length})`}
      maxWidth="max-w-xl"
    >
      {resultLevel ? (
        <div className="space-y-6 py-4">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center mx-auto">
              <Award className="w-9 h-9" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Your Recommended Learning Track
            </div>
            <h3 className="text-3xl font-extrabold text-[#16141B]">
              Track: {resultLevel} Accountancy
            </h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Based on your answers, enrolling in the <strong>{resultLevel}</strong> batch at Prime Commerce Hub
              will give you the strongest conceptual clarity, personal mentorship, and academic growth.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F7F9] space-y-2 text-xs text-neutral-700">
            <div className="font-bold text-neutral-900">What to expect in this program:</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Concept-based learning led directly by Parvesh Kumar (15+ years exp)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Comprehensive coverage of NCERT, standard reference books &amp; board patterns</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Regular assessment tests, personalized error correction &amp; doubt sessions</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="text-xs font-bold text-neutral-500 hover:text-neutral-800 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
            <Button
              variant="purple"
              size="md"
              href="#schedule"
              onClick={() => {
                onClose();
                if (onSelectLevelSchedule) onSelectLevelSchedule(resultLevel);
              }}
            >
              View Batch Schedule
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 py-2">
          {/* Progress bar */}
          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#5B32D6] h-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / quizQuestions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Text */}
          <h4 className="text-lg sm:text-xl font-bold text-[#16141B] leading-snug">
            {quizQuestions[currentStep].question}
          </h4>

          {/* Options */}
          <div className="space-y-3">
            {quizQuestions[currentStep].options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectOption(opt.level)}
                className="w-full text-left p-4 rounded-2xl border border-neutral-200 hover:border-[#5B32D6] hover:bg-[#ECE8FA]/40 transition-all text-sm font-medium text-neutral-800 flex items-center justify-between group cursor-pointer"
              >
                <span>{opt.label}</span>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#5B32D6] group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
