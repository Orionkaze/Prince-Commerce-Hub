"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Layers,
  FileVideo,
  FileText,
  Trash2,
  Eye,
  EyeOff,
  Edit3,
  Check,
  Search,
  ExternalLink,
  Loader2,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LectureRecord, CourseRecord, ResourceRecord } from "@/types/lms";

interface ContentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUpload: () => void;
}

export function ContentManagerModal({
  isOpen,
  onClose,
  onOpenUpload,
}: ContentManagerModalProps) {
  const [tab, setTab] = useState<"lectures" | "courses" | "resources">("lectures");
  const [lectures, setLectures] = useState<LectureRecord[]>([]);
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [resources, setResources] = useState<ResourceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/content/manage");
      if (res.ok) {
        const data = await res.json();
        setLectures(data.lectures || []);
        setCourses(data.courses || []);
        setResources(data.resources || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchContent();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTogglePublish = async (itemType: "lecture" | "course" | "resource", id: string, currentStatus: boolean) => {
    setActionInProgress(id);
    try {
      const res = await fetch("/api/content/manage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType,
          id,
          isPublished: !currentStatus,
        }),
      });
      if (res.ok) {
        await fetchContent();
      }
    } finally {
      setActionInProgress(null);
    }
  };

  const handleSavePrice = async (itemType: "lecture" | "course", id: string) => {
    setActionInProgress(id);
    try {
      const res = await fetch("/api/content/manage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType,
          id,
          price: newPrice,
        }),
      });
      if (res.ok) {
        setEditingPriceId(null);
        await fetchContent();
      }
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (itemType: "lecture" | "course" | "resource", id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    setActionInProgress(id);
    try {
      const res = await fetch(`/api/content/manage?itemType=${itemType}&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchContent();
      }
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16141B]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-[32px] w-full max-w-4xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 bg-[#16141B] text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="yellow">TEACHER DASHBOARD</Badge>
              <span className="text-xs font-bold text-[#C4B5FD]">
                Content Management System
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Manage Uploaded Courses &amp; Lectures
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenUpload();
              }}
              className="px-4 py-2 rounded-full bg-[#5B32D6] hover:bg-[#4E2EC2] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              + Upload New
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Filter & Search Bar */}
        <div className="p-4 sm:p-6 border-b border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F7F7F9]">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setTab("lectures")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                tab === "lectures"
                  ? "bg-[#5B32D6] text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:text-black border border-neutral-200"
              }`}
            >
              Lectures ({lectures.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("courses")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                tab === "courses"
                  ? "bg-[#5B32D6] text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:text-black border border-neutral-200"
              }`}
            >
              Courses ({courses.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("resources")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                tab === "resources"
                  ? "bg-[#5B32D6] text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:text-black border border-neutral-200"
              }`}
            >
              Free Resources ({resources.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5B32D6]"
            />
          </div>
        </div>

        {/* Content Table / List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#5B32D6] animate-spin mx-auto" />
              <div className="text-xs text-neutral-500 font-medium">Loading LMS repository...</div>
            </div>
          ) : tab === "lectures" ? (
            lectures.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <FileVideo className="w-10 h-10 text-neutral-300 mx-auto" />
                <div className="font-bold text-[#16141B]">No Lectures Uploaded Yet</div>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Click the <strong>+ Upload New</strong> button above to upload an MP4 lecture to Cloudflare R2.
                </p>
              </div>
            ) : (
              lectures
                .filter((l) => l.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((lec) => (
                  <div
                    key={lec.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                            lec.is_published
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {lec.is_published ? "Published" : "Draft"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                            lec.access_type === "free"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-purple-100 text-[#5B32D6]"
                          }`}
                        >
                          {lec.access_type === "free" ? "Free" : "Paid"}
                        </span>
                        <span className="text-xs font-semibold text-neutral-400">
                          {lec.subject} {lec.chapter ? `· ${lec.chapter}` : ""}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[#16141B]">{lec.title}</h4>
                      <p className="text-xs text-neutral-500">
                        {lec.description ? lec.description.slice(0, 90) + "..." : "No description"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Access Badge */}
                      <span className="text-[11px] font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                        {lec.access_type === "free" ? "Free Preview" : "Batch Access"}
                      </span>

                      {/* Toggle Publish */}
                      <button
                        type="button"
                        onClick={() => handleTogglePublish("lecture", lec.id, lec.is_published)}
                        disabled={actionInProgress === lec.id}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                          lec.is_published
                            ? "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                        }`}
                        title={lec.is_published ? "Unpublish to draft" : "Publish now"}
                      >
                        {lec.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete("lecture", lec.id, lec.title)}
                        disabled={actionInProgress === lec.id}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Delete lecture"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
            )
          ) : tab === "courses" ? (
            courses.map((course) => (
              <div
                key={course.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                        course.is_published
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {course.is_published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs font-semibold text-neutral-400">{course.category}</span>
                  </div>
                  <h4 className="font-bold text-base text-[#16141B]">{course.title}</h4>
                  <p className="text-xs text-neutral-500">{course.description?.slice(0, 100)}...</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-bold">
                    {editingPriceId === course.id ? (
                      <>
                        <span>₹</span>
                        <input
                          type="number"
                          className="w-20 bg-white border border-neutral-300 rounded px-1 text-right text-xs"
                          value={newPrice}
                          onChange={(e) => setNewPrice(Number(e.target.value))}
                        />
                        <button
                          onClick={() => handleSavePrice("course", course.id)}
                          className="text-emerald-600 p-0.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span>₹{course.price}</span>
                        <button
                          onClick={() => {
                            setEditingPriceId(course.id);
                            setNewPrice(course.price);
                          }}
                          className="text-neutral-400 hover:text-[#5B32D6] p-0.5"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePublish("course", course.id, course.is_published)}
                    className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                  >
                    {course.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))
          ) : (
            resources.map((res) => (
              <div
                key={res.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 uppercase">
                      {res.file_type}
                    </span>
                    <span className="text-xs text-neutral-400 font-semibold">{res.category_label}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#16141B]">{res.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete("resource", res.id, res.title)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
