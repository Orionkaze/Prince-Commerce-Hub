"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  FiveStarCrownDoodle,
  PurpleQuotation,
} from "../doodles/Doodles";
import {
  Star,
  CheckCircle2,
  Send,
  MessageSquarePlus,
  Sparkles,
  User,
  GraduationCap,
  Award,
} from "lucide-react";

export interface UnifiedReview {
  id: string;
  author: string;
  category: "Class 12th Board" | "Class 11th Commerce" | "Alumni & Toppers" | "Parent Feedback";
  score?: string;
  rating: number;
  quote: string;
  story: string;
  date: string;
  isCustom?: boolean;
}

const initialReviews: UnifiedReview[] = [];

export function ReviewsSection() {
  const [reviews, setReviews] = useState<UnifiedReview[]>(initialReviews);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Review Form State
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState<UnifiedReview["category"]>("Class 12th Board");
  const [score, setScore] = useState("");
  const [quote, setQuote] = useState("");
  const [story, setStory] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load custom reviews from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pch_custom_reviews");
      if (saved) {
        const parsed: UnifiedReview[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews([...parsed, ...initialReviews]);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !story.trim()) return;

    setIsSubmitting(true);

    const newRev: UnifiedReview = {
      id: `custom-rev-${Date.now()}`,
      author: author.trim(),
      category,
      score: score.trim() || undefined,
      rating,
      quote: quote.trim() || story.trim().slice(0, 80) + "...",
      story: story.trim(),
      date: "Just now",
      isCustom: true,
    };

    // Save to state and localStorage
    const updated = [newRev, ...reviews];
    setReviews(updated);

    try {
      const savedCustoms = updated.filter((r) => r.isCustom);
      localStorage.setItem("pch_custom_reviews", JSON.stringify(savedCustoms));
    } catch {
      // Ignore
    }

    // Trigger celebration confetti
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // Confetti fallback
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Reset form
    setAuthor("");
    setScore("");
    setQuote("");
    setStory("");
    setRating(5);

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 6000);
  };

  const categories = ["All", "Class 12th Board", "Class 11th Commerce", "Alumni & Toppers", "Parent Feedback"];

  const filteredReviews =
    activeFilter === "All"
      ? reviews
      : reviews.filter((r) => r.category === activeFilter);

  // Helper for author initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name.slice(0, 2) || "ST").toUpperCase();
  };

  return (
    <section id="reviews" className="bg-[#F7F7F9] py-20 lg:py-28 overflow-hidden border-t border-neutral-100">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="space-y-4 max-w-[640px]">
            <div>
              <Badge variant="yellow">REVIEWS &amp; STUDENT FEEDBACK</Badge>
            </div>
            <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08] text-[#16141B]">
              Real students. <br />
              Proven board results.
            </h2>
            <p className="text-[16px] lg:text-[17px] leading-[1.6] text-neutral-600 font-normal">
              See what students and parents have to say about mastering Accountancy concepts with Parvesh Sir.
            </p>
          </div>

          {/* Social Proof Star Trust Box */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-[#ECE8FA] flex items-center justify-center text-[#5B32D6]">
              <FiveStarCrownDoodle className="w-8 h-8 text-[#5B32D6]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#16141B]">
                Student &amp; Parent Feedback
              </div>
              <div className="text-xs text-neutral-500 font-medium">
                Verified reviews from enrolled Accountancy batches
              </div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === cat
                  ? "bg-[#5B32D6] text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:text-[#16141B] border border-neutral-200/70"
              }`}
            >
              {cat === "All" ? `All Reviews (${reviews.length})` : cat}
            </button>
          ))}
        </div>

        {/* Combined Reviews Bento Grid / Empty State */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-[28px] p-8 sm:p-12 text-center border border-neutral-200/80 shadow-xs max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center mx-auto">
              <MessageSquarePlus className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#16141B]">
              No Student Reviews Published Yet
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Have you taken classes with Parvesh Sir? Use the form below to share your learning experience, exam results, and feedback.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-[24px] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 border border-neutral-200/70 hover:-translate-y-1 group"
              >
                {/* Top: Star Rating + Category Pill */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#F59E0B] gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ECE8FA] text-[#5B32D6]">
                      {rev.category}
                    </span>
                  </div>

                  {/* Purple Quote Icon */}
                  <PurpleQuotation className="w-7 h-7 text-[#5B32D6]" />

                  {/* Main Quote Title */}
                  <h4 className="text-[17px] sm:text-[18px] font-bold tracking-tight text-[#16141B] leading-snug">
                    "{rev.quote}"
                  </h4>

                  {/* Detailed Story / Feedback */}
                  <p className="text-[13px] sm:text-[14px] leading-[1.6] text-neutral-600 font-normal">
                    {rev.story}
                  </p>
                </div>

                {/* Bottom: Author Details with Initials Badge */}
                <div className="pt-5 mt-5 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#16141B] text-white flex items-center justify-center font-extrabold text-xs shadow-2xs group-hover:bg-[#5B32D6] transition-colors">
                      {getInitials(rev.author)}
                    </div>
                    <div>
                      <div className="font-extrabold text-[14px] text-[#16141B] flex items-center gap-1">
                        <span>{rev.author}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />
                      </div>
                      {rev.score && (
                        <div className="text-[12px] font-semibold text-[#5B32D6]">
                          {rev.score}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-neutral-400">
                    {rev.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= ADD YOUR REVIEW BOX ================= */}
        <div className="mt-16 sm:mt-20">
          <div className="bg-white rounded-[28px] p-7 sm:p-10 shadow-sm border border-neutral-200/80 relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5B32D6] via-[#7C3AED] to-[#FACC15]" />

            <div className="max-w-[840px] mx-auto space-y-6">
              {/* Header inside the box */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#ECE8FA] text-[#5B32D6] text-xs font-bold uppercase tracking-wider">
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>Student Voice</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#16141B] tracking-tight">
                  Add Your Review &amp; Experience
                </h3>
                <p className="text-sm text-neutral-600 max-w-lg mx-auto">
                  Studied at Prime Commerce Hub? Share your feedback, board results, and journey to inspire future commerce students.
                </p>
              </div>

              {/* Success Notification Banner */}
              {submitSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-sm">
                    <strong>Thank you!</strong> Your review has been submitted and added above to the student reviews.
                  </div>
                </div>
              )}

              {/* Review Input Form */}
              <form onSubmit={handleReviewSubmit} className="space-y-5 pt-2">
                {/* Star Rating Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#F7F7F9] border border-neutral-200/70 gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                      Your Rating *
                    </span>
                    <span className="text-xs text-neutral-500">
                      Tap the stars to choose your overall experience
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                        aria-label={`${star} star rating`}
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= (hoverRating || rating)
                              ? "fill-[#F59E0B] text-[#F59E0B]"
                              : "text-neutral-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#16141B] ml-2">
                      {rating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Two-column Input Row: Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#5B32D6] focus:ring-2 focus:ring-[#5B32D6]/20 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                      Batch / Category *
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as UnifiedReview["category"])}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#5B32D6] focus:ring-2 focus:ring-[#5B32D6]/20 text-sm font-medium bg-white"
                      >
                        <option value="Class 12th Board">Class 12th Board</option>
                        <option value="Class 11th Commerce">Class 11th Commerce</option>
                        <option value="Alumni & Toppers">Alumni &amp; Toppers</option>
                        <option value="Parent Feedback">Parent Feedback</option>
                      </select>
                    </div>
                  </div>
                </div>

                

                {/* Review Textarea */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                    Your Detailed Review / Feedback *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    
                    className="w-full p-4 rounded-xl border border-neutral-300 focus:outline-none focus:border-[#5B32D6] focus:ring-2 focus:ring-[#5B32D6]/20 text-sm leading-relaxed"
                  />
                </div>

                {/* Submit Button Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#5B32D6]" />
                    <span>Your review will appear immediately in the student feedback section above.</span>
                  </p>

                  <Button
                    type="submit"
                    variant="purple"
                    size="md"
                    disabled={isSubmitting}
                    className="gap-2 cursor-pointer shrink-0"
                  >
                    <span>{isSubmitting ? "Publishing..." : "Submit Review"}</span>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
