"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { TickerBar } from "@/components/counseling/TickerBar";
import { GradientThumbnail } from "@/components/counseling/GradientThumbnail";
import { BookingModal, BookingSlotSelection } from "@/components/counseling/BookingModal";
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Lock,
  Mail,
  CheckCircle2,
} from "lucide-react";

export interface ProgramItem {
  id: string;
  title: string;
  sessions: number;
  price: number;
  originalPrice: number;
  subtitle: string;
  duration: string;
  agenda: string;
  validity: string;
  image?: string;
}

const COACHING_PROGRAMS: ProgramItem[] = [
  {
    id: "11th-acc",
    title: "11th acc",
    sessions: 1,
    price: 200,
    originalPrice: 299,
    subtitle: "1:1 meeting regarding doubts",
    duration: "30 min",
    agenda: "doubt solving",
    validity: "Valid for 7 days",
    image: "/images/counseling-11th.jpg",
  },
  {
    id: "12th-acc",
    title: "12th acc",
    sessions: 1,
    price: 200,
    originalPrice: 299,
    subtitle: "1:1 meeting regarding doubts",
    duration: "30 min",
    agenda: "doubt solving",
    validity: "Valid for 7 days",
    image: "/images/counseling-12th.jpg",
  },
];

export default function CounselingPage() {
  const [currentView, setCurrentView] = useState<"list" | "detail" | "checkout">("list");
  const [selectedProgramId, setSelectedProgramId] = useState<string>("11th-acc");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Selected booking slot state (with default matching screenshots)
  const [bookingSlot, setBookingSlot] = useState<BookingSlotSelection>({
    programId: "11th-acc",
    date: null as unknown as Date,
    dateStr: "FRIDAY, NOV 27",
    formattedShort: "Fri, Nov 27",
    timeSlot: "11:00 AM – 11:30 AM",
    startTime: "11:00 AM",
  });

  // Checkout form details
  const [form, setForm] = useState({
    name: "Akshit Shukla",
    email: "akshitshukla.knp@gmail.com",
    phone: "9354211428",
    state: "Uttar Pradesh",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponExpanded, setCouponExpanded] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  const statesList = [
    "Uttar Pradesh",
    "Delhi",
    "Maharashtra",
    "Haryana",
    "Punjab",
    "Rajasthan",
    "Karnataka",
    "West Bengal",
    "Gujarat",
    "Madhya Pradesh",
    "Bihar",
  ];

  // Retrieve saved booking on mount
  useEffect(() => {
    const saved = localStorage.getItem("pch_counseling_booking");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.bookingSlot) {
          setBookingSlot({
            ...parsed.bookingSlot,
            date: new Date(parsed.bookingSlot.date),
          });
        }
        if (parsed.selectedProgramId) setSelectedProgramId(parsed.selectedProgramId);
        if (parsed.form) setForm(parsed.form);
      } catch (e) {
        // ignore fallback
      }
    } else {
      setBookingSlot((prev) => ({
        ...prev,
        date: new Date(2026, 10, 27),
      }));
    }
  }, []);

  const activeProgram =
    COACHING_PROGRAMS.find((p) => p.id === selectedProgramId) || COACHING_PROGRAMS[0];

  const handleOpenProgram = (id: string) => {
    setSelectedProgramId(id);
    setCurrentView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSlotConfirmed = (slot: BookingSlotSelection) => {
    setBookingSlot(slot);
    setIsModalOpen(false);
    // Auto proceed to checkout after choosing slot
    setCurrentView("checkout");
    // Save to localStorage
    localStorage.setItem(
      "pch_counseling_booking",
      JSON.stringify({
        selectedProgramId: activeProgram.id,
        bookingSlot: slot,
        form,
      })
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "DISCOUNT10") {
      setAppliedDiscount(10);
    } else {
      alert("Try code: DISCOUNT10");
    }
  };

  const finalPrice = Math.max(0, activeProgram.price - appliedDiscount);

  const handlePayNow = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim() || !form.email.includes("@"))
      errs.email = "Valid email is required";
    if (!form.phone.trim() || form.phone.length < 10)
      errs.phone = "Valid 10-digit phone number is required";
    if (!form.state) errs.state = "Please select your state";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsPaymentSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#16141B] flex flex-col font-sans selection:bg-[#E8C872] selection:text-[#0F1B33]">
      {/* ================= TOP TICKER BAR ================= */}
      <TickerBar />

      {/* ================= MAIN NAVBAR (hidden on checkout for distraction-free) ================= */}
      {currentView !== "checkout" && <Navbar />}

      {/* ================= VIEW 1: PROGRAM LISTING (PAGE 1) ================= */}
      {currentView === "list" && (
        <main className="flex-1">
          {/* Hero Section */}
          <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 text-center px-4 max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F1B33] tracking-tight leading-tight">
              Unlock Your Potential <br className="hidden sm:inline" /> Today
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
              Discover expert coaching tailored to your goals. Transform your skills with
              personalized guidance from industry professionals.
            </p>
          </section>

          {/* 2 Program Cards Section */}
          <section className="max-w-4xl mx-auto px-4 pb-24 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {COACHING_PROGRAMS.map((prog) => (
                <div
                  key={prog.id}
                  className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Thumbnail Image with Dark Pill */}
                    <div className="relative h-52 rounded-2xl overflow-hidden bg-neutral-900">
                      {prog.image ? (
                        <Image
                          src={prog.image}
                          alt={prog.title}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      ) : (
                        <GradientThumbnail className="h-52" />
                      )}
                      <span className="absolute bottom-3.5 left-3.5 bg-[#0F1B33]/90 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider shadow-md z-10">
                        {prog.sessions} SESSION
                      </span>
                    </div>

                    {/* Title & subtitle */}
                    <div>
                      <h3 className="text-xl font-extrabold text-[#0F1B33]">
                        {prog.title}
                      </h3>
                      <p className="text-xs text-neutral-400 font-semibold tracking-wider mt-1 uppercase">
                        ONE TIME PURCHASE
                      </p>
                    </div>
                  </div>

                  {/* Dotted Divider & Price / Explore Now */}
                  <div className="mt-6 pt-4 border-t border-dashed border-neutral-200 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-neutral-400 line-through font-medium">
                        ₹{prog.originalPrice}
                      </span>
                      <span className="text-2xl font-black text-[#0F1B33]">
                        ₹{prog.price}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenProgram(prog.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4A84B] hover:text-[#B68C32] group-hover:translate-x-1 transition-all cursor-pointer"
                    >
                      <span>Explore Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* ================= VIEW 2: PROGRAM DETAIL (PAGE 2) ================= */}
      {currentView === "detail" && (
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-400 mb-8">
            <button
              onClick={() => setCurrentView("list")}
              className="hover:text-neutral-700 transition-colors cursor-pointer"
            >
              Coaching Programs
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-[#0F1B33] font-bold">{activeProgram.title}</span>
          </nav>

          {/* 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <h1 className="text-4xl sm:text-5xl font-black text-[#0F1B33] tracking-tight">
                {activeProgram.title}
              </h1>

              <p className="text-sm sm:text-base text-neutral-500 font-normal">
                {activeProgram.subtitle}
              </p>

              <div className="flex items-baseline gap-2.5 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-[#0F1B33]">
                  ₹{activeProgram.price}
                </span>
                <span className="text-base text-neutral-400 line-through">
                  ₹{activeProgram.originalPrice}
                </span>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-9 py-3.5 rounded-full bg-[#5B54E6] hover:bg-[#4A43D4] text-white text-sm font-bold tracking-wide shadow-lg shadow-indigo-200 transition-all cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Right Column: Large Rounded Thumbnail Image */}
            <div className="lg:col-span-6">
              <div className="p-3 bg-white rounded-3xl border border-neutral-200/80 shadow-md">
                {activeProgram.image ? (
                  <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-neutral-900">
                    <Image
                      src={activeProgram.image}
                      alt={activeProgram.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 600px"
                    />
                  </div>
                ) : (
                  <GradientThumbnail className="h-72 sm:h-96" iconSize="lg" />
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ================= VIEW 3: CHECKOUT PAGE (PAGE 3) ================= */}
      {currentView === "checkout" && (
        <div className="min-h-screen bg-[#F8F9FB] flex flex-col pb-28">
          {/* Top Bar with Logo + Parvesh Kumar */}
          <header className="px-6 py-5 flex items-center justify-between border-b border-neutral-200/70 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-[#0F1B33] text-white flex items-center justify-center font-bold text-sm">
                ⚡
              </div>
              <span className="font-extrabold text-[#0F1B33] text-sm tracking-tight">
                Parvesh Kumar
              </span>
            </div>

            <button
              onClick={() => setCurrentView("detail")}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </header>

          {/* Main Checkout Area */}
          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Product & Slot Card */}
              <div className="lg:col-span-6 space-y-6">
                <GradientThumbnail className="h-56 sm:h-64" iconSize="lg" />

                <div className="space-y-3">
                  <h2 className="text-2xl font-extrabold text-[#0F1B33]">
                    {activeProgram.title}
                  </h2>

                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded bg-[#FCE7F3] text-[#BE185D] text-[11px] font-extrabold uppercase tracking-wider">
                      COACHING
                    </span>
                    <span className="px-2.5 py-1 rounded border border-neutral-200 bg-white text-neutral-600 text-[11px] font-medium">
                      {activeProgram.validity}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500">{activeProgram.subtitle}</p>
                </div>

                {/* "Your first session" card with Change link */}
                <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-neutral-400 block mb-0.5">
                      Your first session
                    </span>
                    <div className="text-xs sm:text-sm font-bold text-[#0F1B33]">
                      {bookingSlot.formattedShort} · {bookingSlot.startTime}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs font-bold text-[#5B54E6] hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                {/* Contact us info */}
                <div className="pt-2 text-xs text-neutral-500 space-y-1">
                  <div>Contact us at:</div>
                  <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>parveshdhiman1900@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Cards */}
              <div className="lg:col-span-6 space-y-6">
                {/* Card 1: Pay amount */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
                  <h3 className="text-lg font-extrabold text-[#0F1B33]">
                    Pay ₹{finalPrice}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-neutral-600 pt-1">
                    <span>Price</span>
                    <span className="font-semibold text-[#0F1B33]">₹{activeProgram.price}</span>
                  </div>

                  {/* Coupon Accordion */}
                  <div className="border-t border-neutral-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setCouponExpanded(!couponExpanded)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#5B54E6] hover:underline cursor-pointer"
                    >
                      <span>Apply coupon</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          couponExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {couponExpanded && (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2 mt-3">
                        <input
                          type="text"
                          placeholder="e.g. DISCOUNT10"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 uppercase focus:outline-none focus:ring-1 focus:ring-[#5B54E6]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold">
                      <span>Discount Applied</span>
                      <span>-₹{appliedDiscount}</span>
                    </div>
                  )}

                  <div className="border-t border-neutral-100 pt-3 flex items-center justify-between text-sm font-bold text-[#0F1B33]">
                    <span>You pay</span>
                    <span className="text-base font-extrabold">₹{finalPrice}</span>
                  </div>
                </div>

                {/* Card 2: Personal details */}
                <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
                  <h3 className="text-sm font-extrabold text-[#0F1B33]">
                    Personal details
                  </h3>

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-500">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 text-[#0F1B33] focus:outline-none focus:ring-1 focus:ring-[#5B54E6]"
                    />
                    {errors.name && (
                      <p className="text-[10px] text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-500">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 text-[#0F1B33] focus:outline-none focus:ring-1 focus:ring-[#5B54E6]"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone number with India flag */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-500">
                      Phone number
                    </label>
                    <div className="flex rounded-xl border border-neutral-200 overflow-hidden focus-within:ring-1 focus-within:ring-[#5B54E6]">
                      <div className="px-3 bg-neutral-50 border-r border-neutral-200 flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                        <span className="text-sm">🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
                        }
                        className="flex-1 px-3 py-2.5 text-xs text-[#0F1B33] focus:outline-none"
                        placeholder="93542 11428"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[10px] text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  {/* State */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-500">State</label>
                    <select
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 text-[#0F1B33] focus:outline-none focus:ring-1 focus:ring-[#5B54E6] bg-white cursor-pointer"
                    >
                      {statesList.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-[10px] text-red-500">{errors.state}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Fixed Bottom Bar */}
          <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 px-4 sm:px-8 py-3.5 z-40">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                <Lock className="w-4 h-4 text-neutral-400" />
                <span className="hidden sm:inline">
                  All transactions are secure and encrypted.
                </span>
                <span className="sm:hidden">Secure & Encrypted</span>
              </div>

              <button
                type="button"
                onClick={handlePayNow}
                className="px-8 py-3 rounded-full bg-[#5B54E6] hover:bg-[#4A43D4] text-white text-xs sm:text-sm font-bold tracking-wide shadow-md transition-all cursor-pointer"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= BOOKING MODAL ================= */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        programTitle={activeProgram.title}
        programId={activeProgram.id}
        initialDate={bookingSlot.date}
        initialSlot={bookingSlot.timeSlot}
        onConfirmSlot={handleSlotConfirmed}
      />

      {/* ================= PAYMENT SUCCESS MODAL ================= */}
      {isPaymentSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xl border border-neutral-100 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
              🎉
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#0F1B33]">
                Payment Successful 🎉
              </h3>
              <p className="text-xs text-neutral-500">
                Session booked for{" "}
                <span className="font-bold text-[#0F1B33]">
                  {bookingSlot.dateStr} · {bookingSlot.timeSlot}
                </span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 text-left text-xs space-y-2 text-neutral-700 border border-neutral-200/60">
              <div className="flex justify-between">
                <span className="text-neutral-500">Student:</span>
                <span className="font-bold text-[#16141B]">{form.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Program:</span>
                <span className="font-bold text-[#16141B]">{activeProgram.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Platform:</span>
                <span className="font-bold text-[#5B54E6]">Zoom Meeting (1-on-1)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Amount Paid:</span>
                <span className="font-bold text-emerald-600">₹{finalPrice}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsPaymentSuccess(false);
                setCurrentView("list");
              }}
              className="w-full py-3 rounded-full bg-[#0F1B33] text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Return to Counseling Hub
            </button>
          </div>
        </div>
      )}

      {/* Footer on Home & Detail views */}
      {currentView !== "checkout" && <CtaAndFooter />}
    </div>
  );
}
