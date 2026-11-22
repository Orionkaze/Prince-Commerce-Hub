"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [targetClass, setTargetClass] = useState("Class 12 Commerce");
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
    setPhone("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-white text-[#16141B] flex flex-col font-sans selection:bg-[#FDE047] selection:text-[#16141B]">
      <Navbar />

      <main className="flex-1">
        {/* Page Hero Header */}
        <section
          className="relative overflow-hidden py-16 sm:py-20 lg:py-24 text-white"
          style={{
            background: "linear-gradient(135deg, #4E2EC2 0%, #371B94 55%, #241068 100%)",
          }}
        >
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 relative z-10 space-y-5">
            <div>
              <Badge variant="yellow">CONNECT WITH US</Badge>
            </div>
            <h1 className="text-[38px] sm:text-[52px] lg:text-[64px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white max-w-[850px]">
              Contact Prime Commerce Hub
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.6] text-white/85 max-w-[700px] font-normal">
              Have questions about Class 11th or 12th Accountancy batches, admissions, or study guidance? Reach out to Parvesh Sir and our counseling team.
            </p>
          </div>
        </section>

        {/* Contact Content Section */}
        <section className="py-20 lg:py-28 bg-[#F7F7F9]">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Contact Information Cards */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                  <Badge variant="yellow">GET IN TOUCH</Badge>
                  <h2 className="text-[32px] sm:text-[38px] font-extrabold text-[#16141B] tracking-tight">
                    We’re Here to Guide Your Commerce Journey
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    Whether you are starting from zero in Class 11 or aiming for a perfect 100 in your Class 12 Board Exams, our team is ready to assist with course details and batch timings.
                  </p>
                </div>

                {/* Info Cards */}
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Official Inquiries
                      </div>
                      <a
                        href="mailto:parveshdhiman1900@gmail.com"
                        className="text-base font-bold text-[#16141B] hover:text-[#5B32D6] transition-colors"
                      >
                        parveshdhiman1900@gmail.com
                      </a>
                      <div className="text-xs text-neutral-500">
                        Admissions, enrollments &amp; counseling
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Phone &amp; WhatsApp
                      </div>
                      <div className="text-base font-bold text-[#16141B]">
                        9416115406
                      </div>
                      <div className="text-xs text-neutral-500">
                        Official student helpline (Available Mon–Sat)
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Institute Center
                      </div>
                      <div className="text-base font-bold text-[#16141B]">
                        Prime Commerce Hub
                      </div>
                      <div className="text-xs text-neutral-500">
                        New Delhi, India
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Counseling Hours
                      </div>
                      <div className="text-base font-bold text-[#16141B]">
                        10:00 AM – 7:30 PM IST
                      </div>
                      <div className="text-xs text-neutral-500">
                        Monday through Saturday
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-[32px] border border-neutral-200/80 shadow-xl">
                {isSuccess ? (
                  <div className="text-center py-12 space-y-5">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#16141B]">
                      Thank You, {name}!
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-600 max-w-md mx-auto leading-relaxed">
                      Your inquiry has been received. Parvesh Sir and our counseling team will review your requirements and reach out to you at{" "}
                      <span className="text-[#5B32D6] font-semibold">{email}</span> within 24 hours.
                    </p>
                    <div className="pt-4">
                      <Button variant="purple" onClick={handleReset}>
                        Send Another Inquiry
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-extrabold text-[#16141B]">
                        Send an Inquiry
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-500 pt-1">
                        Fill in your details below and we will get back to you with syllabus guides and batch options.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                          Student Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Aryan Gupta"
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-[#16141B]"
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
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-[#16141B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-[#16141B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                          Current Class / Level
                        </label>
                        <select
                          value={targetClass}
                          onChange={(e) => setTargetClass(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-[#16141B] bg-white"
                        >
                          <option value="Class 11 Commerce">Class 11th Commerce</option>
                          <option value="Class 12 Commerce">Class 12th Commerce</option>
                          <option value="Class 12 Board Revision">Class 12th Board Revision</option>
                          <option value="Commerce Foundation">Commerce Foundation</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                        Message or Academic Goals
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell Parvesh Sir about your current chapters, school exam doubts, or board exam targets..."
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-[#16141B]"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="purple"
                        size="lg"
                        className="w-full justify-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span>Submitting Inquiry...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Message to Parvesh Sir</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer with hideCtaBanner on contact page */}
        <CtaAndFooter hideCtaBanner />
      </main>
    </div>
  );
}
