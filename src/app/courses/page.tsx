"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { ContactModal } from "@/components/footer/ContactModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CourseRecord } from "@/types/lms";
import { openRazorpayCheckout } from "@/lib/payments/checkout";
import { createClient } from "@/lib/supabase/client";
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Check,
  CreditCard,
  Loader2,
  Search,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";

const DEFAULT_COURSES: CourseRecord[] = [
  {
    id: "class-11",
    title: "Class 11 Accountancy (Crash Course)",
    category: "Class 11 Commerce",
    badge: "CLASS 11 COMMERCE",
    description:
      "A comprehensive foundation in financial accounting, designed to help Class 11 Commerce students understand accounting concepts and develop strong numerical problem-solving skills. Covers accounting principles, accounting equations, journal entries, ledger posting, subsidiary books, cash book, bank reconciliation, depreciation, trial balance, rectification of errors and preparation of financial statements.",
    teacher_name: "Parvesh Kumar",
    subject: "Accountancy",
    thumbnail_key: "/images/class-11-accountancy.jpg",
    price: 99,
    original_price: 1200,
    is_published: true,
    mode: "Accountancy Crash Course",
    topics: [
      "Introduction and Theory Base of Accounting",
      "Accounting Equation, Journal and Ledger",
      "Cash Book and Subsidiary Books",
      "Bank Reconciliation Statement",
      "Depreciation, Provisions, Reserves and Trial Balance",
      "Financial Statements and Incomplete Records",
    ],
    highlights: [
      "Live + Recorded Batches",
      "Free PDFs",
      "Exam Oriented Preparations",
      "Self Evaluated Test",
    ],
    created_at: "2026-11-22T11:06:09.150Z",
    updated_at: "2026-11-23T12:00:00.000Z",
  },
  {
    id: "class-12",
    title: "Class 12 Accountancy (Crash Course)",
    category: "Class 12 Commerce",
    badge: "CLASS 12 COMMERCE",
    description:
      "An exam-focused Accountancy crash course for Class 12 Commerce students, covering partnership firms, company accounts and financial statement analysis. Develop strong numerical problem-solving skills through partnership adjustments, goodwill valuation, admission, retirement and dissolution of partners, share capital, debentures, accounting ratios and cash flow statements.",
    teacher_name: "Parvesh Kumar",
    subject: "Accountancy",
    thumbnail_key: "/images/class-12-accountancy.jpg",
    price: 99,
    original_price: 1300,
    is_published: true,
    mode: "Accountancy Crash Course",
    topics: [
      "Partnership Fundamentals and Goodwill",
      "Change in Profit Sharing Ratio and Admission of a Partner",
      "Retirement, Death and Dissolution of a Partnership Firm",
      "Accounting for Share Capital",
      "Issue and Accounting for Debentures",
      "Financial Statement Analysis, Accounting Ratios and Cash Flow Statement",
    ],
    highlights: [
      "Live + Recorded Batches",
      "Free PDFs",
      "Exam Oriented Preparations",
      "Self Evaluated Test",
    ],
    created_at: "2026-11-22T11:06:09.150Z",
    updated_at: "2026-11-23T12:00:00.000Z",
  },
];

