"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Video,
  Calendar,
  Clock,
  User,
  ExternalLink,
  Edit3,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Radio,
  BookOpen,
  Sparkles,
  Loader2,
  RefreshCw,
  Plus,
} from "lucide-react";
import { LiveClassRecord, LiveClassStatus } from "@/types/lms";
import {
  isValidGoogleMeetUrl,
  computeLiveClassStatus,
  formatTime12Hr,
  formatDateReadable,
} from "@/lib/utils/live-class";

interface CourseOption {
  id: string;
  title: string;
  category: string;
  price: number;
}

export default function AdminLiveClassesPage() {
  const [liveClass, setLiveClass] = useState<LiveClassRecord | null>(null);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeletingDialogOpen, setIsDeletingDialogOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [description, setDescription] = useState("");
  const [teacherName, setTeacherName] = useState("Parvesh Kumar");
  const [googleMeetUrl, setGoogleMeetUrl] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("19:30");
  const [status, setStatus] = useState<LiveClassStatus>("Upcoming");
  const [isPublished, setIsPublished] = useState(true);

  // Notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch Live Class & Courses
  const loadData = async () => {
    try {
      setLoading(true);
      setNotification(null);
      const res = await fetch("/api/admin/live-classes");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load live class configuration");
      }

      setCourses(data.courses || []);

      if (data.liveClass) {
        setLiveClass(data.liveClass);
        populateForm(data.liveClass);
      } else {
        // Set sensible defaults if no class exists yet
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];

        setScheduledDate(tomorrowStr);
        if (data.courses && data.courses.length > 0) {
          setCourseId(data.courses[0].id);
        }
      }
    } catch (err: any) {
      console.error(err);
      setNotification({
        type: "error",
        message: err.message || "Failed to load configuration",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const populateForm = (c: LiveClassRecord) => {
    setTitle(c.title || "");
    setCourseId(c.course_id || "");
    setDescription(c.description || "");
    setTeacherName(c.teacher_name || "Parvesh Kumar");
    setGoogleMeetUrl(c.google_meet_url || "");
    setScheduledDate(c.scheduled_date || "");
    setStartTime(c.start_time ? c.start_time.slice(0, 5) : "18:00");
    setEndTime(c.end_time ? c.end_time.slice(0, 5) : "19:30");
    setStatus(c.status || "Upcoming");
    setIsPublished(typeof c.is_published === "boolean" ? c.is_published : true);
  };

  // Submit Save Live Class
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!title.trim()) {
      setNotification({ type: "error", message: "Class Title is required." });
      return;
    }

    if (!courseId) {
      setNotification({ type: "error", message: "Please select an associated course." });
      return;
    }

    if (!googleMeetUrl || !isValidGoogleMeetUrl(googleMeetUrl)) {
      setNotification({
        type: "error",
        message: "Please enter a valid Google Meet link (e.g., https://meet.google.com/abc-defg-hij).",
      });
      return;
    }

    if (!scheduledDate) {
      setNotification({ type: "error", message: "Please select a scheduled date." });
      return;
    }

    if (!startTime || !endTime) {
      setNotification({ type: "error", message: "Please set starting and ending times." });
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/live-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: liveClass?.id,
          title: title.trim(),
          course_id: courseId,
          description: description.trim(),
          teacher_name: teacherName.trim(),
          google_meet_url: googleMeetUrl.trim(),
          scheduled_date: scheduledDate,
          start_time: startTime,
          end_time: endTime,
          status,
          is_published: isPublished,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save live class.");
      }

      setNotification({
        type: "success",
        message: "Live class configured & saved successfully!",
      });

      // Reload fresh state
      await loadData();
    } catch (err: any) {
      console.error(err);
      setNotification({
        type: "error",
        message: err.message || "Failed to save live class.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Quick Toggle Publish / Unpublish
  const handleTogglePublish = async () => {
    if (!liveClass) return;
    try {
      setSaving(true);
      const newPublishedState = !liveClass.is_published;
      const res = await fetch("/api/admin/live-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...liveClass,
          is_published: newPublishedState,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsPublished(newPublishedState);
      setNotification({
        type: "success",
        message: `Live class is now ${newPublishedState ? "Published (Visible to students)" : "Unpublished (Hidden from students)"}.`,
      });
      await loadData();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  // Delete Live Class
  const handleDelete = async () => {
    if (!liveClass) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/live-classes?id=${liveClass.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsDeletingDialogOpen(false);
      setLiveClass(null);
      // Reset form
      setTitle("");
      setDescription("");
      setGoogleMeetUrl("");
      setNotification({
        type: "success",
        message: "Live class deleted successfully.",
      });
      await loadData();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setDeleting(false);
    }
  };

  const computedStatus = liveClass
    ? computeLiveClassStatus(
        liveClass.status,
        liveClass.scheduled_date,
        liveClass.start_time,
        liveClass.end_time
      )
    : "Upcoming";

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B32D6] mb-1">
            <Radio className="w-3.5 h-3.5" />
            <span>Interactive Sessions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#16141B] tracking-tight">
            Live Class Management
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Configure the single active Live Class card shown on the student portal. Google Meet links are encrypted and restricted to enrolled students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/live-classes"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-700 font-bold text-xs uppercase tracking-wider hover:bg-neutral-50 shadow-xs transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Student Page</span>
          </Link>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 shadow-xs transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 text-sm font-medium ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-rose-50 text-rose-900 border border-rose-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">{notification.message}</div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold underline opacity-75 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Form + Live Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Create / Edit Live Class (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="text-lg font-extrabold text-[#16141B]">
                {liveClass ? "Edit Live Class Configuration" : "Configure Live Class Card"}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Updates are automatically reflected in real-time on the student portal.
              </p>
            </div>

            {liveClass && (
              <button
                type="button"
                onClick={handleTogglePublish}
                disabled={saving}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  isPublished
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                    : "bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200"
                }`}
              >
                {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{isPublished ? "Published" : "Unpublished"}</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* 1. Class Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Class Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Live Doubt & Numerical Masterclass: Partnership Accounts"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-neutral-900 bg-white"
              />
            </div>

            {/* 2. Associated Course Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Associated Course (Access Gateway) *
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-neutral-900 bg-white"
              >
                <option value="">-- Select a Course Batch --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} (₹{c.price})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-neutral-500 mt-1">
                Only students who have purchased this batch will be able to see the Google Meet link.
              </p>
            </div>

            {/* 3. Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Class Description / Agenda
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe key topics, numericals, and doubt clearance items covered in this live session."
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-neutral-900 bg-white resize-y"
              />
            </div>

            {/* 4. Teacher Name & Google Meet URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Teacher / Faculty Name *
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Parvesh Kumar"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-neutral-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Google Meet URL (Protected) *
                </label>
                <input
                  type="url"
                  value={googleMeetUrl}
                  onChange={(e) => setGoogleMeetUrl(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-neutral-900 bg-white"
                />
              </div>
            </div>

            {/* 5. Date & Time Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Class Date *
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-neutral-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Start Time (IST) *
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-neutral-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  End Time (IST) *
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-neutral-900 bg-white"
                />
              </div>
            </div>

            {/* 6. Status & Publish Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Class Status Override
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LiveClassStatus)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#5B32D6] text-sm text-neutral-900 bg-white font-semibold"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Live Now">Live Now (Force Active)</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Dynamic status auto-switches to &quot;Live Now&quot; during class timings unless overridden.
                </p>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5B32D6] focus:ring-[#5B32D6] cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-800">
                      Publish on Student Website
                    </span>
                    <p className="text-[11px] text-neutral-500">
                      When enabled, this Live Class card is visible on the site.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-between gap-4 border-t border-neutral-100">
              {liveClass ? (
                <button
                  type="button"
                  onClick={() => setIsDeletingDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-rose-600 font-bold text-xs uppercase tracking-wider hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Class</span>
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#5B32D6] hover:bg-[#4A23C2] text-white font-extrabold text-sm shadow-md shadow-[#5B32D6]/20 transition disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Live Class</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5B32D6]" />
              <span>Live Card Preview</span>
            </h2>
            <span className="text-xs font-semibold text-neutral-400">
              Single-Card System
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-md p-6 space-y-5">
            {/* Status & Course Badge */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#5B32D6]/10 text-[#5B32D6] border border-[#5B32D6]/20">
                <span className="w-2 h-2 rounded-full bg-[#5B32D6] animate-pulse"></span>
                <span>{computedStatus}</span>
              </div>

              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  isPublished
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-neutral-200 text-neutral-700"
                }`}
              >
                {isPublished ? "Visible to Students" : "Hidden (Draft)"}
              </span>
            </div>

            {/* Course & Faculty Info */}
            <div>
              <div className="text-xs font-extrabold text-[#5B32D6] uppercase tracking-wider">
                {courses.find((c) => c.id === courseId)?.title || "Associated Course"}
              </div>
              <h3 className="text-xl font-black text-[#16141B] mt-1 leading-snug">
                {title || "Class Title Preview"}
              </h3>
              <p className="text-xs text-neutral-600 mt-2 line-clamp-3 leading-relaxed">
                {description || "Class description and syllabus concepts to be covered in this session will appear here."}
              </p>
            </div>

            {/* Timings */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-[#F7F7F9] border border-neutral-100 text-xs">
              <div className="flex items-center gap-2 text-neutral-700">
                <Calendar className="w-4 h-4 text-[#5B32D6] shrink-0" />
                <span className="font-bold">
                  {scheduledDate ? formatDateReadable(scheduledDate) : "Scheduled Date"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">
                  {formatTime12Hr(startTime)} – {formatTime12Hr(endTime)} IST
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <User className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Faculty: <strong className="font-bold">{teacherName}</strong></span>
              </div>
            </div>

            {/* Admin Google Meet Quick Access */}
            <div className="pt-2 border-t border-neutral-100 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Admin Meet Link Preview:
              </div>
              {googleMeetUrl ? (
                <a
                  href={googleMeetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-black transition"
                >
                  <Video className="w-4 h-4 text-[#FDE047]" />
                  <span>Launch Google Meet</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              ) : (
                <div className="text-xs text-neutral-400 italic">
                  Google Meet link not yet entered.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      {isDeletingDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-neutral-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#16141B]">
                Delete Live Class?
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                Are you sure you want to remove this Live Class? The card will be permanently deleted from the student website.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsDeletingDialogOpen(false)}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs uppercase tracking-wider hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-rose-700 shadow-sm"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
