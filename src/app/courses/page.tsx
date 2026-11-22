"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { ContactModal } from "@/components/footer/ContactModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { LectureRecord } from "@/types/lms";
import { openRazorpayCheckout } from "@/lib/payments/checkout";
import { LecturePlayerModal } from "@/components/player/LecturePlayerModal";
import { createClient } from "@/lib/supabase/client";
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Check,
  Play,
  Lock,
  CreditCard,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CoursesPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { addToCart, isInCart, openCart } = useCart();
  const { user } = useAuth();

  const [courses, setCourses] = useState<any[]>([]);
  const [paidLectures, setPaidLectures] = useState<LectureRecord[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [purchasedLectureIds, setPurchasedLectureIds] = useState<string[]>([]);
  const [activePlayerLecture, setActivePlayerLecture] = useState<LectureRecord | null>(null);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load courses and lectures from Supabase (strictly from API/database, no hardcoded mock data)
  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // 1. Fetch courses
        const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select("*")
          .order("created_at", { ascending: true });

        if (coursesData && !coursesError) {
          setCourses(coursesData);
        } else {
          setCourses([]);
        }

        // 2. Fetch paid lectures if table exists
        try {
          const { data: lecturesData } = await supabase
            .from("lectures")
            .select("*")
            .eq("access_type", "paid")
            .eq("is_published", true)
            .order("created_at", { ascending: true });

          if (lecturesData) {
            setPaidLectures(lecturesData);
          }
        } catch {
          // table might not be seeded yet
        }

        // 3. Fetch student purchases if user is logged in
        if (user) {
          const purchasesRes = await fetch("/api/student/purchases");
          if (purchasesRes.ok) {
            const pData = await purchasesRes.json();
            setEnrolledCourseIds(pData.enrolledCourseIds || []);
            setPurchasedLectureIds(pData.purchasedLectureIds || []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch courses from API:", err);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [user]);

  // Handle 1-Click Razorpay Purchase for complete course or lecture
  const handleDirectPurchase = async (params: {
    courseId?: string;
    lectureId?: string;
    itemTitle: string;
    price: number;
  }) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setIsPurchasing(params.courseId || params.lectureId || "item");

    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: params.courseId,
          lectureId: params.lectureId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to initiate payment.");
      }

      const orderData = await res.json();

      await openRazorpayCheckout({
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: orderData.keyId,
        itemTitle: params.itemTitle,
        user: {
          name: user.user_metadata?.full_name || user.email,
          email: user.email || "",
        },
        onSuccess: async (rzpRes) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: rzpRes.razorpay_order_id,
              razorpay_payment_id: rzpRes.razorpay_payment_id,
              razorpay_signature: rzpRes.razorpay_signature,
              courseId: params.courseId,
              lectureId: params.lectureId,
              amount: params.price,
              itemTitle: params.itemTitle,
            }),
          });

          if (verifyRes.ok) {
            if (params.courseId) {
              setEnrolledCourseIds((prev) => [...prev, params.courseId!]);
            }
            if (params.lectureId) {
              setPurchasedLectureIds((prev) => [...prev, params.lectureId!]);
            }
            alert("Enrollment successful! Access has been unlocked on your account.");
          } else {
            alert("Payment recorded. Verification in progress.");
          }
        },
        onFailure: (err) => {
          console.warn("Payment modal dismissed:", err);
        },
      });
    } catch (err: any) {
      alert(err.message || "Failed to start checkout. Please try again.");
    } finally {
      setIsPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#16141B] flex flex-col font-sans selection:bg-[#FDE047] selection:text-[#16141B]">
      <Navbar onOpenContact={() => setIsContactModalOpen(true)} />

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
              <Badge variant="yellow">ACADEMIC PROGRAMS &amp; LMS</Badge>
            </div>
            <h1 className="text-[38px] sm:text-[52px] lg:text-[64px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white max-w-[850px]">
              Explore Our Accountancy Courses
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.6] text-white/85 max-w-[700px] font-normal">
              Comprehensive learning modules designed to help Class 11th and 12th Commerce students develop strong accounting fundamentals and achieve academic excellence.
            </p>
          </div>
        </section>

        {/* Complete Courses Section */}
        <section className="py-20 lg:py-28 bg-[#F7F7F9]">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 space-y-16">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#5B32D6]" />
                <p className="text-sm font-semibold text-neutral-500">Loading courses from API...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-white rounded-[32px] p-12 text-center border border-dashed border-neutral-300 max-w-lg mx-auto space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center mx-auto">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-[#16141B]">No Courses Available</h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  There are currently no active courses available in the database. Courses added via the database will appear here.
                </p>
              </div>
            ) : (
              courses.map((course, idx) => {
                const inCart = isInCart(course.id);
                const isEnrolled = enrolledCourseIds.includes(course.id);

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="bg-white rounded-[32px] overflow-hidden border border-neutral-200/80 shadow-md hover:shadow-xl transition-shadow grid grid-cols-1 lg:grid-cols-12"
                  >
                    {/* Left Visual Column */}
                    <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-neutral-900 overflow-hidden">
                      <Image
                        src={course.image || course.thumbnail_key || "/images/accountancy-classroom.jpg"}
                        alt={course.title}
                        fill
                        className="object-cover object-center brightness-[0.88] hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 500px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-[#FDE047]">
                          {course.category}
                        </span>
                        <div className="text-lg font-bold">{course.mode || "Classroom Batches & Live Interactive Sessions"}</div>
                      </div>
                    </div>

                    {/* Right Content Column */}
                    <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
                      <div className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {course.badge && <Badge variant="yellow">{course.badge}</Badge>}
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                              {course.category}
                            </span>
                          </div>
                          {/* Price Badge */}
                          <div className="text-right">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl sm:text-3xl font-extrabold text-[#16141B]">
                                ₹{Number(course.price || 0).toLocaleString("en-IN")}
                              </span>
                              {course.original_price && (
                                <span className="text-sm text-neutral-400 line-through">
                                  ₹{Number(course.original_price).toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-emerald-600 font-bold">Annual Complete Batch</span>
                          </div>
                        </div>

                        <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#16141B] tracking-tight leading-snug">
                          {course.title}
                        </h2>

                        <p className="text-[15px] sm:text-[16px] text-neutral-600 leading-relaxed">
                          {course.description}
                        </p>

                        {/* Key Highlights */}
                        {course.highlights && course.highlights.length > 0 && (
                          <div className="space-y-2.5 pt-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                              Course Highlights &amp; Methodology
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {course.highlights.map((h: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-[13px] text-neutral-700">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{h}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Syllabus Overview */}
                        {course.topics && course.topics.length > 0 && (
                          <div className="space-y-2.5 pt-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                              Core Syllabus Modules
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {course.topics.slice(0, 6).map((topic: string, i: number) => (
                                <div
                                  key={i}
                                  className="p-2.5 rounded-xl bg-[#F7F7F9] text-xs font-semibold text-[#16141B] flex items-center gap-2"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#5B32D6]" />
                                  <span className="truncate">{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTA Footer with Buy Now, Cart & Access */}
                      <div className="pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="text-xs text-neutral-500 font-medium">
                          Taught directly by <strong>{course.teacher_name || "Parvesh Kumar"}</strong> (30+ Years Exp)
                        </div>
                        <div className="flex items-center gap-3">
                          {isEnrolled ? (
                            <div className="px-5 py-2.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Enrolled (Access Active)</span>
                            </div>
                          ) : (
                            <>
                              {inCart ? (
                                <button
                                  type="button"
                                  onClick={openCart}
                                  className="px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>In Cart</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => addToCart(course)}
                                  className="px-4 py-2.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold flex items-center gap-2 hover:bg-neutral-200 transition-colors cursor-pointer"
                                >
                                  <ShoppingBag className="w-4 h-4" />
                                  <span>Add to Cart</span>
                                </button>
                              )}

                              <Button
                                variant="purple"
                                size="sm"
                                className="gap-2 cursor-pointer"
                                disabled={isPurchasing === course.id}
                                onClick={() =>
                                  handleDirectPurchase({
                                    courseId: course.id,
                                    itemTitle: course.title,
                                    price: Number(course.price || 0),
                                  })
                                }
                              >
                                {isPurchasing === course.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CreditCard className="w-4 h-4" />
                                )}
                                <span>Buy Now</span>
                              </Button>
                            </>
                          )}
                          <Link href="/counseling">
                            <Button variant="dark" size="sm" className="gap-1.5">
                              <span>Inquire</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* ================= Individual Paid Masterclass Lectures ================= */}
        {paidLectures.length > 0 && (
          <section className="py-20 bg-white border-t border-neutral-100">
            <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 space-y-12">
              <div className="space-y-3">
                <Badge variant="yellow">CHAPTER MASTERCLASSES</Badge>
                <h2 className="text-[32px] sm:text-[42px] font-extrabold text-[#16141B] tracking-tight">
                  Individual Masterclass Lectures
                </h2>
                <p className="text-sm sm:text-base text-neutral-600 max-w-xl">
                  Purchase standalone concept masterclasses directly without enrolling in the full annual program.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {paidLectures.map((lecture) => {
                  const isLecturePurchased =
                    purchasedLectureIds.includes(lecture.id) ||
                    (lecture.course_id && enrolledCourseIds.includes(lecture.course_id));

                  return (
                    <div
                      key={lecture.id}
                      className="bg-[#F7F7F9] rounded-[28px] overflow-hidden border border-neutral-200/80 p-6 flex flex-col justify-between space-y-5 hover:shadow-lg transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#ECE8FA] text-[#5B32D6]">
                            {lecture.subject}
                          </span>
                          <span className="text-base font-black text-[#16141B]">
                            ₹{lecture.price}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-lg text-[#16141B] leading-snug">
                          {lecture.title}
                        </h3>
                        <p className="text-xs text-neutral-500 line-clamp-2">
                          {lecture.description || "In-depth chapter explanation with working notes and numerical solutions."}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-neutral-200/60 flex items-center justify-between">
                        <span className="text-xs text-neutral-400 font-medium">
                          {lecture.duration || "45 mins"}
                        </span>

                        {isLecturePurchased ? (
                          <Button
                            variant="purple"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => setActivePlayerLecture(lecture)}
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Watch Now</span>
                          </Button>
                        ) : (
                          <Button
                            variant="purple"
                            size="sm"
                            className="gap-1.5"
                            disabled={isPurchasing === lecture.id}
                            onClick={() =>
                              handleDirectPurchase({
                                lectureId: lecture.id,
                                itemTitle: lecture.title,
                                price: lecture.price,
                              })
                            }
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Unlock ₹{lecture.price}</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <CtaAndFooter onOpenContact={() => setIsContactModalOpen(true)} />
      </main>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Video Streaming Player */}
      <LecturePlayerModal
        isOpen={Boolean(activePlayerLecture)}
        onClose={() => setActivePlayerLecture(null)}
        lecture={activePlayerLecture}
        onInitiatePurchase={(lec) =>
          handleDirectPurchase({
            lectureId: lec.id,
            itemTitle: lec.title,
            price: lec.price,
          })
        }
      />
    </div>
  );
}