export default function CoursesPage() {
  const router = useRouter();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { addToCart, isInCart, openCart } = useCart();
  const { user, isAdmin } = useAuth();

  const [courses, setCourses] = useState<CourseRecord[]>(DEFAULT_COURSES);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Load courses and student enrollments from Supabase
  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      try {
        const supabase = createClient();

        // Fetch published courses
        const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: true });

        if (coursesData && !coursesError && coursesData.length > 0) {
          setCourses(coursesData);
        } else {
          setCourses(DEFAULT_COURSES);
        }

        // Fetch student purchases if user is logged in
        if (user) {
          const purchasesRes = await fetch("/api/student/purchases");
          if (purchasesRes.ok) {
            const pData = await purchasesRes.json();
            setEnrolledCourseIds(pData.enrolledCourseIds || []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch courses from API:", err);
        setCourses(DEFAULT_COURSES);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [user]);

  // Handle 1-Click Razorpay Purchase for complete course bundle
  const handleDirectPurchase = async (course: CourseRecord) => {
    if (!user) {
      router.push(`/login?redirectTo=/courses/${course.slug || course.id}`);
      return;
    }

    setIsPurchasing(course.id);
    try {
      // 1. Create Razorpay order via server API
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        alert(orderData.error || "Failed to initialize order.");
        setIsPurchasing(null);
        return;
      }

      // 2. Open Razorpay Checkout modal
      await openRazorpayCheckout({
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        keyId: orderData.keyId,
        itemTitle: course.title,
        user: {
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Student",
          email: user.email || "",
        },
        onSuccess: async (rzpResponse) => {
          // 3. Verify signature on backend
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_signature: rzpResponse.razorpay_signature,
              courseId: course.id,
              amount: course.price,
              itemTitle: course.title,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            setEnrolledCourseIds((prev) => [...prev, course.id]);
            router.push(`/purchase/success?courseId=${course.id}&paymentId=${rzpResponse.razorpay_payment_id}`);
          } else {
            router.push(`/purchase/failed?error=${encodeURIComponent(verifyData.error || "Payment verification failed")}`);
          }
          setIsPurchasing(null);
        },
        onFailure: () => {
          setIsPurchasing(null);
        },
      });
    } catch (err: any) {
      console.error("Purchase checkout error:", err);
      alert(err?.message || "Failed to initiate payment gateway.");
      setIsPurchasing(null);
    }
  };

  // Filter & Sort Courses
  const currentCourses = courses.length > 0 ? courses : DEFAULT_COURSES;
  const filteredCourses = currentCourses
    .filter((c) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.topics?.some((t) => t.toLowerCase().includes(q)) ||
        c.highlights?.some((h) => h.toLowerCase().includes(q));

      const isClass11 =
        c.id === "class-11" ||
        c.category?.toLowerCase().includes("11") ||
        c.title?.toLowerCase().includes("11");

      const isClass12 =
        c.id === "class-12" ||
        c.category?.toLowerCase().includes("12") ||
        c.title?.toLowerCase().includes("12");

      const matchesClass =
        selectedClass === "all" ||
        (selectedClass === "Class 11" && isClass11) ||
        (selectedClass === "Class 12" && isClass12);

      return matchesSearch && matchesClass;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

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
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 relative z-10 space-y-4 text-center sm:text-left">
            <div>
              <Badge variant="yellow">ACADEMIC PROGRAMS &amp; LMS</Badge>
            </div>
            <h1 className="text-[36px] sm:text-[48px] lg:text-[58px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white max-w-[850px]">
              Explore Our Accountancy Courses
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[19px] leading-[1.6] text-white/85 max-w-[700px] font-normal">
              Comprehensive learning modules designed to help Class 11th and 12th Commerce students develop strong accounting fundamentals and achieve academic excellence.
            </p>
          </div>
        </section>

        {/* Complete Courses Section */}
        <section className="py-12 pb-24 bg-[#F7F7F9]">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
            {/* Search, Filter, and Sort Toolbar */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/80 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
              {/* Search Input */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by topic or chapter name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  suppressHydrationWarning
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F7F7F9] rounded-2xl text-sm border border-neutral-200 focus:border-[#5B32D6] focus:bg-white focus:outline-none transition shadow-2xs"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex rounded-2xl bg-[#F7F7F9] p-1 border border-neutral-200 text-xs font-bold shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setSelectedClass("all")}
                    suppressHydrationWarning
                    className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                      selectedClass === "all"
                        ? "bg-[#5B32D6] text-white shadow-xs"
                        : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    All Classes
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedClass("Class 11")}
                    suppressHydrationWarning
                    className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                      selectedClass === "Class 11"
                        ? "bg-[#5B32D6] text-white shadow-xs"
                        : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    Class 11
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedClass("Class 12")}
                    suppressHydrationWarning
                    className={`px-4 py-2 rounded-xl transition cursor-pointer ${
                      selectedClass === "Class 12"
                        ? "bg-[#5B32D6] text-white shadow-xs"
                        : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    Class 12
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  suppressHydrationWarning
                  className="px-4 py-2 bg-[#F7F7F9] rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-700 focus:outline-none focus:border-[#5B32D6] focus:bg-white shadow-2xs cursor-pointer"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="price-low">Fee: Low to High</option>
                  <option value="price-high">Fee: High to Low</option>
                </select>
              </div>
            </div>

            {/* Courses List */}
            {isLoading && courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#5B32D6]" />
                <p className="text-sm font-semibold text-neutral-500">Loading courses...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="bg-white rounded-[32px] p-12 text-center border border-dashed border-neutral-300 max-w-lg mx-auto space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center mx-auto">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-[#16141B]">No courses match your search</h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  We could not find any courses matching &quot;{search}&quot;. Try adjusting your search query or reset your class filter.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSelectedClass("all");
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5B32D6] text-white text-xs font-bold hover:bg-[#4E2EC2] transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            ) : (
              filteredCourses.map((course, idx) => {
                const inCart = isInCart(course.id);
                const isEnrolled = isAdmin || enrolledCourseIds.includes(course.id);
                const isClass11 =
                  course.id === "class-11" ||
                  course.category?.toLowerCase().includes("11") ||
                  course.title?.toLowerCase().includes("11");

                const classLabel = isClass11 ? "CLASS 11 COMMERCE" : "CLASS 12 COMMERCE";
                const imageSrc =
                  course.thumbnail_key ||
                  (isClass11 ? "/images/class-11-accountancy.jpg" : "/images/class-12-accountancy.jpg");

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="bg-white rounded-[32px] overflow-hidden border border-neutral-200/80 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 mb-10"
                  >
                    {/* Left Visual Column */}
                    <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full bg-neutral-900 overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={course.title}
                        fill
                        className="object-cover object-center brightness-[0.88] hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 500px"
                        priority={idx === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-[#FDE047]">
                          {classLabel}
                        </span>
                        <div className="text-lg font-bold text-white">
                          Accountancy Crash Course
                        </div>
                      </div>
                    </div>

                    {/* Right Content Column */}
                    <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
                      <div className="space-y-6">
                        {/* Header Row: Category Badge & Price */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="yellow">{classLabel}</Badge>
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                              {isClass11 ? "Class 11 CBSE" : "Class 12 CBSE"}
                            </span>
                          </div>
                          {/* Price Badge */}
                          <div className="text-right">
                            <div className="flex items-baseline gap-2.5 justify-end">
                              <span className="text-2xl sm:text-3xl font-extrabold text-[#16141B]">
                                ₹{Number(course.price || 99).toLocaleString("en-IN")}
                              </span>
                              <span className="text-sm sm:text-base text-neutral-400 line-through font-medium">
                                ₹{Number(course.original_price || (isClass11 ? 1200 : 1300)).toLocaleString("en-IN")}
                              </span>
                            </div>
                            <span className="text-[11px] text-emerald-600 font-bold">
                              Comprehensive Crash Course
                            </span>
                          </div>
                        </div>

                        {/* 1. Large Course Title */}
                        <h2 className="text-[26px] sm:text-[32px] font-extrabold text-[#16141B] tracking-tight leading-snug">
                          {course.title}
                        </h2>

                        {/* 2. Course Description */}
                        <p className="text-[15px] sm:text-[16px] text-neutral-600 leading-relaxed">
                          {course.description}
                        </p>

                        {/* 3. & 4. WHAT WE WILL PROVIDE */}
                        {course.highlights && course.highlights.length > 0 && (
                          <div className="space-y-2.5 pt-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                              WHAT WE WILL PROVIDE
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

                        {/* 5. & 6. CORE SYLLABUS MODULES */}
                        {course.topics && course.topics.length > 0 && (
                          <div className="space-y-2.5 pt-2">
                            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                              CORE SYLLABUS MODULES
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

                      {/* 7. Divider & 8. Instructor info & 9. Action buttons */}
                      <div className="pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="text-xs text-neutral-500 font-medium">
                          Taught directly by <strong className="text-[#16141B]">Parvesh Kumar</strong> (30+ Years Experience)
                        </div>
                        <div className="flex items-center gap-3">
                          {isEnrolled ? (
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/learn/${course.id}/first`}
                                className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-xs transition-colors"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{isAdmin ? "Admin Access (Classroom)" : "Enrolled (Access Active)"}</span>
                              </Link>
                              {isAdmin && (
                                <Link
                                  href={`/admin/courses/${course.id}`}
                                  className="px-4 py-2.5 rounded-full bg-[#16141B] hover:bg-gray-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                                >
                                  <span>Manage Batch</span>
                                </Link>
                              )}
                            </div>
                          ) : (
                            <>
                              {inCart ? (
                                <button
                                  type="button"
                                  onClick={openCart}
                                  suppressHydrationWarning
                                  className="px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>In Cart</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    addToCart({
                                      id: course.id,
                                      title: course.title,
                                      category: course.category || (isClass11 ? "Class 11 Commerce" : "Class 12 Commerce"),
                                      badge: classLabel,
                                      price: Number(course.price || 99),
                                      image: imageSrc,
                                      description: course.description,
                                      topics: course.topics,
                                      highlights: course.highlights,
                                    })
                                  }
                                  suppressHydrationWarning
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
                                onClick={() => handleDirectPurchase(course)}
                                suppressHydrationWarning
                              >
                                {isPurchasing === course.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CreditCard className="w-4 h-4 text-[#FDE047]" />
                                )}
                                <span>Buy Now</span>
                              </Button>
                            </>
                          )}
                          <Button
                            variant="dark"
                            size="sm"
                            className="gap-1.5 cursor-pointer"
                            onClick={() => setIsContactModalOpen(true)}
                            suppressHydrationWarning
                          >
                            <span>Inquire</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        <CtaAndFooter onOpenContact={() => setIsContactModalOpen(true)} />
      </main>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
