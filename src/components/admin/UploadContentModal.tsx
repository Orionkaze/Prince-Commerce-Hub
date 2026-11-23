"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UploadCloud,
  FileVideo,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Globe,
  Tag,
  DollarSign,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ContentType, AccessType } from "@/types/lms";

interface UploadContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UploadContentModal({ isOpen, onClose, onSuccess }: UploadContentModalProps) {
  // Form State
  const [title, setTitle] = useState("");
  const [teacherName, setTeacherName] = useState("Parvesh Kumar");
  const [subject, setSubject] = useState("Accountancy");
  const [courseChoice, setCourseChoice] = useState<string>("class-11");
  const [chapterName, setChapterName] = useState("");
  const [lectureNumber, setLectureNumber] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<ContentType>("Recorded Lecture");
  const [accessType, setAccessType] = useState<AccessType>("paid");
  const [isPublished, setIsPublished] = useState<boolean>(true);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successDone, setSuccessDone] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const uploadFileToR2 = async (file: File, fileCategory: string) => {
    // 1. Get presigned upload URL from backend
    const res = await fetch("/api/upload/presigned-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        fileCategory,
        subject,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to obtain upload URL");
    }

    const { uploadUrl, key } = await res.json();

    // 2. Direct upload to R2
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const percentComplete = Math.round((evt.loaded / evt.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(key);
        } else {
          reject(new Error(`Storage returned status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during file upload"));
      xhr.send(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!title.trim()) {
      setErrorMessage("Please enter a content title.");
      return;
    }

    if (!selectedFile) {
      setErrorMessage("Please select a file to upload (Video or PDF).");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // 1. Upload main content file to R2
      setStatusMessage("Uploading file to Cloudflare R2 storage...");
      const fileCategory = contentType === "Recorded Lecture" ? "video" : "pdf";
      const uploadedFileKey = await uploadFileToR2(selectedFile, fileCategory);

      // 2. Upload thumbnail if provided
      let uploadedThumbnailKey: string | null = null;
      if (selectedThumbnail) {
        setStatusMessage("Uploading thumbnail image...");
        uploadedThumbnailKey = await uploadFileToR2(selectedThumbnail, "thumbnail");
      }

      // 3. Save metadata to Supabase
      setStatusMessage("Saving metadata and permissions in database...");
      const res = await fetch("/api/content/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          teacherName: teacherName.trim(),
          subject,
          courseId: courseChoice,
          chapterName: chapterName.trim() || undefined,
          lectureNumber: lectureNumber.trim() || undefined,
          description: description.trim(),
          contentType,
          accessType,
          price: 0,
          isPublished,
          videoKey: contentType === "Recorded Lecture" ? uploadedFileKey : null,
          fileKey: contentType !== "Recorded Lecture" ? uploadedFileKey : null,
          thumbnailKey: uploadedThumbnailKey,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to catalog content.");
      }

      setSuccessDone(true);
      setStatusMessage("Published successfully!");
      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16141B]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-white rounded-[32px] w-full max-w-3xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#16141B] via-[#241B3B] to-[#16141B] text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="yellow">TEACHER PORTAL</Badge>
              <span className="text-xs font-bold text-[#C4B5FD] uppercase tracking-wider">
                Cloudflare R2 + LMS
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-[#FDE047]" />
              <span>Upload Learning Content</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm text-[#16141B]">
          {/* Success Banner */}
          {successDone && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Content Published!</strong> The material is now cataloged and available to students.
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Section 1: Content Information */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-[#16141B] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#5B32D6]" />
              <span>1. Content Information</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Content Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Partnership Accounts — Goodwill Valuation & Super Profits"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Content Type *
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] font-medium"
                >
                  <option value="Recorded Lecture">Recorded Lecture (MP4)</option>
                  <option value="PDF Notes">PDF Notes</option>
                  <option value="Study Material">Study Material</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Other">Other Resource</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Subject *
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] font-medium"
                >
                  <option value="Accountancy">Accountancy</option>
                  <option value="Economics">Economics</option>
                  <option value="Business Studies">Business Studies</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Teacher Name
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6]"
                />
              </div>
            </div>

            {/* Course & Chapter Assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Target Batch *
                </label>
                <select
                  value={courseChoice}
                  onChange={(e) => setCourseChoice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] font-bold text-xs"
                >
                  <option value="class-11">Class 11 Accountancy (Comprehensive Foundation)</option>
                  <option value="class-12">Class 12 Accountancy (Board Excellence)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Chapter / Module Name *
                </label>
                <input
                  type="text"
                  required
                  value={chapterName}
                  onChange={(e) => setChapterName(e.target.value)}
                  placeholder="e.g. Rules of Debit & Credit"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Lecture Number
                </label>
                <input
                  type="text"
                  value={lectureNumber}
                  onChange={(e) => setLectureNumber(e.target.value)}
                  placeholder="e.g. 01"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Description &amp; Key Concepts Covered
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of topics, rules, and problem types solved in this session..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#5B32D6]"
              />
            </div>
          </div>

          {/* Section 2: File Upload (Drag & Drop) */}
          <div className="space-y-3 pt-2 border-t border-neutral-100">
            <h3 className="font-extrabold text-base text-[#16141B] flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-[#5B32D6]" />
              <span>2. File Upload</span>
            </h3>

            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[#5B32D6] bg-[#ECE8FA]/50 scale-[1.01]"
                  : "border-neutral-300 hover:border-[#5B32D6] bg-[#F7F7F9]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={contentType === "Recorded Lecture" ? "video/mp4,video/webm" : "application/pdf"}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />

              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  {contentType === "Recorded Lecture" ? (
                    <FileVideo className="w-8 h-8 text-[#5B32D6]" />
                  ) : (
                    <FileText className="w-8 h-8 text-[#5B32D6]" />
                  )}
                  <div className="text-left">
                    <div className="font-bold text-[#16141B]">{selectedFile.name}</div>
                    <div className="text-xs text-neutral-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Click or drag to change
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#ECE8FA] text-[#5B32D6] flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-[#16141B]">
                    Click or drag &amp; drop {contentType === "Recorded Lecture" ? "MP4 video" : "PDF document"}
                  </div>
                  <div className="text-xs text-neutral-400">
                    Direct high-speed streaming upload to Cloudflare R2
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Upload (Optional) */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-5 h-5 text-neutral-500" />
                <span className="text-xs font-bold text-neutral-700">
                  {selectedThumbnail ? selectedThumbnail.name : "Custom Thumbnail (Optional JPG/PNG)"}
                </span>
              </div>
              <input
                ref={thumbInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedThumbnail(e.target.files[0]);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => thumbInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                Browse Image
              </button>
            </div>
          </div>

          {/* Section 3: Access Permissions */}
          <div className="space-y-4 pt-2 border-t border-neutral-100">
            <h3 className="font-extrabold text-base text-[#16141B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5B32D6]" />
              <span>3. Access Permissions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Free Preview */}
              <div
                onClick={() => setAccessType("free")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  accessType === "free"
                    ? "border-[#5B32D6] bg-[#ECE8FA]/30"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-[#16141B] flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>Free Preview Lecture</span>
                  </span>
                  {accessType === "free" && <CheckCircle2 className="w-4 h-4 text-[#5B32D6]" />}
                </div>
                <p className="text-xs text-neutral-500">
                  Open to all prospective students without enrollment as a sample preview class.
                </p>
              </div>

              {/* Option 2: Paid / Batch Enrolled Content */}
              <div
                onClick={() => setAccessType("paid")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  accessType === "paid"
                    ? "border-[#5B32D6] bg-[#ECE8FA]/30"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-[#16141B] flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#5B32D6]" />
                    <span>Batch Enrolled Access</span>
                  </span>
                  {accessType === "paid" && <CheckCircle2 className="w-4 h-4 text-[#5B32D6]" />}
                </div>
                <p className="text-xs text-neutral-500">
                  Included in the complete batch curriculum. Unlocked automatically when the student enrolls in this batch.
                </p>
              </div>
            </div>

            {/* Batch Enrollment Notice */}
            <div className="p-4 rounded-2xl bg-[#F7F7F9] border border-gray-200/80 text-xs text-gray-600 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#5B32D6] shrink-0" />
              <div>
                <strong>Batch-Based Curriculum:</strong> Students purchase the entire batch (Class 11 or Class 12 Accountancy) to access this lecture. Individual lecture sales are disabled.
              </div>
            </div>
          </div>

          {/* Section 4: Publishing Status */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <div>
              <div className="font-bold text-[#16141B]">Publishing Status</div>
              <div className="text-xs text-neutral-500">
                {isPublished ? "Visible to students immediately upon upload" : "Saved as Draft (only visible to Teacher)"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPublished(false)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  !isPublished ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setIsPublished(true)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isPublished ? "bg-emerald-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                Publish Now
              </button>
            </div>
          </div>

          {/* Upload Progress Bar */}
          {isSubmitting && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                <span>{statusMessage || "Transferring to storage..."}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#5B32D6] to-[#7C3AED] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-6 border-t border-neutral-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="white"
              size="md"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="purple"
              size="md"
              disabled={isSubmitting}
              className="gap-2 min-w-[140px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>{isPublished ? "Publish to LMS" : "Save as Draft"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
