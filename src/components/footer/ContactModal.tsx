"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState("Class 12 Commerce");
  const [goal, setGoal] = useState("Class 12 Board Excellence");
  const [message, setMessage] = useState("");
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
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }, 700);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setName("");
    setEmail("");
    setMessage("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={isSuccess ? "Inquiry Received!" : "Contact Parvesh Kumar — Prime Commerce Hub"}
      maxWidth="max-w-xl"
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
          <h4 className="text-2xl font-bold text-[#16141B]">
            Thank you, {name}!
          </h4>
          <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            We’ve received your inquiry and will personally review your academic goals. Expect a response at{" "}
            <span className="text-[#5B32D6] font-semibold">{email}</span> within 24 hours.
          </p>
          <div className="pt-4">
            <Button variant="purple" onClick={handleReset}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-neutral-500 pb-1">
            Fill out this quick form or reach out directly at{" "}
            <a href="mailto:parveshdhiman1900@gmail.com" className="text-[#5B32D6] font-semibold underline">
              parveshdhiman1900@gmail.com
            </a>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Student Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rohan Verma"
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Current Class
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-[#16141B] bg-white"
              >
                <option value="Class 11 Commerce">Class 11 Commerce</option>
                <option value="Class 12 Commerce">Class 12 Commerce</option>
                <option value="Class 12 Board Prep">Class 12 Board Revision</option>
                <option value="Commerce Foundation">Commerce Foundation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                Focus Area
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-[#16141B] bg-white"
              >
                <option value="Class 11 Accountancy">Class 11 Accountancy (Foundation)</option>
                <option value="Class 12 Board Excellence">Class 12 Accountancy (Board Prep)</option>
                <option value="Partnership & Company Accounts">Partnership &amp; Company Accounts</option>
                <option value="Cash Flow & Adjustments">Cash Flow &amp; Financial Statements</option>
                <option value="Board Test Series">Full-Length Board Mock Test Series</option>
                <option value="1-on-1 Guidance">Personalized Doubt Sessions</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
              Tell Parvesh Sir what you want to achieve
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Preparing for Class 12 CBSE Board Exams, looking for conceptual clarity and problem-solving practice..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-[#16141B]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
            >
              Cancel
            </button>
            <Button variant="purple" size="md">
              {isSubmitting ? "Sending..." : "Send Message to Parvesh Sir"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
