"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { R2DirectUploader } from "@/components/admin/R2DirectUploader";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { CourseRecord, LectureRecord } from "@/types/lms";
import {
  ArrowLeft,
  PlusCircle,
  Save,
  Trash2,
  Edit,
  Video,
  FileText,
  Play,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Lock,
  Sparkles,
  ListVideo,
  Sliders,
  Settings,
} from "lucide-react";

function CourseEditorContent({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;
  const searchParams = useSearchParams();

  const [course, setCourse] = useState<CourseRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"playlist" | "settings">("playlist");

  // Lecture Modal State
  const [isLectureModalOpen, setIsLectureModalOpen] = useState<boolean>(false);
  const [editingLecture, setEditingLecture] = useState<LectureRecord | null>(null);
  const [pdfResourceKey, setPdfResourceKey] = useState<string>("");
  const [lectureForm, setLectureForm] = useState({
    title: "",
    chapter: "",
    description: "",
    duration: "45 mins",
    is_preview: false,
    status: "PUBLISHED" as "DRAFT" | "PUBLISHED",
    video_object_key: "",
  });

  // Deletion Confirmation State
  const [lectureToDelete, setLectureToDelete] = useState<LectureRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Video Preview Modal State
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  // Loading states
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data.course);
      }
    } catch (err) {
      console.error("Failed to load course details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    if (searchParams.get("upload") === "true") {
      handleOpenNewLecture();
    }
  }, [searchParams]);

  // Open Lecture Modal for New Lecture
  const handleOpenNewLecture = () => {
    setEditingLecture(null);
    setPdfResourceKey("");
    setLectureForm({
      title: "",
      chapter: "",
      description: "",
      duration: "45 mins",
      is_preview: false,
      status: "PUBLISHED",
      video_object_key: "",
    });
    setIsLectureModalOpen(true);
  };

  // Open Lecture Modal for Editing Existing Lecture
  const handleOpenEditLecture = (lecture: LectureRecord) => {
    setEditingLecture(lecture);
    setPdfResourceKey("");
    setLectureForm({
      title: lecture.title,
      chapter: lecture.chapter || "",
      description: lecture.description || "",
      duration: lecture.duration || "45 mins",
      is_preview: Boolean(lecture.is_preview || lecture.access_type === "free"),
      status: (lecture.status as any) || (lecture.is_published ? "PUBLISHED" : "DRAFT"),
      video_object_key: lecture.video_object_key || lecture.video_key || "",
    });
    setIsLectureModalOpen(true);
  };

  // Save Lecture (Create or Update synced to Supabase & Cloudflare R2)
  const handleSaveLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lectureForm.title.trim()) {
      alert("Please enter a lecture title.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingLecture) {
        const res = await fetch(`/api/admin/lectures/${editingLecture.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: lectureForm.title.trim(),
            chapter: lectureForm.chapter.trim() || undefined,
            description: lectureForm.description.trim(),
            duration: lectureForm.duration.trim() || "45 mins",
            is_preview: lectureForm.is_preview,
            status: lectureForm.status,
            video_object_key: lectureForm.video_object_key || undefined,
            resource_key: pdfResourceKey || undefined,
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to update lecture");
        }
      } else {
        const res = await fetch(`/api/admin/courses/${courseId}/lectures`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course_id: courseId,
            title: lectureForm.title.trim(),
            chapter: lectureForm.chapter.trim() || undefined,
            description: lectureForm.description.trim(),
            duration: lectureForm.duration.trim() || "45 mins",
            is_preview: lectureForm.is_preview,
            status: lectureForm.status,
            video_object_key: lectureForm.video_object_key || undefined,
            resource_key: pdfResourceKey || undefined,
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to create lecture");
        }
      }

      setIsLectureModalOpen(false);
      setEditingLecture(null);
      setPdfResourceKey("");
      await fetchCourseData();
    } catch (err: any) {
      console.error("Failed to save lecture:", err);
      alert(err?.message || "Failed to save lecture. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Lecture Confirmation Execution
  const handleDeleteLectureConfirm = async () => {
    if (!lectureToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/lectures/${lectureToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to delete lecture");
        return;
      }
      setLectureToDelete(null);
      await fetchCourseData();
    } catch (err: any) {
      console.error("Failed to delete lecture:", err);
      alert(err?.message || "Failed to delete lecture");
    } finally {
      setIsDeleting(false);
    }
  };

  // Play Video Preview
  const handlePreviewLectureVideo = async (lecture: LectureRecord) => {
    try {
      const res = await fetch(`/api/lectures/${lecture.id}/stream`);
      if (res.ok) {
        const data = await res.json();
        if (data.playbackUrl) {
          setPreviewVideoUrl(data.playbackUrl);
          setPreviewTitle(lecture.title);
        } else {
          alert("No video file has been uploaded for this lecture yet.");
        }
      }
    } catch (err) {
      console.error("Failed to fetch stream URL:", err);
    }
  };

  // Save Course Settings
  const handleSaveCourseSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    setIsSaving(true);
    setFeedbackMessage(null);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: course.title,
          description: course.description,
          price: course.price,
          original_price: course.original_price,
          status: course.status,
          class_level: course.class_level,
          thumbnail_object_key: course.thumbnail_object_key || course.thumbnail_key,
        }),
      });

      if (res.ok) {
        setFeedbackMessage("Course details updated successfully.");
        await fetchCourseData();
        setTimeout(() => setFeedbackMessage(null), 3000);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to update course details");
      }
    } catch (err) {
      console.error("Failed to save course:", err);
      alert("Failed to update course details.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !course) {
    return (
      <div className="min-h-screen bg-[#F7F7F9] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-9 h-9 animate-spin text-[#5B32D6]" />
        <p className="text-xs font-bold text-gray-500">Loading batch details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F7F7F9] p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold">Course Not Found</h2>
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5B32D6] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Courses
        </Link>
      </div>
    );
  }

  // Get flat lecture playlist
  const lecturesList: LectureRecord[] =
    course.lectures && course.lectures.length > 0
      ? course.lectures
      : course.modules?.flatMap((m) => m.lectures || []) || [];

  return (
    <div className="min-h-screen bg-[#F7F7F9] font-sans pb-24 text-[#16141B]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <AdminHeader
          title={course.title}
          subtitle="Manage lectures playlist, video uploads, notes, and batch curriculum"
        />

        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Courses</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/learn/${course.id}/first`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-black text-xs font-bold transition shadow-xs"
            >
              <ExternalLink className="w-3 h-3 text-[#5B32D6]" />
              <span>Preview Classroom</span>
            </Link>
          </div>
        </div>

        {/* Course Banner Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#ECE8FA] text-[#5B32D6]">
                {course.class_level || course.category || "Commerce Batch"}
              </span>
              <span className="text-[11px] font-bold text-gray-400">
                • {lecturesList.length} Lectures
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16141B] tracking-tight">
              {course.title}
            </h1>

            <p className="text-xs text-gray-500 max-w-2xl leading-relaxed line-clamp-2">
              {course.description}
            </p>

            <div className="text-xs text-gray-500 pt-1">
              Pricing:{" "}
              <strong className="text-[#16141B] font-extrabold text-sm">
                ₹{Number(course.price || 99).toLocaleString("en-IN")}
              </strong>
              {course.original_price && (
                <span className="text-gray-400 line-through text-xs ml-1.5 font-medium">
                  ₹{Number(course.original_price).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 flex sm:flex-col gap-2">
            <button
              type="button"
              onClick={handleOpenNewLecture}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#5B32D6] hover:bg-[#4E2EC2] text-white text-xs font-bold transition shadow-md shadow-[#5B32D6]/20 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#FDE047]" />
              <span>Upload Lecture</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-3 border-b border-gray-200/90">
          <button
            onClick={() => setActiveTab("playlist")}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === "playlist"
                ? "border-[#5B32D6] text-[#5B32D6]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <ListVideo className="w-4 h-4" />
            <span>Lectures Playlist ({lecturesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === "settings"
                ? "border-[#5B32D6] text-[#5B32D6]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Batch Settings &amp; Pricing</span>
          </button>
        </div>

        {/* TAB 1: Lectures Playlist */}
        {activeTab === "playlist" && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs">
              <div>
                <h2 className="text-sm font-extrabold text-[#16141B] flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#5B32D6]" />
                  <span>Course Lectures Playlist</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Upload, preview, edit, and organize lecture recordings and notes for this batch.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenNewLecture}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5B32D6] hover:bg-[#4E2EC2] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#FDE047]" />
                <span>Add Lecture</span>
              </button>
            </div>

            {/* Playlist Cards */}
            {lecturesList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 p-8 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#5B32D6] flex items-center justify-center mx-auto">
                  <Video className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#16141B]">
                    No lectures uploaded yet
                  </h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                    Start building this course curriculum by uploading your first lecture recording to Cloudflare R2.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleOpenNewLecture}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5B32D6] hover:bg-[#4E2EC2] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-[#FDE047]" />
                    <span>Upload First Lecture</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-sm divide-y divide-gray-100">
                {lecturesList.map((lecture, idx) => {
                  const isPreview = Boolean(
                    lecture.is_preview || lecture.access_type === "free"
                  );
                  const hasVideo = Boolean(
                    lecture.video_object_key || lecture.video_key
                  );
                  const hasNotes = Boolean(
                    lecture.resources && lecture.resources.length > 0
                  );

                  return (
                    <div
                      key={lecture.id}
                      className="p-4 sm:p-5 hover:bg-gray-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      {/* Left Details */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        {/* Number Badge */}
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5B32D6] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-extrabold text-sm text-[#16141B] break-words">
                              {lecture.title}
                            </h3>

                            {lecture.chapter && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                {lecture.chapter}
                              </span>
                            )}
                          </div>

                          {/* Metadata row */}
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-[11px] text-gray-400">
                              Duration: {lecture.duration || "45 mins"}
                            </span>

                            {/* Access Status */}
                            {isPreview ? (
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                Free Preview
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" /> Enrolled
                              </span>
                            )}

                            {/* Video Status */}
                            {hasVideo ? (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                R2 Video Ready
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                                No Video Attached
                              </span>
                            )}

                            {/* Notes PDF Status */}
                            {hasNotes && (
                              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <FileText className="w-3 h-3 text-blue-600" />
                                Study Notes PDF
                              </span>
                            )}

                            {/* Publication Status */}
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                lecture.is_published
                                  ? "text-emerald-700 bg-emerald-50"
                                  : "text-neutral-500 bg-neutral-100"
                              }`}
                            >
                              {lecture.is_published ? "Published" : "Draft"}
                            </span>
                          </div>

                          {lecture.description && (
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {lecture.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        {hasVideo && (
                          <button
                            type="button"
                            onClick={() => handlePreviewLectureVideo(lecture)}
                            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-purple-50 text-[#5B32D6] hover:bg-purple-100 transition text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            title="Test Playback URL"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span className="hidden sm:inline">Preview</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenEditLecture(lecture)}
                          className="p-2 rounded-xl text-gray-600 hover:text-black hover:bg-gray-100 text-xs transition cursor-pointer"
                          title="Edit Lecture Name &amp; Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setLectureToDelete(lecture)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 text-xs transition cursor-pointer"
                          title="Delete Lecture"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Batch Settings & Pricing */}
        {activeTab === "settings" && (
          <form
            onSubmit={handleSaveCourseSettings}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-6"
          >
            {feedbackMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feedbackMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-700">Course Batch Title</label>
                <input
                  type="text"
                  value={course.title}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:border-[#5B32D6] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Class Level</label>
                <select
                  value={course.class_level || course.category}
                  onChange={(e) => setCourse({ ...course, class_level: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#5B32D6] focus:outline-none"
                >
                  <option value="Class 11">Class 11 Commerce</option>
                  <option value="Class 12">Class 12 Commerce</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Publication Status</label>
                <select
                  value={course.status || (course.is_published ? "PUBLISHED" : "DRAFT")}
                  onChange={(e) =>
                    setCourse({
                      ...course,
                      status: e.target.value as any,
                      is_published: e.target.value === "PUBLISHED",
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:border-[#5B32D6] focus:outline-none"
                >
                  <option value="PUBLISHED">PUBLISHED (Live on Public Catalog)</option>
                  <option value="DRAFT">DRAFT (Hidden)</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Discounted Fee (INR)</label>
                <input
                  type="number"
                  value={course.price}
                  onChange={(e) => setCourse({ ...course, price: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:border-[#5B32D6] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Original Slashed Price (INR)</label>
                <input
                  type="number"
                  value={course.original_price || course.price}
                  onChange={(e) => setCourse({ ...course, original_price: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:border-[#5B32D6] focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-700">Course Description</label>
                <textarea
                  rows={4}
                  value={course.description}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#5B32D6] focus:outline-none"
                />
              </div>
            </div>

            {/* Course Banner Upload */}
            <div className="pt-4 border-t border-gray-100">
              <R2DirectUploader
                label="Update Course Banner / Thumbnail (Cloudflare R2)"
                accept="image/png,image/jpeg,image/webp"
                fileCategory="thumbnail"
                courseId={course.id}
                currentKey={course.thumbnail_object_key || course.thumbnail_key}
                onUploadSuccess={(key) =>
                  setCourse({ ...course, thumbnail_object_key: key, thumbnail_key: key })
                }
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5B32D6] hover:bg-[#4E2EC2] text-white text-xs font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 text-[#FDE047]" />
                )}
                <span>Save Course Details</span>
              </button>
            </div>
          </form>
        )}
      </main>

      {/* MODAL 1: Lecture Create / Edit Modal (Clean & Simplified, No Modules) */}
      {isLectureModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-[#16141B]">
                  {editingLecture ? "Edit Lecture" : "Upload New Lecture"}
                </h3>
                <p className="text-xs text-gray-500">
                  {course.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLectureModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLecture} className="space-y-4">
              {/* Lecture Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Lecture Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lecture 1: Rules of Debit & Credit"
                  value={lectureForm.title}
                  onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#5B32D6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Optional Chapter/Topic Tag */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Topic / Chapter Tag (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Accounting Equation"
                    value={lectureForm.chapter}
                    onChange={(e) =>
                      setLectureForm({ ...lectureForm, chapter: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#5B32D6] focus:outline-none"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 45 mins"
                    value={lectureForm.duration}
                    onChange={(e) =>
                      setLectureForm({ ...lectureForm, duration: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#5B32D6] focus:outline-none"
                  />
                </div>
              </div>

              {/* Publication Status & Free Preview Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Publication Status
                  </label>
                  <select
                    value={lectureForm.status}
                    onChange={(e) =>
                      setLectureForm({
                        ...lectureForm,
                        status: e.target.value as "DRAFT" | "PUBLISHED",
                      })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold focus:border-[#5B32D6] focus:outline-none"
                  >
                    <option value="PUBLISHED">Published (Visible to Students)</option>
                    <option value="DRAFT">Draft (Hidden)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block">
                      Free Preview
                    </label>
                    <p className="text-[11px] text-gray-400">
                      Allows preview without enrollment
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={lectureForm.is_preview}
                    onChange={(e) =>
                      setLectureForm({ ...lectureForm, is_preview: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-[#5B32D6] focus:ring-[#5B32D6] cursor-pointer"
                  />
                </div>
              </div>

              {/* Lecture Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Lecture Description / Overview
                </label>
                <textarea
                  rows={2}
                  placeholder="Key concepts and problems solved in this session..."
                  value={lectureForm.description}
                  onChange={(e) =>
                    setLectureForm({ ...lectureForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#5B32D6] focus:outline-none"
                />
              </div>

              {/* Cloudflare R2 Direct Video Upload */}
              <div className="pt-2">
                <R2DirectUploader
                  label="Lecture Recording Video (Cloudflare R2)"
                  accept="video/mp4,video/webm,video/quicktime"
                  fileCategory="video"
                  courseId={courseId}
                  lectureId={editingLecture?.id || "temp-lecture"}
                  currentKey={lectureForm.video_object_key}
                  onUploadSuccess={(key) =>
                    setLectureForm((prev) => ({ ...prev, video_object_key: key }))
                  }
                  maxSizeMB={1000}
                />
              </div>

              {/* Optional Supplementary PDF Notes */}
              <div className="pt-1">
                <R2DirectUploader
                  label="Optional Supplementary Notes / Worksheet (PDF)"
                  accept="application/pdf"
                  fileCategory="pdf"
                  courseId={courseId}
                  lectureId={editingLecture?.id || "temp-lecture"}
                  currentKey={pdfResourceKey}
                  onUploadSuccess={(key) => setPdfResourceKey(key)}
                  maxSizeMB={50}
                />
              </div>

              {/* Form Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsLectureModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-[#5B32D6] hover:bg-[#4E2EC2] text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? "Saving..." : editingLecture ? "Save Changes" : "Save Lecture"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Branded Deletion Confirmation Dialog */}
      <ConfirmationModal
        isOpen={Boolean(lectureToDelete)}
        onClose={() => {
          if (!isDeleting) setLectureToDelete(null);
        }}
        onConfirm={handleDeleteLectureConfirm}
        title="Delete Lecture"
        itemName={lectureToDelete?.title}
        message="Are you sure you want to permanently delete this lecture from the course batch? Its video recording and any attached PDF study notes will be removed from the curriculum. This action cannot be undone."
        confirmLabel="Delete Permanently"
        cancelLabel="Keep Lecture"
        isLoading={isDeleting}
      />

      {/* MODAL 3: Video Preview Player Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#16141B] rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between text-white">
              <h3 className="text-sm font-bold truncate">{previewTitle}</h3>
              <button
                type="button"
                onClick={() => setPreviewVideoUrl(null)}
                className="text-gray-400 hover:text-white text-xs font-bold px-2.5 py-1 bg-gray-800 rounded-lg cursor-pointer"
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
            <p className="text-[11px] text-gray-400 text-center">
              Direct streaming verified via temporary signed Cloudflare R2 token.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CourseEditorPage(props: {
  params: Promise<{ courseId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F7F9] flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#5B32D6]" />
        </div>
      }
    >
      <CourseEditorContent params={props.params} />
    </Suspense>
  );
}
