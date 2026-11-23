"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { R2DirectUploader } from "@/components/admin/R2DirectUploader";
import {
  ArrowLeft,
  Save,
  Loader2,
  BookOpen,
  DollarSign,
  Layers,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function NewCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    class_level: "Class 12",
    subject: "Accountancy",
    instructor_name: "Parvesh Kumar",
    price: 14500,
    original_price: 18000,
    duration: "60+ Hours",
    language: "Hinglish",
    status: "DRAFT" as "DRAFT" | "PUBLISHED",
    description: "",
    topicsText: "",
    thumbnail_object_key: "",
  });

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === "" || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") ? slug : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError("Please enter a course title.");
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setError("Please specify a valid enrollment fee.");
      return;
    }
    if (!form.description.trim()) {
      setError("Please provide a course description.");
      return;
    }

    setIsSubmitting(true);
    try {
      const topics = form.topicsText
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: form.title,
          slug: form.slug,
          class_level: form.class_level,
          subject: form.subject,
          instructor_name: form.instructor_name,
          price: Number(form.price),
          original_price: Number(form.original_price) || Number(form.price),
          discounted_price: Number(form.price),
          duration: form.duration,
          language: form.language,
          status: form.status,
          description: form.description,
          topics,
          thumbnail_object_key: form.thumbnail_object_key,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create course");
      }

      // Redirect directly to curriculum editor for this course
      router.push(`/admin/courses/${data.course.id}`);
    } catch (err: any) {
      console.error("Create course error:", err);
      setError(err?.message || "An unexpected error occurred while saving course.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button & Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/courses"
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#16141B] tracking-tight">
            Create New Course
          </h1>
          <p className="text-xs text-gray-500">
            Define basic course metadata, pricing, and upload the course card banner.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Core Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-5">
          <h2 className="text-base font-extrabold text-[#16141B] flex items-center gap-2 border-b border-gray-100 pb-3">
            <BookOpen className="w-4 h-4 text-[#5B32D6]" />
            Course Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Course Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Class 12 Accountancy (Board Excellence 2026-27)"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5B32D6] focus:outline-none text-sm transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                URL Identifier / Slug *
              </label>
              <input
                type="text"
                placeholder="e.g. class-12-accountancy"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5B32D6] focus:outline-none text-sm font-mono transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Class Level *
              </label>
              <select
                value={form.class_level}
                onChange={(e) => setForm({ ...form, class_level: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5B32D6] focus:outline-none text-sm transition"
              >
                <option value="Class 11">Class 11 Commerce</option>
                <option value="Class 12">Class 12 Commerce</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Lead Instructor
              </label>
              <input
                type="text"
                value={form.instructor_name}
                onChange={(e) => setForm({ ...form, instructor_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5B32D6] focus:outline-none text-sm transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Subject
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5B32D6] focus:outline-none text-sm transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Course Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 60+ Hours & Comprehensive Tests"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5B32D6] focus:outline-none text-sm transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Teaching Language
              </label>
              <input
                type="text"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5B32D6] focus:outline-none text-sm transition"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Detailed Course Description *
              </label>
              <textarea
                rows={4}
                placeholder="Comprehensive syllabus description, key chapters, examination strategy..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5B32D6] focus:outline-none text-sm transition"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Pricing & Publication Status */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-5">
          <h2 className="text-base font-extrabold text-[#16141B] flex items-center gap-2 border-b border-gray-100 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Fee &amp; Publication Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Enrollment Fee (INR) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  required
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5B32D6] focus:outline-none text-sm font-bold transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Original Price (Strikethrough)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={form.original_price}
                  onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5B32D6] focus:outline-none text-sm font-bold transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Initial Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as "DRAFT" | "PUBLISHED" })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#5B32D6] focus:outline-none text-sm font-bold transition"
              >
                <option value="DRAFT">Save as Draft (Private)</option>
                <option value="PUBLISHED">Publish to Catalog (Live)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 3: Cloudflare R2 Thumbnail Upload */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-5">
          <h2 className="text-base font-extrabold text-[#16141B] flex items-center gap-2 border-b border-gray-100 pb-3">
            <FileText className="w-4 h-4 text-amber-600" />
            Course Media (Cloudflare R2)
          </h2>

          <R2DirectUploader
            label="Course Banner / Thumbnail"
            accept="image/png,image/jpeg,image/webp"
            fileCategory="thumbnail"
            courseId={form.slug || "new-course"}
            onUploadSuccess={(key) => setForm((prev) => ({ ...prev, thumbnail_object_key: key }))}
            maxSizeMB={10}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/courses"
            className="px-6 py-2.5 rounded-full border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-100 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-2.5 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white text-sm font-bold shadow-md shadow-[#5B32D6]/20 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Course...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#FDE047]" />
                <span>Save &amp; Build Curriculum</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
