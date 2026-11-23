"use client";

import React, { useState, useEffect, useRef, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CourseRecord, CourseModuleRecord, LectureRecord } from "@/types/lms";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  BookOpen,
  FileText,
  Video,
  Award,
  Sparkles,
  Loader2,
  AlertCircle,
  Menu,
  X,
  Settings,
  Edit,
} from "lucide-react";

function CourseLearningContent({
  params,
}: {
  params: Promise<{ courseId: string; lectureId: string }>;
}) {
  const resolvedParams = use(params);
  const { courseId, lectureId: rawLectureId } = resolvedParams;

  const router = useRouter();
  const { user, isAdmin, isLoading: isAuthLoading } = useAuth();

  const [course, setCourse] = useState<CourseRecord | null>(null);
  const [currentLecture, setCurrentLecture] = useState<LectureRecord | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isLoadingStream, setIsLoadingStream] = useState<boolean>(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isAccessDenied, setIsAccessDenied] = useState<boolean>(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string>("");
  const [isCurriculumLoading, setIsCurriculumLoading] = useState<boolean>(true);

  // Curriculum & Progress
  const [completedLectureIds, setCompletedLectureIds] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [allLecturesFlat, setAllLecturesFlat] = useState<LectureRecord[]>([]);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);

  // Video Player Controls State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [initialSeekDone, setInitialSeekDone] = useState<boolean>(false);
  const lastSavedTimeRef = useRef<number>(0);

  // Active Tab below video
  const [activeTab, setActiveTab] = useState<"overview" | "resources">("overview");

  // Load Course and Curriculum
  useEffect(() => {
    async function loadCourseCurriculum() {
      setIsCurriculumLoading(true);
      try {
        const res = await fetch(`/api/student/courses/${courseId}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          if (res.status === 401) {
            router.push(`/login?redirectTo=/learn/${courseId}/${rawLectureId || "first"}`);
            return;
          }
          if (res.status === 403 || errData.requiresPurchase) {
            setIsAccessDenied(true);
            setAccessDeniedMessage(
              errData.error || "You do not have active enrollment in this course. Please purchase the course to access lectures."
            );
            return;
          }
          setStreamError(errData.error || "Failed to load course details.");
          return;
        }

        const data = await res.json();
        const c: CourseRecord = data.course;
        setCourse(c);
        setIsAccessDenied(false);

        // Flatten lectures
        const flat: LectureRecord[] = [];
        const exp: Record<string, boolean> = {};

        c.modules?.forEach((m) => {
          exp[m.id] = true;
          m.lectures?.forEach((l) => flat.push(l));
        });

        setAllLecturesFlat(flat);
        setExpandedModules(exp);

        // Resolve target lecture
        let target: LectureRecord | null = null;
        if (rawLectureId === "first" || !rawLectureId) {
          target = flat[0] || null;
        } else {
          target = flat.find((l) => l.id === rawLectureId) || flat[0] || null;
        }

        if (target) {
          setCurrentLecture(target);
        }
      } catch (err) {
        console.error("Failed to load curriculum:", err);
      } finally {
        setIsCurriculumLoading(false);
      }
    }

    loadCourseCurriculum();
  }, [courseId, rawLectureId, router]);

  // Load student's completed lectures and saved progress
  useEffect(() => {
    async function loadProgress() {
      if (!user) return;
      try {
        const pRes = await fetch("/api/student/dashboard");
        if (pRes.ok) {
          const pData = await pRes.json();
          const completed = new Set<string>();
          pData.recentProgress?.forEach((prog: any) => {
            if (prog.completed) completed.add(prog.lecture_id);
          });
          setCompletedLectureIds(completed);
        }
      } catch {
        // ignore
      }
    }

    loadProgress();
  }, [user]);

  // Fetch secure streaming playback URL when current lecture changes
  useEffect(() => {
    if (!currentLecture) return;

    let isMounted = true;
    setIsLoadingStream(true);
    setStreamError(null);
    setStreamUrl(null);
    setInitialSeekDone(false);

    async function fetchStream() {
      try {
        const res = await fetch(`/api/lectures/${currentLecture!.id}/stream`);
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok) {
          if (data.playbackUrl) {
            setStreamUrl(data.playbackUrl);
          } else {
            setStreamError(data.message || "Video file is currently being prepared for streaming.");
          }
        } else {
          setStreamError(data.error || "Enrollment is required to watch this lecture.");
        }
      } catch (err: any) {
        if (isMounted) {
          setStreamError(err?.message || "Failed to load video stream.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingStream(false);
        }
      }
    }

    fetchStream();

    // Fetch saved playback position
    async function fetchSavedPosition() {
      if (!user) return;
      try {
        const progRes = await fetch(`/api/student/progress?lectureId=${currentLecture!.id}`);
        if (progRes.ok) {
          const pData = await progRes.json();
          if (pData.progress?.last_position_seconds && pData.progress.last_position_seconds > 5) {
            lastSavedTimeRef.current = pData.progress.last_position_seconds;
          }
        }
      } catch {
        // ignore
      }
    }

    fetchSavedPosition();

    return () => {
      isMounted = false;
    };
  }, [currentLecture, user]);

  // Handle Video Metadata Loaded: Resume from saved position
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      if (!initialSeekDone && lastSavedTimeRef.current > 0) {
        if (lastSavedTimeRef.current < (videoRef.current.duration - 10)) {
          videoRef.current.currentTime = lastSavedTimeRef.current;
        }
        setInitialSeekDone(true);
      }
    }
  };

  // Throttled Progress Persistence
  const persistProgress = async (pos: number, isFinished: boolean = false) => {
    if (!user || !currentLecture) return;
    try {
      await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lectureId: currentLecture.id,
          lastPositionSeconds: Math.round(pos),
          completed: isFinished || completedLectureIds.has(currentLecture.id),
        }),
      });
    } catch {
      // background update fail is non-fatal
    }
  };

  // Time update listener
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const now = videoRef.current.currentTime;
    setCurrentTime(now);

    // Persist every 12 seconds
    if (Math.abs(now - lastSavedTimeRef.current) > 12) {
      lastSavedTimeRef.current = now;
      persistProgress(now);
    }
  };

  // On Lecture Finished
  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (!currentLecture) return;

    // Mark as completed
    setCompletedLectureIds((prev) => new Set([...prev, currentLecture.id]));
    persistProgress(currentTime, true);

    // Check if course is complete
    const updatedCompleted = new Set([...completedLectureIds, currentLecture.id]);
    if (allLecturesFlat.length > 0 && updatedCompleted.size >= allLecturesFlat.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  // Manual toggle completion
  const handleToggleCompleted = async () => {
    if (!currentLecture) return;
    const isCurrentlyCompleted = completedLectureIds.has(currentLecture.id);

    const newSet = new Set(completedLectureIds);
    if (isCurrentlyCompleted) {
      newSet.delete(currentLecture.id);
    } else {
      newSet.add(currentLecture.id);
      if (allLecturesFlat.length > 0 && newSet.size >= allLecturesFlat.length) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }

    setCompletedLectureIds(newSet);
    await persistProgress(currentTime, !isCurrentlyCompleted);
  };

  // Navigation: Previous & Next Lectures
  const currentIdx = allLecturesFlat.findIndex((l) => l.id === currentLecture?.id);
  const prevLecture = currentIdx > 0 ? allLecturesFlat[currentIdx - 1] : null;
  const nextLecture = currentIdx < allLecturesFlat.length - 1 ? allLecturesFlat[currentIdx + 1] : null;

  const navigateToLecture = (lecture: LectureRecord) => {
    if (videoRef.current) {
      persistProgress(videoRef.current.currentTime);
    }
    setCurrentLecture(lecture);
    setIsSidebarOpenMobile(false);
    router.replace(`/learn/${courseId}/${lecture.id}`);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const courseCompletionPercent =
    allLecturesFlat.length > 0
      ? Math.round((completedLectureIds.size / allLecturesFlat.length) * 100)
      : 0;

  if (isCurriculumLoading) {
    return (
      <div className="min-h-screen bg-[#16141B] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#5B32D6] mb-4" />
        <p className="text-sm font-semibold text-gray-400">Loading course curriculum...</p>
      </div>
    );
  }

  if (isAccessDenied) {
    return (
      <div className="min-h-screen bg-[#16141B] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-[#1D1136] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-[#FDE047] flex items-center justify-center mx-auto border border-[#FDE047]/20">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-[#FDE047]">
              Enrollment Required
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Course Access Locked
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              {accessDeniedMessage || "You do not have an active enrollment for this course. Please purchase this course or return to your enrolled courses."}
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href={`/courses/${courseId}`}
              className="py-3 px-5 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white text-xs font-bold transition shadow-lg shadow-[#5B32D6]/30 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#FDE047]" />
              <span>View Course Details &amp; Purchase</span>
            </Link>
            <Link
              href="/dashboard"
              className="py-2.5 px-5 rounded-full border border-white/10 text-gray-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#16141B] text-white flex flex-col font-sans select-none">
      {/* Top Learning Navigation Bar */}
      <header className="h-16 bg-[#1D1136] border-b border-[#2A2634] px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="font-extrabold text-sm sm:text-base text-white truncate max-w-sm sm:max-w-md">
              {course?.title || "Accountancy Learning"}
            </h1>
            <p className="text-[11px] text-[#FDE047] font-semibold truncate">
              {currentLecture?.title || "Lecture"}
            </p>
          </div>
        </div>

        {/* Progress & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              href={`/admin/courses/${courseId}`}
              className="px-3.5 py-1.5 rounded-xl bg-[#5B32D6] hover:bg-[#4E2EC2] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              title="Edit lectures, upload videos, and organize modules in Admin Dashboard"
            >
              <Settings className="w-3.5 h-3.5 text-[#FDE047]" />
              <span className="hidden sm:inline">Manage in Admin</span>
            </Link>
          )}

          <div className="hidden sm:flex items-center gap-3 text-xs font-bold text-gray-300">
            <span>Progress: {courseCompletionPercent}%</span>
            <div className="w-24 bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#5B32D6] to-[#FDE047] h-full rounded-full transition-all"
                style={{ width: `${courseCompletionPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
            className="lg:hidden p-2 rounded-xl bg-white/10 text-white"
          >
            {isSidebarOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Learning Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Video Area & Lecture Content */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Large Video Player Area */}
            <div className="bg-black relative aspect-video max-h-[72vh] w-full flex items-center justify-center overflow-hidden">
              {isLoadingStream ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-[#5B32D6] mb-3" />
                  <p className="text-xs font-semibold text-gray-400">
                    Establishing secure Cloudflare R2 video stream...
                  </p>
                </div>
              ) : streamError ? (
                <div className="max-w-md p-6 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="text-sm font-bold text-white">Stream Notice</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{streamError}</p>
                  <Link
                    href={`/courses/${course?.slug || courseId}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5B32D6] text-white text-xs font-bold hover:bg-[#4A23C2] transition mt-2"
                  >
                    View Enrollment Options
                  </Link>
                </div>
              ) : streamUrl ? (
                <video
                  ref={videoRef}
                  src={streamUrl}
                  controls
                  playsInline
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => {
                    setIsPlaying(false);
                    if (videoRef.current) persistProgress(videoRef.current.currentTime);
                  }}
                  className="w-full h-full object-contain"
                />
              ) : null}
            </div>

            {/* Below Video Bar: Lecture Metadata & Navigation */}
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2634]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50">
                      {currentLecture?.chapter || "Accountancy Chapter"}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold">
                      Duration: {currentLecture?.duration || "45 mins"}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {currentLecture?.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleToggleCompleted}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition shadow-sm ${
                      completedLectureIds.has(currentLecture?.id || "")
                        ? "bg-emerald-600 text-white"
                        : "bg-white/10 hover:bg-white/20 text-gray-300"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {completedLectureIds.has(currentLecture?.id || "")
                        ? "Completed"
                        : "Mark as Completed"}
                    </span>
                  </button>

                  <button
                    onClick={() => prevLecture && navigateToLecture(prevLecture)}
                    disabled={!prevLecture}
                    title="Previous Lecture"
                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => nextLecture && navigateToLecture(nextLecture)}
                    disabled={!nextLecture}
                    title="Next Lecture"
                    className="p-2.5 rounded-full bg-[#5B32D6] hover:bg-[#4A23C2] text-white disabled:opacity-30 disabled:cursor-not-allowed transition shadow-md"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tabs: Lecture Overview & Resources */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-[#2A2634]">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`pb-3 px-2 text-xs font-bold border-b-2 transition ${
                      activeTab === "overview"
                        ? "border-[#FDE047] text-[#FDE047]"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    Lecture Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("resources")}
                    className={`pb-3 px-2 text-xs font-bold border-b-2 transition ${
                      activeTab === "resources"
                        ? "border-[#FDE047] text-[#FDE047]"
                        : "border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    Study Materials &amp; PDFs
                  </button>
                </div>

                {activeTab === "overview" ? (
                  <div className="space-y-3 text-sm text-gray-300 leading-relaxed bg-[#1D1136] rounded-2xl p-5 border border-[#2A2634]">
                    <p>
                      {currentLecture?.description ||
                        "Comprehensive accountancy session focusing on conceptual clarity, ledger balance formats, and standard CBSE board examination numerical problem solving."}
                    </p>
                    <div className="pt-2 text-xs text-gray-400 font-semibold flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
                      <span>Led by Parvesh Kumar (Prime Commerce Hub Founder &amp; Educator)</span>
                    </div>

                    {isAdmin && (
                      <div className="pt-3 border-t border-[#2A2634] flex items-center justify-between">
                        <span className="text-xs text-purple-300 font-semibold flex items-center gap-1.5">
                          <Settings className="w-3.5 h-3.5 text-[#FDE047]" />
                          Admin Mode Active
                        </span>
                        <Link
                          href={`/admin/courses/${courseId}`}
                          className="px-3.5 py-1.5 rounded-xl bg-[#5B32D6] hover:bg-[#4E2EC2] text-white text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit This Lecture / Delete in Admin</span>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 bg-[#1D1136] rounded-2xl p-5 border border-[#2A2634]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Downloadable Resources
                    </h3>
                    {currentLecture?.resources && currentLecture.resources.length > 0 ? (
                      <div className="space-y-2">
                        {currentLecture.resources.map((res) => (
                          <div
                            key={res.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                              <span className="text-xs font-bold truncate">{res.title}</span>
                            </div>
                            <a
                              href={`/api/resources/${res.id}/download`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#5B32D6] text-white text-xs font-bold hover:bg-[#4A23C2] transition shrink-0"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download PDF</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 py-4 text-center">
                        Supplementary formula sheets and notes for this lecture will be available here.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Collapsible Curriculum Sidebar */}
        <aside
          className={`w-80 shrink-0 bg-[#1D1136] border-l border-[#2A2634] flex flex-col h-full z-30 transition-transform lg:translate-x-0 ${
            isSidebarOpenMobile
              ? "fixed inset-y-16 right-0 translate-x-0 shadow-2xl"
              : "fixed inset-y-16 right-0 translate-x-full lg:static"
          }`}
        >
          <div className="p-4 border-b border-[#2A2634] flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#FDE047]" />
              Course Curriculum
            </h3>
            <span className="text-xs font-bold text-gray-400">
              {completedLectureIds.size} / {allLecturesFlat.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#2A2634]">
            {course?.modules?.map((module, mIdx) => {
              const isExpanded = expandedModules[module.id];
              const lectures = module.lectures || [];

              return (
                <div key={module.id} className="bg-transparent">
                  <button
                    onClick={() =>
                      setExpandedModules((prev) => ({
                        ...prev,
                        [module.id]: !prev[module.id],
                      }))
                    }
                    className="w-full p-3.5 text-left flex items-center justify-between hover:bg-white/5 transition"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-[10px] font-bold uppercase text-[#FDE047]">
                        Module {mIdx + 1}
                      </div>
                      <div className="font-bold text-xs text-white truncate">
                        {module.title}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="bg-[#16141B]/60 divide-y divide-white/5">
                      {lectures.map((lecture) => {
                        const isActive = currentLecture?.id === lecture.id;
                        const isDone = completedLectureIds.has(lecture.id);

                        return (
                          <button
                            key={lecture.id}
                            onClick={() => navigateToLecture(lecture)}
                            className={`w-full p-3 text-left flex items-start gap-2.5 transition ${
                              isActive
                                ? "bg-[#5B32D6]/30 border-l-4 border-[#FDE047] text-white"
                                : "hover:bg-white/5 text-gray-300"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : isActive ? (
                                <Play className="w-4 h-4 text-[#FDE047] fill-current" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-gray-600" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div
                                className={`text-xs font-semibold line-clamp-2 ${
                                  isActive ? "text-white font-bold" : "text-gray-300"
                                }`}
                              >
                                {lecture.title}
                              </div>
                              <div className="text-[10px] text-gray-500 mt-0.5">
                                {lecture.duration || "45 mins"}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function CourseLearningPage(props: {
  params: Promise<{ courseId: string; lectureId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#16141B] flex flex-col items-center justify-center text-white">
          <Loader2 className="w-10 h-10 animate-spin text-[#5B32D6] mb-4" />
          <p className="text-sm font-semibold text-gray-400">Loading lecture experience...</p>
        </div>
      }
    >
      <CourseLearningContent {...props} />
    </Suspense>
  );
}
