"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { ScheduleItem } from "@/types";
import { CheckCircle2, Calendar, Clock, DollarSign, UserCheck } from "lucide-react";
import confetti from "canvas-confetti";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSlot: ScheduleItem | null;
}

export function BookingModal({
  isOpen,
  onClose,
  selectedSlot,
}: BookingModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback if canvas-confetti doesn't run
      }
    }, 700);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setName("");
    setEmail("");
    setNotes("");
    onClose();
  };

  if (!selectedSlot) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={isSuccess ? "Registration Reserved!" : `Reserve Slot — ${selectedSlot.courseName}`}
      maxWidth="max-w-xl"
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
          <h4 className="text-2xl font-bold text-[#16141B]">You're all set, {name}!</h4>
          <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            A confirmation email and onboarding guide for{" "}
            <strong>{selectedSlot.courseName} ({selectedSlot.level})</strong> have been sent to{" "}
            <span className="text-[#5B32D6] font-semibold">{email}</span>.
          </p>
          <div className="p-4 rounded-2xl bg-[#F7F7F9] max-w-sm mx-auto text-left text-xs space-y-1 text-neutral-700">
            <div><strong>Schedule:</strong> {selectedSlot.days} ({selectedSlot.time} GMT+1)</div>
            <div><strong>Starts:</strong> {selectedSlot.startDate}</div>
            <div><strong>Teacher:</strong> Jave Carter (Google Meet)</div>
          </div>
          <div className="pt-4">
            <Button variant="purple" onClick={handleReset}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Selected Slot Summary Card */}
          <div className="p-4 rounded-2xl bg-[#ECE8FA] text-[#16141B] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B32D6]">
                {selectedSlot.courseName}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-[#5B32D6]">
                {selectedSlot.level}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-700 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>{selectedSlot.days}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>{selectedSlot.time} GMT+1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-neutral-500" />
                <span>Starts {selectedSlot.startDate}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[#16141B]">
                <DollarSign className="w-3.5 h-3.5 text-neutral-500" />
                <span>{selectedSlot.price} / 12-wk level</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Liam O'Connor"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-[#16141B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-[#16141B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Your Goals or Prior Experience (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell Jave what you would like to focus on most..."
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-[#16141B]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <Button variant="purple" size="md">
              {isSubmitting ? "Reserving..." : "Confirm Reservation"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
