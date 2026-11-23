"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { CtaAndFooter } from "@/components/footer/CtaAndFooter";
import { ContactModal } from "@/components/footer/ContactModal";
import { useAuth } from "@/context/AuthContext";
import { CourseRecord, LectureRecord } from "@/types/lms";
import { openRazorpayCheckout } from "@/lib/payments/checkout";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Lock,
  CreditCard,
  Layers,
  Video,
  ChevronDown,
  ChevronUp,
  Sparkles,
  GraduationCap,
  Award,
  ShieldCheck,
  HelpCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

function CourseDetailsContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  const [course, setCourse] = useState<CourseRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);

  // Preview Player Modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  useEffect(() => {
    async function fetchCourseDetails() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/courses/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setCourse(data.course);

          // Expand all modules by default
          if (data.course?.modules) {
            const initialExpanded: Record<string, boolean> = {};
            data.course.modules.forEach((m: any) => {
              initialExpanded[m.id] = true;
            });
            setExpandedModules(initialExpanded);
          }
        }

        // Check if user is enrolled or admin
        if (isAdmin) {
          setIsEnrolled(true);
        } else if (user) {
          const pRes = await fetch("/api/student/purchases");
          if (pRes.ok) {
            const pData = await pRes.json();
            const enrolled = pData.enrolledCourseIds || [];
            if (enrolled.includes(slug)) {
              setIsEnrolled(true);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load course:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourseDetails();
  }, [slug, user]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // Preview lecture video
  const handlePreviewLecture = async (lecture: LectureRecord) => {
    try {
      const res = await fetch(`/api/lectures/${lecture.id}/stream`);
      if (res.ok) {
        const data = await res.json();
        if (data.playbackUrl) {
          setPreviewVideoUrl(data.playbackUrl);
          setPreviewTitle(lecture.title);
        } else {
          alert("Preview video is being processed. Please check back shortly.");
        }
      } else {
        alert("This lecture requires enrollment to access.");
      }
    } catch (err) {
      console.error("Preview video error:", err);
    }
  };

  // Handle Buy Now Checkout
  const handleBuyNow = async () => {
    if (!course) return;
    if (!user) {
      router.push(`/login?redirectTo=/courses/${course.slug || course.id}`);
      return;
    }

    setIsPurchasing(true);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        alert(orderData.error || "Failed to initialize order.");
        setIsPurchasing(false);
        return;
      }

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
            setIsEnrolled(true);
            router.push(`/purchase/success?courseId=${course.id}&paymentId=${rzpResponse.razorpay_payment_id}`);
          } else {
            router.push(`/purchase/failed?error=${encodeURIComponent(verifyData.error || "Payment verification failed")}`);
          }
          setIsPurchasing(false);
        },
        onFailure: () => {
          setIsPurchasing(false);
        },
      });
    } catch (err: any) {
      console.error("Purchase error:", err);
      alert(err?.message || "Failed to start Razorpay payment.");
      setIsPurchasing(false);
    }
  };

  if (isLoading || !course) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar onOpenContact={() => setIsContactModalOpen(true)} />
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-[#5B32D6] mb-4" />
          <p className="text-sm font-semibold text-gray-500">Loading course curriculum...</p>
        </div>
        <CtaAndFooter onOpenContact={() => setIsContactModalOpen(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#16141B] flex flex-col font-sans">
      <Navbar onOpenContact={() => setIsContactModalOpen(true)} />

      {/* Hero Header Section */}
      <section className="pt-32 pb-16 bg-[#16141B] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left 2 Cols: Title & Description */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-[#FDE047] text-[#16141B] text-xs font-black uppercase tracking-wider">
                  {course.class_level || course.category}
                </span>
                <span className="px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-bold backdrop-blur-sm">
                  {course.subject || "Accountancy"}
                </span>
                <span className="px-3.5 py-1 rounded-full bg-purple-900/60 text-purple-300 text-xs font-bold border border-purple-700/50">
                  {course.duration || "60+ Hours"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-base text-gray-300 leading-relaxed max-w-2xl">
                {course.description}
              </p>

              {/* Lead Instructor card */}
              <div className="pt-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#5B32D6] text-white flex items-center justify-center font-black text-lg border-2 border-[#FDE047]">
                  P
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Lead Educator &amp; Mentor
                  </div>
                  <div className="text-base font-extrabold text-white">
                    {course.instructor_name || "Parvesh Kumar"} (30+ Years Experience)
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Sticky Purchase Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-[#16141B] border border-gray-100 shadow-2xl space-y-5 lg:sticky lg:top-28">
              {course.thumbnail_object_key || course.thumbnail_key ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
                  <img
                    src={course.thumbnail_object_key || course.thumbnail_key || ""}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Full Course Access
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-[#16141B]">
                    ₹{Number(course.price).toLocaleString("en-IN")}
                  </span>
                  {course.original_price && course.original_price > course.price && (
                    <span className="text-base text-gray-400 line-through">
                      ₹{Number(course.original_price).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All module recordings &amp; chapter tests</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Downloadable PDF formula sheets &amp; notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive doubt clearing with Parvesh Sir</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>High-speed video playback &amp; seeking</span>
                </div>
              </div>

              {isEnrolled ? (
                <Link
                  href={`/learn/${course.id}/first`}
                  className="w-full py-3.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Go to Enrolled Course</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isPurchasing}
                  className="w-full py-3.5 px-4 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#5B32D6]/30 transition disabled:opacity-50"
                >
                  {isPurchasing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4 text-[#FDE047]" />
                  )}
                  <span>Buy Now (₹{Number(course.price).toLocaleString("en-IN")})</span>
                </button>
              )}

              <p className="text-[11px] text-gray-400 text-center">
                Secure 256-bit encrypted payment powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Curriculum & Outcomes */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left 2 Cols: Curriculum & FAQs */}
          <div className="lg:col-span-2 space-y-12">
            {/* Curriculum Accordion */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#16141B] tracking-tight">
                    Course Curriculum
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {course.modules?.length || 0} Modules • {course.lectures_count || 0} Total Lectures
                  </p>
                </div>
              </div>

              {/* Modules List */}
              <div className="space-y-4">
                {course.modules?.map((module, mIdx) => {
                  const isExpanded = expandedModules[module.id];
                  const lectures = module.lectures || [];

                  return (
                    <div
                      key={module.id}
                      className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => toggleModule(module.id)}
                        className="w-full p-5 bg-[#F7F7F9] hover:bg-gray-100 text-left flex items-center justify-between transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#5B32D6] text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {mIdx + 1}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-sm sm:text-base text-[#16141B]">
                              {module.title}
                            </h3>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {lectures.length} Lectures
                            </div>
                          </div>
                        </div>

                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-gray-100">
                          {lectures.length === 0 ? (
                            <div className="py-6 text-center text-xs text-gray-400">
                              Lectures are being uploaded for this chapter.
                            </div>
                          ) : (
                            lectures.map((lecture) => {
                              const isPreview = Boolean(
                                lecture.is_preview || lecture.access_type === "free"
                              );

                              return (
                                <div
                                  key={lecture.id}
                                  className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50/60 transition"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                                      <Video className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-xs sm:text-sm text-[#16141B] truncate">
                                          {lecture.title}
                                        </h4>
                                        {isPreview && (
                                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                                            Free Preview
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-gray-400 mt-0.5">
                                        Duration: {lecture.duration || "45 mins"}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="shrink-0">
                                    {isPreview ? (
                                      <button
                                        type="button"
                                        onClick={() => handlePreviewLecture(lecture)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition"
                                      >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        <span>Watch Preview</span>
                                      </button>
                                    ) : isEnrolled ? (
                                      <Link
                                        href={`/learn/${course.id}/${lecture.id}`}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5B32D6] text-xs font-bold transition"
                                      >
                                        <Play className="w-3 h-3 fill-current" />
                                        <span>Watch</span>
                                      </Link>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-bold px-2 py-1 bg-gray-50 rounded-lg">
                                        <Lock className="w-3 h-3" />
                                        <span>Enrolled Only</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What you'll learn */}
            <div className="bg-[#F7F7F9] rounded-3xl p-6 sm:p-8 border border-gray-200/80 space-y-4">
              <h3 className="text-xl font-black text-[#16141B] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#5B32D6]" />
                What You Will Master in This Course
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Comprehensive board syllabus coverage per CBSE and State Board guidelines</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>In-depth mastery of complex 6-mark and 8-mark numerical adjustments</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Speed and accuracy drills preventing ledger alignment mistakes</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Past 15 years board examination papers solved step-by-step</span>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-[#16141B] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#5B32D6]" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-3 text-sm">
                <div className="p-4 rounded-2xl border border-gray-200 bg-white">
                  <div className="font-bold text-[#16141B]">Can I watch lectures at my own pace?</div>
                  <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Yes. All recorded lectures are hosted on high-speed Cloudflare R2 object storage with fast seeking and automatic progress tracking, allowing you to resume anytime.
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-gray-200 bg-white">
                  <div className="font-bold text-[#16141B]">How are student doubts addressed?</div>
                  <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Students enrolled in full batches receive dedicated WhatsApp counseling and regular live doubt-clearing sessions led directly by Parvesh Sir.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Preview Video Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#16141B] rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase">
                  Free Preview
                </span>
                <h3 className="text-sm font-bold truncate">{previewTitle}</h3>
              </div>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="text-gray-400 hover:text-white text-xs font-bold px-3 py-1 bg-gray-800 rounded-lg shrink-0"
              >
                Close Preview
              </button>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
              <video
                src={previewVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Counseling Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <CtaAndFooter onOpenContact={() => setIsContactModalOpen(true)} />
    </div>
  );
}

export default function CourseDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-[#5B32D6] mb-4" />
          <p className="text-sm font-semibold text-gray-500">Loading course curriculum...</p>
        </div>
      }
    >
      <CourseDetailsContent {...props} />
    </Suspense>
  );
}
