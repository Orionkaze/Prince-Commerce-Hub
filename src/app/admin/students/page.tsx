"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  Users,
  Search,
  BookOpen,
  CheckCircle2,
  XCircle,
  Shield,
  GraduationCap,
  PlusCircle,
  Loader2,
  AlertCircle,
  Eye,
  Calendar,
} from "lucide-react";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [studentDetails, setStudentDetails] = useState<any | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

  // Grant Access Form
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCourseToGrant, setSelectedCourseToGrant] = useState<string>("");
  const [grantReason, setGrantReason] = useState<string>("Manual enrollment by administrator");
  const [isSubmittingAction, setIsSubmittingAction] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
      }

      // Also fetch courses list for manual grant dropdown
      const coursesRes = await fetch("/api/admin/courses");
      if (coursesRes.ok) {
        const cData = await coursesRes.json();
        setAvailableCourses(cData.courses || []);
        if (cData.courses && cData.courses.length > 0) {
          setSelectedCourseToGrant(cData.courses[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openStudentModal = async (student: any) => {
    setSelectedStudent(student);
    setIsLoadingDetails(true);
    setActionFeedback(null);
    try {
      const res = await fetch(`/api/admin/students/${student.user_id}`);
      if (res.ok) {
        const data = await res.json();
        setStudentDetails(data);
      }
    } catch (err) {
      console.error("Failed to fetch student details:", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseToGrant || !selectedStudent) return;

    setIsSubmittingAction(true);
    try {
      const res = await fetch(`/api/admin/students/${selectedStudent.user_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grant",
          courseId: selectedCourseToGrant,
          reason: grantReason,
        }),
      });

      if (res.ok) {
        setActionFeedback("Access granted successfully!");
        // Refresh details
        const detailsRes = await fetch(`/api/admin/students/${selectedStudent.user_id}`);
        if (detailsRes.ok) {
          const data = await detailsRes.json();
          setStudentDetails(data);
        }
        await fetchStudents();
      }
    } catch (err) {
      console.error("Grant access failed:", err);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleRevokeAccess = async (courseId: string) => {
    if (!confirm("Are you sure you want to revoke access to this course for this student?")) return;

    setIsSubmittingAction(true);
    try {
      const res = await fetch(`/api/admin/students/${selectedStudent.user_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "revoke",
          courseId,
          reason: "Manually revoked by administrator",
        }),
      });

      if (res.ok) {
        setActionFeedback("Access revoked successfully.");
        const detailsRes = await fetch(`/api/admin/students/${selectedStudent.user_id}`);
        if (detailsRes.ok) {
          const data = await detailsRes.json();
          setStudentDetails(data);
        }
        await fetchStudents();
      }
    } catch (err) {
      console.error("Revoke access failed:", err);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.full_name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.user_id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Student Management"
        subtitle="View registered accounts, verify course enrollments, and manually manage student access."
      />

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F7F9] rounded-xl text-sm border border-transparent focus:border-[#5B32D6] focus:bg-white focus:outline-none transition"
          />
        </div>
        <div className="text-xs font-bold text-gray-500">
          Total Registered: <span className="text-[#16141B]">{students.length} Students</span>
        </div>
      </div>

      {/* Students Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200">
          <Loader2 className="w-8 h-8 animate-spin text-[#5B32D6] mb-3" />
          <p className="text-sm font-semibold text-gray-500">Loading student directory...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-6">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No students found</h3>
          <p className="text-xs text-gray-500 mt-1">
            Accounts registered through Google OAuth will appear in this directory automatically.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7F7F9] border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Enrolled Courses</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredStudents.map((student) => (
                  <tr key={student.user_id} className="hover:bg-gray-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#5B32D6]/10 text-[#5B32D6] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {student.full_name?.charAt(0) || student.email?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-[#16141B] truncate">
                            {student.full_name}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          student.role === "admin"
                            ? "bg-purple-100 text-[#5B32D6]"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {student.role === "admin" && <Shield className="w-3 h-3" />}
                        {student.role.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {student.enrolled_count} {student.enrolled_count === 1 ? "Course" : "Courses"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-gray-500">
                      {new Date(student.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openStudentModal(student)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5B32D6] text-xs font-bold transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Manage Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STUDENT DETAILS & ACCESS MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-[#16141B]">
                  {selectedStudent.full_name}
                </h3>
                <p className="text-xs text-gray-400">{selectedStudent.email}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-black text-xs font-bold px-3 py-1 bg-gray-100 rounded-lg"
              >
                Close
              </button>
            </div>

            {actionFeedback && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionFeedback}</span>
              </div>
            )}

            {isLoadingDetails ? (
              <div className="py-12 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#5B32D6] mx-auto mb-2" />
                <p className="text-xs text-gray-500">Loading student details...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Enrolled Courses */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Enrolled Courses &amp; Access Status
                  </h4>
                  {!studentDetails?.enrolledCourses || studentDetails.enrolledCourses.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-gray-50 text-xs text-gray-400 text-center">
                      No active course enrollments found for this student.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {studentDetails.enrolledCourses.map((enr: any) => (
                        <div
                          key={enr.courseId}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F7F9] border border-gray-100 text-xs"
                        >
                          <div>
                            <div className="font-bold text-[#16141B]">
                              {enr.courseTitle}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              Enrolled: {new Date(enr.enrolledAt).toLocaleDateString("en-IN")}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              enr.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}>
                              {enr.status.toUpperCase()}
                            </span>
                            {enr.status === "active" && (
                              <button
                                type="button"
                                onClick={() => handleRevokeAccess(enr.courseId)}
                                disabled={isSubmittingAction}
                                className="text-rose-600 hover:underline font-bold text-[11px] px-2 py-1"
                              >
                                Revoke
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Manual Grant Access Form */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                  <h4 className="text-xs font-bold text-[#16141B] flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-[#5B32D6]" />
                    Manually Grant Course Access
                  </h4>
                  <form onSubmit={handleGrantAccess} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={selectedCourseToGrant}
                        onChange={(e) => setSelectedCourseToGrant(e.target.value)}
                        className="px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#5B32D6]"
                      >
                        {availableCourses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder="Reason (e.g. Offline cash payment)"
                        value={grantReason}
                        onChange={(e) => setGrantReason(e.target.value)}
                        className="px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#5B32D6]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingAction}
                      className="w-full py-2 px-4 rounded-xl bg-[#5B32D6] text-white text-xs font-bold hover:bg-[#4A23C2] transition disabled:opacity-50"
                    >
                      {isSubmittingAction ? "Processing..." : "Grant Student Access & Log"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
