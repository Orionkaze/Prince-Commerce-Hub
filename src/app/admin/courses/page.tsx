"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CourseRecord } from "@/types/lms";
import {
  PlusCircle,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  FileVideo,
  ExternalLink,
  Edit,
  Trash2,
  Archive,
  Loader2,
} from "lucide-react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleTogglePublish = async (course: CourseRecord) => {
    const isCurrentlyPublished = course.status === "PUBLISHED" || course.is_published;
    const newStatus = isCurrentlyPublished ? "DRAFT" : "PUBLISHED";

    setActionLoading(course.id);
    try {
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          is_published: newStatus === "PUBLISHED",
        }),
      });

      if (res.ok) {
        await fetchCourses();
      }
    } catch (err) {
      console.error("Toggle publish failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchiveCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to archive this course? It will be hidden from the public catalog while preserving existing student enrollments.")) {
      return;
    }

    setActionLoading(courseId);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchCourses();
      }
    } catch (err) {
      console.error("Archive course failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered course list
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());

    const matchesClass =
      selectedClass === "all" ||
      c.class_level?.toLowerCase() === selectedClass.toLowerCase() ||
      c.category?.toLowerCase().includes(selectedClass.toLowerCase());

    const currentStatus = c.status || (c.is_published ? "PUBLISHED" : "DRAFT");
    const matchesStatus =
      selectedStatus === "all" || currentStatus === selectedStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader
        title="Batch Management"
        subtitle="Manage official Class 11 and Class 12 curricula, chapters, video lectures, and publication statuses."
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by course title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F7F9] rounded-xl text-sm border border-transparent focus:border-[#5B32D6] focus:bg-white focus:outline-none transition"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Class Level Selector */}
          <div className="flex rounded-xl bg-[#F7F7F9] p-1 border border-gray-100 text-xs font-bold">
            <button
              onClick={() => setSelectedClass("all")}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedClass === "all"
                  ? "bg-white text-[#5B32D6] shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All Classes
            </button>
            <button
              onClick={() => setSelectedClass("Class 11")}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedClass === "Class 11"
                  ? "bg-white text-[#5B32D6] shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Class 11
            </button>
            <button
              onClick={() => setSelectedClass("Class 12")}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedClass === "Class 12"
                  ? "bg-white text-[#5B32D6] shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Class 12
            </button>
          </div>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-bold bg-[#F7F7F9] text-gray-700 py-2 px-3 rounded-xl border border-gray-100 focus:outline-none focus:border-[#5B32D6]"
          >
            <option value="all">All Statuses</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Drafts</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Courses List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200">
          <Loader2 className="w-8 h-8 animate-spin text-[#5B32D6] mb-3" />
          <p className="text-sm font-semibold text-gray-500">Loading courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-6">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No courses match your filter</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or create a new course using the button above.
          </p>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-[#5B32D6] text-white text-xs font-bold hover:bg-[#4A23C2] transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Create Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isPublished = course.status === "PUBLISHED" || course.is_published;
            const isArchived = course.status === "ARCHIVED";

            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-[#5B32D6]/40 transition flex flex-col"
              >
                {/* Course Thumbnail or Banner */}
                <div className="relative h-44 w-full bg-gradient-to-tr from-[#1D1136] to-[#5B32D6] overflow-hidden">
                  {course.thumbnail_object_key || course.thumbnail_key ? (
                    <img
                      src={course.thumbnail_object_key || course.thumbnail_key || ""}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                      <BookOpen className="w-12 h-12 text-white/20" />
                    </div>
                  )}

                  {/* Status Badges Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#16141B]/80 text-[#FDE047] backdrop-blur-sm">
                      {course.class_level || course.category || "Class 12"}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                        isPublished
                          ? "bg-emerald-500 text-white"
                          : isArchived
                          ? "bg-gray-700 text-gray-200"
                          : "bg-amber-400 text-[#16141B]"
                      }`}
                    >
                      {course.status || (isPublished ? "PUBLISHED" : "DRAFT")}
                    </span>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#16141B] line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Stats pills */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs font-semibold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#5B32D6]" />
                        <span>{course.modules_count || 0} Modules</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileVideo className="w-3.5 h-3.5 text-purple-600" />
                        <span>{course.lectures_count || 0} Lectures</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Footer */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">
                        Enrollment Fee
                      </div>
                      <div className="text-lg font-black text-[#16141B]">
                        ₹{Number(course.price).toLocaleString("en-IN")}
                        {course.original_price && course.original_price > course.price && (
                          <span className="text-xs text-gray-400 line-through font-normal ml-1.5">
                            ₹{Number(course.original_price).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        disabled={actionLoading === course.id}
                        title={isPublished ? "Unpublish to Draft" : "Publish Course"}
                        className="p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition disabled:opacity-50"
                      >
                        {actionLoading === course.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#5B32D6]" />
                        ) : isPublished ? (
                          <Clock className="w-4 h-4 text-amber-600" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>

                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5B32D6] hover:bg-[#4A23C2] text-white text-xs font-bold shadow-sm transition"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Manage Batch</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
