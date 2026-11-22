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
import { Course } from "@/types";
import { createClient } from "@/lib/supabase/client";
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShoppingBag,
  Check,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function CoursesPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { addToCart, isInCart, openCart } = useCart();
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .order("created_at", { ascending: true });

        if (data && !error && data.length > 0) {
          const mapped: Course[] = data.map((item: any) => ({
            id: item.id,
            category: item.category || "Commerce",
            badge: item.badge || undefined,
            title: item.title,
            price: Number(item.price || 0),
            originalPrice: item.original_price ? Number(item.original_price) : undefined,
            description: item.description || "",
            image: item.image || "/images/accountancy-classroom.jpg",
            mode: item.mode || "Classroom Batches & Live Interactive Sessions",
            topics: Array.isArray(item.topics) ? item.topics : [],
            highlights: Array.isArray(item.highlights) ? item.highlights : [],
          }));
          setCoursesList(mapped);
        } else {
          setCoursesList([]);
        }
      } catch (err) {
        console.error("Error fetching courses from database:", err);
        setCoursesList([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadCourses();
  }, []);

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
              <Badge variant="yellow">ACADEMIC PROGRAMS</Badge>
            </div>
            <h1 className="text-[38px] sm:text-[52px] lg:text-[64px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white max-w-[850px]">
              Explore Our Accountancy Courses
            </h1>
            <p className="text-[16px] sm:text-[18px] lg:text-[20px] leading-[1.6] text-white/85 max-w-[700px] font-normal">
              Comprehensive learning modules designed to help Class 11th and 12th Commerce students develop strong accounting fundamentals and achieve academic excellence.
            </p>
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-20 lg:py-28 bg-[#F7F7F9]">
          <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 space-y-16">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#5B32D6]" />
                <p className="text-sm font-semibold text-neutral-500">Loading courses...</p>
              </div>
            ) : coursesList.length === 0 ? (
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
              coursesList.map((course, idx) => {
                const inCart = isInCart(course.id);
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
                        src={course.image}
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
                        <div className="text-lg font-bold">{course.mode}</div>
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
                                ₹{course.price.toLocaleString("en-IN")}
                              </span>
                              {course.originalPrice && (
                                <span className="text-sm text-neutral-400 line-through">
                                  ₹{course.originalPrice.toLocaleString("en-IN")}
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
                              {course.highlights.map((h, i) => (
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
                              {course.topics.slice(0, 6).map((topic, i) => (
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

                      {/* CTA Footer with Cart & Inquire Actions */}
                      <div className="pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="text-xs text-neutral-500 font-medium">
                          Taught directly by <strong>Parvesh Kumar</strong> (15+ Years Exp)
                        </div>
                        <div className="flex items-center gap-3">
                          {inCart ? (
                            <button
                              type="button"
                              onClick={openCart}
                              className="px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span>In Cart (View)</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addToCart(course)}
                              className="px-5 py-2.5 rounded-full bg-[#5B32D6] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#4A23C2] transition-colors shadow-xs cursor-pointer"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              <span>Add to Cart</span>
                            </button>
                          )}
                          <Link href="/counseling">
                            <Button variant="dark" size="sm" className="gap-1.5">
                              <span>Counseling</span>
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

        <CtaAndFooter onOpenContact={() => setIsContactModalOpen(true)} />
      </main>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
