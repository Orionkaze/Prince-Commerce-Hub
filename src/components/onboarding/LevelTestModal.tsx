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
    question: "When someone speaks to you in English, what usually happens?",
    options: [
      {
        label: "I recognize few words, get nervous, and don't know where to start.",
        level: "Starter",
      },
      {
        label: "I understand basic greetings and simple questions, but answer slowly.",
        level: "Elementary",
      },
      {
        label: "I understand everyday conversations well, but pause to search for words.",
        level: "Intermediate",
      },
      {
        label: "I handle meetings and discussions easily, but want nuance and fluency.",
        level: "Upper Intermediate",
      },
    ],
  },
  {
    id: 2,
    question: "How do you feel about English grammar and vocabulary?",
    options: [
      {
        label: "I need to learn fundamental sentence building from scratch.",
        level: "Starter",
      },
      {
        label: "I know basic tenses (past/present), but mix them up when speaking.",
        level: "Elementary",
      },
      {
        label: "My grammar is decent, but my vocabulary feels repetitive or simple.",
        level: "Intermediate",
      },
      {
        label: "I want to sound more natural, use idioms, and fix subtle recurring mistakes.",
        level: "Upper Intermediate",
      },
    ],
  },
  {
    id: 3,
    question: "What is your primary goal right now?",
    options: [
      {
        label: "Gain the courage to say my first sentences without fear.",
        level: "Starter",
      },
      {
        label: "Travel and order food, ask directions, and introduce myself easily.",
        level: "Elementary",
      },
      {
        label: "Speak up in workplace meetings and hold 15-minute natural conversations.",
        level: "Intermediate",
      },
      {
        label: "Score 7.5+ in IELTS or lead presentations with international colleagues.",
        level: "Upper Intermediate",
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
      // Calculate recommended level
      const counts: Record<string, number> = {};
      updated.forEach((l) => {
        counts[l] = (counts[l] || 0) + 1;
      });
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const recommended = (sorted[0]?.[0] as CourseLevel) || "Intermediate";
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
      title={resultLevel ? "Diagnostic Result" : `Free Level Test (${currentStep + 1}/${quizQuestions.length})`}
      maxWidth="max-w-xl"
    >
      {resultLevel ? (
        <div className="space-y-6 py-4">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center mx-auto">
              <Award className="w-9 h-9" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Your Recommended Starting Point
            </div>
            <h3 className="text-3xl font-extrabold text-[#16141B]">
              Level: {resultLevel}
            </h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Based on your answers, starting at the <strong>{resultLevel}</strong> level
              will give you the most rewarding progress without feeling overwhelmed or bored.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F7F9] space-y-2 text-xs text-neutral-700">
            <div className="font-bold text-neutral-900">What to expect in this tier:</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>12-week focused curriculum with Jave Carter</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Small group or 1-on-1 private lesson formats</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Google Meet live practice with post-class notes</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="text-xs font-bold text-neutral-500 hover:text-neutral-800 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Test</span>
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
              View Class Schedule
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
