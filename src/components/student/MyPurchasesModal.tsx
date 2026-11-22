"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  GraduationCap,
  Play,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PurchaseRecord } from "@/types/lms";

interface MyPurchasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLecturePlayer?: (lectureId: string) => void;
}

export function MyPurchasesModal({
  isOpen,
  onClose,
  onOpenLecturePlayer,
}: MyPurchasesModalProps) {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    fetch("/api/student/purchases")
      .then((res) => res.json())
      .then((data) => {
        setPurchases(data.purchases || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16141B]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-[32px] w-full max-w-3xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 bg-[#16141B] text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="yellow">STUDENT PORTAL</Badge>
              <span className="text-xs font-bold text-[#C4B5FD]">Enrolled Courses</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#FDE047]" />
              <span>My Purchases &amp; Enrolled Batches</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#5B32D6] animate-spin mx-auto" />
              <div className="text-xs text-neutral-500 font-medium">Checking enrolled batches...</div>
            </div>
          ) : purchases.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#16141B]">No Active Enrollments Found</h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
                Explore our Class 11th and 12th Accountancy programs to build rock-solid concepts and target 100/100 in Board Exams.
              </p>
              <div className="pt-2">
                <Button
                  variant="purple"
                  size="md"
                  onClick={() => {
                    onClose();
                    window.location.href = "/courses";
                  }}
                >
                  Browse Available Courses
                </Button>
              </div>
            </div>
          ) : (
            purchases.map((p) => {
              const itemTitle = p.courses?.title || p.lectures?.title || "Accountancy Enrollment";
              const isLecture = Boolean(p.lecture_id);

              return (
                <div
                  key={p.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#F7F7F9] border border-neutral-200/80 hover:bg-white hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Enrolled</span>
                      </span>
                      <span className="text-xs text-neutral-400 font-semibold">
                        {isLecture ? "Individual Lecture" : "Complete Course"}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base sm:text-lg text-[#16141B]">
                      {itemTitle}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span>Amount: ₹{p.amount?.toLocaleString("en-IN")}</span>
                      <span>·</span>
                      <span>Txn: {p.transaction_id?.slice(0, 14)}...</span>
                      <span>·</span>
                      <span>{new Date(p.created_at).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Button
                      variant="purple"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        onClose();
                        if (isLecture && onOpenLecturePlayer) {
                          onOpenLecturePlayer(p.lecture_id);
                        } else {
                          window.location.href = "/courses";
                        }
                      }}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Lectures</span>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
