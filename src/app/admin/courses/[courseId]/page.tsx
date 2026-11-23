"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { R2DirectUploader } from "@/components/admin/R2DirectUploader";
import { CourseRecord, CourseModuleRecord, LectureRecord } from "@/types/lms";
import {
  ArrowLeft,
  PlusCircle,
  Save,
  Trash2,
  Edit,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Lock,
  Play,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ExternalLink,
  MoveUp,
  MoveDown,
  Eye,
  Users,
  BookOpen,
  UploadCloud,
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
  const [activeTab, setActiveTab] = useState<"curriculum" | "settings">("curriculum");

  // Module Modal State
  const [isModuleModalOpen, setIsModuleModalOpen] = useState<boolean>(false);
  const [editingModule, setEditingModule] = useState<CourseModuleRecord | null>(null);
  const [moduleTitle, setModuleTitle] = useState<string>("");
  const [moduleDescription, setModuleDescription] = useState<string>("");

  // Lecture Modal State
  const [isLectureModalOpen, setIsLectureModalOpen] = useState<boolean>(false);
  const [editingLecture, setEditingLecture] = useState<LectureRecord | null>(null);
  const [targetModuleId, setTargetModuleId] = useState<string>("");
  const [isCreatingInlineModule, setIsCreatingInlineModule] = useState<boolean>(false);
  const [newModuleTitle, setNewModuleTitle] = useState<string>("");
  const [pdfResourceKey, setPdfResourceKey] = useState<string>("");
  const [lectureForm, setLectureForm] = useState({
    title: "",
    description: "",
    duration: "45 mins",
    is_preview: false,
    price: 0,
    status: "PUBLISHED" as "DRAFT" | "PUBLISHED",
    video_object_key: "",
  });

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
      setIsLectureModalOpen(true);
    }
  }, [searchParams]);

  // Handle Module Create or Update
  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim()) return;

    setIsSaving(true);
    try {
      if (editingModule) {
        // Update module
        await fetch(`/api/admin/modules/${editingModule.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: moduleTitle,
            description: moduleDescription,
          }),
        });
      } else {
        // Create new module
        await fetch(`/api/admin/courses/${courseId}/modules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: moduleTitle,
            description: moduleDescription,
          }),
        });
      }

      setIsModuleModalOpen(false);
      setEditingModule(null);
      setModuleTitle("");
      setModuleDescription("");
      await fetchCourseData();
    } catch (err) {
      console.error("Error saving module:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Module Delete
  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module and its lectures?")) return;
    try {
      const res = await fetch(`/api/admin/modules/${moduleId}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to delete module");
        return;
      }
      await fetchCourseData();
    } catch (err: any) {
      console.error("Failed to delete module:", err);
      alert(err?.message || "Failed to delete module");
    }
  };

  // Handle Module Reordering (Move Up / Down)
  const handleMoveModule = async (index: number, direction: "up" | "down") => {
    if (!course?.modules) return;
    const newModules = [...course.modules];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newModules.length) return;

    const [moved] = newModules.splice(index, 1);
    newModules.splice(targetIndex, 0, moved);

    // Optimistic UI update
    setCourse({ ...course, modules: newModules });

    try {
      await fetch(`/api/admin/courses/${courseId}/modules`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleIds: newModules.map((m) => m.id),
        }),
      });
    } catch (err) {
      console.error("Failed to reorder modules:", err);
      await fetchCourseData();
    }
  };

  // Open Lecture Modal for New Lecture
  const handleOpenNewLecture = (moduleId?: string) => {
    setEditingLecture(null);
    const chosenModId = moduleId || (course?.modules?.[0]?.id || "");
    setTargetModuleId(chosenModId);
    setIsCreatingInlineModule(!chosenModId);
    setNewModuleTitle("");
    setPdfResourceKey("");
    setLectureForm({
      title: "",
      description: "",
      duration: "45 mins",
      is_preview: false,
      price: 0,
      status: "PUBLISHED",
      video_object_key: "",
    });
    setIsLectureModalOpen(true);
  };

  // Open Lecture Modal for Editing Existing Lecture
  const handleOpenEditLecture = (lecture: LectureRecord) => {
    setEditingLecture(lecture);
    const matchedModule = course?.modules?.find(
      (m) => m.id === lecture.module_id || m.title === lecture.chapter
    );
    const modId = matchedModule?.id || lecture.module_id || course?.modules?.[0]?.id || "";
    setTargetModuleId(modId);
    setIsCreatingInlineModule(false);
    setNewModuleTitle("");
    setPdfResourceKey("");
    setLectureForm({
      title: lecture.title,
      description: lecture.description || "",
      duration: lecture.duration || "45 mins",
      is_preview: Boolean(lecture.is_preview || lecture.access_type === "free"),
      price: 0,
      status: (lecture.status as any) || (lecture.is_published ? "PUBLISHED" : "DRAFT"),
      video_object_key: lecture.video_object_key || lecture.video_key || "",
    });
    setIsLectureModalOpen(true);
  };

  // Save Lecture (Create or Update with module isolation)
  const handleSaveLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lectureForm.title.trim()) return;

    let finalModuleId = targetModuleId;

    setIsSaving(true);
    try {
      // If user selected to create a new module inline
      if (isCreatingInlineModule && newModuleTitle.trim()) {
        const modRes = await fetch(`/api/admin/courses/${courseId}/modules`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newModuleTitle.trim(),
            description: "",
          }),
        });
        if (modRes.ok) {
          const modData = await modRes.json();
          finalModuleId = modData.module?.id || modData.id;
        }
      }

      if (!finalModuleId) {
        alert("Please select or create a module for this lecture.");
        setIsSaving(false);
        return;
      }

      // Determine chapter title
      const targetMod = course?.modules?.find((m) => m.id === finalModuleId);
      const chapterTitle =
        isCreatingInlineModule && newModuleTitle.trim()
          ? newModuleTitle.trim()
          : targetMod?.title || "";

      if (editingLecture) {
        const res = await fetch(`/api/admin/lectures/${editingLecture.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...lectureForm,
            module_id: finalModuleId,
            chapter: chapterTitle,
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
            ...lectureForm,
            module_id: finalModuleId,
            chapter: chapterTitle,
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
      setIsCreatingInlineModule(false);
      setNewModuleTitle("");
      setPdfResourceKey("");
      await fetchCourseData();
    } catch (err: any) {
      console.error("Failed to save lecture:", err);
      alert(err?.message || "Failed to save lecture. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Lecture
  const handleDeleteLecture = async (lectureId: string) => {
    if (!confirm("Are you sure you want to delete this lecture?")) return;
    try {
      const res = await fetch(`/api/admin/lectures/${lectureId}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || "Failed to delete lecture");
        return;
      }
      await fetchCourseData();
    } catch (err: any) {
      console.error("Failed to delete lecture:", err);
      alert(err?.message || "Failed to delete lecture");
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
          alert("No video has been uploaded for this lecture yet.");
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
    try {
      await fetch(`/api/admin/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });
      setFeedbackMessage("Course settings saved successfully!");
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (err) {
      console.error("Failed to save course settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !course) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-200">
        <Loader2 className="w-8 h-8 animate-spin text-[#5B32D6] mb-3" />
        <p className="text-sm font-semibold text-gray-500">Loading course curriculum...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/courses"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#16141B] tracking-tight truncate max-w-md">
                {course.title}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                course.status === "PUBLISHED" || course.is_published
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}>
                {course.status || (course.is_published ? "PUBLISHED" : "DRAFT")}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {course.class_level || course.category} • ₹{Number(course.price).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/courses/${course.slug || course.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Page</span>
          </Link>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Course Overview & KPI Statistics */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#1D1136] to-[#5B32D6] shrink-0 border border-gray-100 relative">
            <img
              src={
                course.thumbnail_object_key ||
                course.thumbnail_key ||
                (course.id === "class-12" ? "/images/class-12-accountancy.jpg" : "/images/accountancy-classroom.jpg")
              }
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="absolute top-2.5 left-2.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#16141B]/85 text-[#FDE047] backdrop-blur-sm">
                {course.class_level || course.category}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5B32D6]">
                {course.class_level || course.category}
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                course.status === "PUBLISHED" || course.is_published
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-700"
              }`}>
                Status: {course.status || (course.is_published ? "PUBLISHED" : "DRAFT")}
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#16141B] tracking-tight">
              {course.title}
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
              {course.description}
            </p>
            <p className="text-xs font-semibold text-gray-500 pt-1">
              Instructor: <strong className="text-[#16141B]">Parvesh Kumar (Founder &amp; Lead Educator, 30+ Years Exp.)</strong> • Pricing: <strong className="text-[#5B32D6]">₹{Number(course.price).toLocaleString("en-IN")}</strong>
            </p>
          </div>
        </div>

        {/* 4 KPI Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="bg-[#F7F7F9] p-4 rounded-2xl border border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Modules
            </span>
            <span className="text-2xl font-black text-[#16141B] mt-1 block">
              {course.modules?.length || 0}
            </span>
          </div>
          <div className="bg-[#F7F7F9] p-4 rounded-2xl border border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Total Lectures
            </span>
            <span className="text-2xl font-black text-[#5B32D6] mt-1 block">
              {course.modules?.reduce((acc, m) => acc + (m.lectures?.length || 0), 0) || 0}
            </span>
          </div>
          <div className="bg-[#F7F7F9] p-4 rounded-2xl border border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Enrolled Students
            </span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {course.enrolled_students_count || 0}
            </span>
          </div>
          <div className="bg-[#F7F7F9] p-4 rounded-2xl border border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Publication
            </span>
            <span className="text-sm font-extrabold text-[#16141B] mt-2 block">
              {course.status === "PUBLISHED" || course.is_published ? "Live Online" : "Draft Mode"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("curriculum")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === "curriculum"
              ? "border-[#5B32D6] text-[#5B32D6]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Curriculum Builder ({course.modules?.length || 0} Modules)</span>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === "settings"
              ? "border-[#5B32D6] text-[#5B32D6]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Edit className="w-4 h-4" />
          <span>Course Details &amp; Pricing</span>
        </button>
      </div>

      {/* Tab 1: Curriculum Builder */}
      {activeTab === "curriculum" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <div>
              <h2 className="text-sm font-black text-[#16141B]">
                Curriculum Structure
              </h2>
              <p className="text-xs text-gray-500">
                Organize chapters into modules, upload recorded video lectures to Cloudflare R2, and set free preview rights.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingModule(null);
                setModuleTitle("");
                setModuleDescription("");
                setIsModuleModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white text-xs font-bold shadow-sm transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#FDE047]" />
              Add Module
            </button>
          </div>

          {/* Module List */}
          {course.modules?.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-6">
              <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-gray-800">No modules added yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Create your first module (e.g. &ldquo;Module 1: Partnership Fundamentals&rdquo;) to start uploading lectures.
              </p>
              <button
                onClick={() => setIsModuleModalOpen(true)}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-[#5B32D6] text-white text-xs font-bold hover:bg-[#4A23C2] transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add First Module
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {course.modules?.map((module, mIdx) => (
                <div
                  key={module.id}
                  className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-sm"
                >
                  {/* Module Header Bar */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-gray-400">
                        <button
                          onClick={() => handleMoveModule(mIdx, "up")}
                          disabled={mIdx === 0}
                          title="Move Module Up"
                          className="p-1 hover:text-black hover:bg-gray-200 rounded disabled:opacity-30"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveModule(mIdx, "down")}
                          disabled={mIdx === (course.modules?.length || 0) - 1}
                          title="Move Module Down"
                          className="p-1 hover:text-black hover:bg-gray-200 rounded disabled:opacity-30"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#5B32D6] font-bold text-xs flex items-center justify-center">
                        {mIdx + 1}
                      </div>

                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-[#16141B]">
                          {module.title}
                        </h3>
                        {module.description && (
                          <p className="text-xs text-gray-500">{module.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleOpenNewLecture(module.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-[#5B32D6] hover:bg-purple-100 text-xs font-bold transition"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Add Lecture
                      </button>

                      <button
                        onClick={() => {
                          setEditingModule(module);
                          setModuleTitle(module.title);
                          setModuleDescription(module.description || "");
                          setIsModuleModalOpen(true);
                        }}
                        className="p-2 rounded-xl text-gray-500 hover:text-black hover:bg-gray-100 text-xs transition"
                        title="Edit Module Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 text-xs transition"
                        title="Delete Module"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Lectures inside Module */}
                  <div className="divide-y divide-gray-100">
                    {!module.lectures || module.lectures.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gray-400">
                        No lectures yet in this module. Click &ldquo;Add Lecture&rdquo; to attach a recording.
                      </div>
                    ) : (
                      module.lectures.map((lecture, lIdx) => {
                        const isPreview = Boolean(lecture.is_preview || lecture.access_type === "free");
                        const hasVideo = Boolean(lecture.video_object_key || lecture.video_key);

                        return (
                          <div
                            key={lecture.id}
                            className="p-3.5 sm:px-6 hover:bg-gray-50/70 transition flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                                <Video className="w-4 h-4 text-purple-600" />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-xs sm:text-sm text-[#16141B] truncate">
                                    {lecture.title}
                                  </h4>
                                  {isPreview ? (
                                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                                      Free Preview
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1 shrink-0">
                                      <Lock className="w-2.5 h-2.5" /> Enrolled
                                    </span>
                                  )}
                                  {hasVideo ? (
                                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                                      R2 Video Ready
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                                      No Video Attached
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-gray-400 mt-0.5">
                                  Duration: {lecture.duration || "45 mins"}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {hasVideo && (
                                <button
                                  type="button"
                                  onClick={() => handlePreviewLectureVideo(lecture)}
                                  className="p-1.5 rounded-lg bg-purple-50 text-[#5B32D6] hover:bg-purple-100 transition text-xs font-bold flex items-center gap-1"
                                  title="Test Playback URL"
                                >
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span className="hidden sm:inline">Preview</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleOpenEditLecture(lecture)}
                                className="p-2 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 text-xs transition"
                                title="Edit Lecture & Video"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteLecture(lecture.id)}
                                className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 text-xs transition"
                                title="Delete Lecture"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Bottom bar of module */}
                  <div className="p-3.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-semibold">
                      {module.lectures?.length || 0} Lectures in this module
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenNewLecture(module.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5B32D6] text-white hover:bg-[#4A23C2] text-xs font-bold transition shadow-sm"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-[#FDE047]" />
                      Upload Lecture
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setEditingModule(null);
                    setModuleTitle("");
                    setModuleDescription("");
                    setIsModuleModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-[#16141B] hover:bg-gray-50 text-xs font-bold shadow-sm transition"
                >
                  <PlusCircle className="w-4 h-4 text-[#5B32D6]" />
                  Add Module
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Course Settings */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveCourseSettings} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-[#16141B] border-b border-gray-100 pb-3">
              Course Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-700">Course Title</label>
                <input
                  type="text"
                  value={course.title}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#5B32D6] focus:outline-none"
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
                  <option value="ARCHIVED">ARCHIVED (Preserved for Enrolled Students)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Fee (INR)</label>
                <input
                  type="number"
                  value={course.price}
                  onChange={(e) => setCourse({ ...course, price: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:border-[#5B32D6] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Original Price</label>
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

            {/* Thumbnail Upload */}
            <div className="pt-4 border-t border-gray-100">
              <R2DirectUploader
                label="Update Course Banner (Cloudflare R2)"
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 text-[#FDE047]" />
                )}
                <span>Save Course Details</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* MODAL 1: Module Create / Edit */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-[#16141B]">
              {editingModule ? "Edit Module" : "Add New Module"}
            </h3>
            <form onSubmit={handleSaveModule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Module Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Module 1: Partnership Fundamentals"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#5B32D6] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Description / Topic Coverage
                </label>
                <textarea
                  rows={3}
                  placeholder="Short summary of concepts covered in this module..."
                  value={moduleDescription}
                  onChange={(e) => setModuleDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#5B32D6] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModuleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#5B32D6] text-white text-xs font-bold hover:bg-[#4A23C2]"
                >
                  {isSaving ? "Saving..." : "Save Module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Lecture Create / Edit with Cloudflare R2 Upload */}
      {isLectureModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="border-b border-gray-100 pb-3">
              <span className="text-[10px] font-black uppercase text-[#5B32D6] tracking-wider block">
                Target Batch: {course.class_level || course.category || "Commerce"}
              </span>
              <h3 className="text-base font-black text-[#16141B] flex items-center gap-2 mt-0.5">
                <Video className="w-5 h-5 text-purple-600" />
                <span>{editingLecture ? "Edit Lecture & Media" : `Upload Lecture to ${course.title}`}</span>
              </h3>
            </div>

            <form onSubmit={handleSaveLecture} className="space-y-4">
              {/* Module Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Assign to Module *
                </label>
                <select
                  value={isCreatingInlineModule ? "__new__" : targetModuleId}
                  onChange={(e) => {
                    if (e.target.value === "__new__") {
                      setIsCreatingInlineModule(true);
                    } else {
                      setIsCreatingInlineModule(false);
                      setTargetModuleId(e.target.value);
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:border-[#5B32D6] focus:outline-none"
                >
                  {course.modules?.map((m, idx) => (
                    <option key={m.id} value={m.id}>
                      Module {idx + 1}: {m.title}
                    </option>
                  ))}
                  <option value="__new__">+ Create New Module</option>
                </select>
              </div>

              {isCreatingInlineModule && (
                <div className="space-y-1 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                  <label className="text-xs font-bold text-[#5B32D6] uppercase">
                    New Module Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Module 5: Financial Statement Analysis"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-purple-200 bg-white text-xs focus:outline-none font-medium"
                  />
                </div>
              )}

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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 52 mins"
                    value={lectureForm.duration}
                    onChange={(e) => setLectureForm({ ...lectureForm, duration: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#5B32D6] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Publication
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
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>
              </div>

              {/* Free Preview Toggle */}
              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#16141B]">
                    Enable Free Preview Access
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Allows prospective students to watch without enrolling.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={lectureForm.is_preview}
                  onChange={(e) =>
                    setLectureForm({ ...lectureForm, is_preview: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-[#5B32D6] focus:ring-[#5B32D6]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Lecture Description / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Key problems and ledger adjustments solved in this session..."
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
                  moduleId={targetModuleId || "general"}
                  lectureId={editingLecture?.id || "temp-lecture"}
                  currentKey={lectureForm.video_object_key}
                  onUploadSuccess={(key) =>
                    setLectureForm((prev) => ({ ...prev, video_object_key: key }))
                  }
                  maxSizeMB={1000} // up to 1GB video file
                />
              </div>

              {/* Optional Supplementary PDF Notes */}
              <div className="pt-1">
                <R2DirectUploader
                  label="Optional Supplementary Notes / Worksheet (PDF)"
                  accept="application/pdf"
                  fileCategory="pdf"
                  courseId={courseId}
                  moduleId={targetModuleId || "general"}
                  lectureId={editingLecture?.id || "temp-lecture"}
                  currentKey={pdfResourceKey}
                  onUploadSuccess={(key) => setPdfResourceKey(key)}
                  maxSizeMB={50}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsLectureModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-[#5B32D6] text-white text-xs font-bold hover:bg-[#4A23C2] transition"
                >
                  {isSaving ? "Saving..." : "Save Lecture"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Video Preview Player Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#16141B] rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between text-white">
              <h3 className="text-sm font-bold truncate">{previewTitle}</h3>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="text-gray-400 hover:text-white text-xs font-bold px-2 py-1 bg-gray-800 rounded-lg"
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
        <div className="min-h-[400px] flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#5B32D6] mb-3" />
          <p className="text-sm font-semibold text-gray-500">Loading curriculum editor...</p>
        </div>
      }
    >
      <CourseEditorContent {...props} />
    </Suspense>
  );
}
