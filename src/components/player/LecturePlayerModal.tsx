"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Lock,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
  BookOpen,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LectureRecord } from "@/types/lms";

interface LecturePlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: LectureRecord | null;
  onInitiatePurchase?: (lecture: LectureRecord) => void;
}

export function LecturePlayerModal({
  isOpen,
  onClose,
  lecture,
  onInitiatePurchase,
}: LecturePlayerModalProps) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !lecture) return;

    setIsLoading(true);
    setAccessDenied(false);
    setErrorMessage(null);
    setStreamUrl(null);

    const loadAccess = async () => {
      try {
        const res = await fetch(`/api/content/access?type=lecture&id=${lecture.id}`);
        const data = await res.json();

        if (res.status === 403 || !data.allowed) {
          setAccessDenied(true);
          setErrorMessage(data.message || "This premium lecture requires enrollment.");
        } else if (data.streamUrl) {
          setStreamUrl(data.streamUrl);
          setDownloadUrl(data.downloadUrl || data.streamUrl);
        } else {
          setErrorMessage("Could not load video stream.");
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to connect to media server.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAccess();
  }, [isOpen, lecture]);

  if (!isOpen || !lecture) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#16141B]/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-[32px] w-full max-w-4xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col"
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-[#16141B] text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="yellow">
                {lecture.access_type === "free" ? "FREE LECTURE" : "PREMIUM CLASS"}
              </Badge>
              <span className="text-xs font-bold text-[#C4B5FD]">
                {lecture.subject} {lecture.chapter ? `· ${lecture.chapter}` : ""}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white">{lecture.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player or Locked Overlay */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="text-center space-y-3 text-white">
              <Loader2 className="w-10 h-10 text-[#FDE047] animate-spin mx-auto" />
              <div className="text-xs text-white/70">Connecting to Cloudflare R2...</div>
            </div>
          ) : accessDenied ? (
            <div className="p-8 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-white/10 text-[#FDE047] flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-extrabold text-white">
                Content Locked
              </h4>
              <p className="text-sm text-white/80 leading-relaxed">
                {errorMessage || "This premium lecture requires an active purchase or enrollment in the course."}
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Button
                  variant="purple"
                  size="md"
                  onClick={() => {
                    onClose();
                    window.location.href = `/courses/${lecture.course_id || "class-11"}`;
                  }}
                >
                  Enroll in Complete Batch
                </Button>
                <Button variant="white" size="md" onClick={onClose}>
                  Browse Batches
                </Button>
              </div>
            </div>
          ) : streamUrl ? (
            <video
              src={streamUrl}
              controls
              autoPlay
              controlsList="nodownload"
              className="w-full h-full object-contain"
            >
              Your browser does not support HTML5 video streaming.
            </video>
          ) : (
            <div className="text-center space-y-2 text-white/80 p-8">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <div>Video stream could not be loaded. Please try again.</div>
            </div>
          )}
        </div>

        {/* Bottom Details & Lecture Notes */}
        <div className="p-6 sm:p-8 space-y-4 bg-white text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                Instructor
              </div>
              <div className="font-extrabold text-base text-[#16141B]">
                {lecture.teacher_name} (30+ Years Exp)
              </div>
            </div>
            {downloadUrl && !accessDenied && (
              <a
                href={downloadUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-700 transition-colors"
              >
                <Download className="w-4 h-4 text-[#5B32D6]" />
                <span>Save Offline Stream</span>
              </a>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Lecture Notes &amp; Concept Overview
            </div>
            <p className="text-neutral-600 leading-relaxed">
              {lecture.description ||
                "In this session, Parvesh Sir breaks down fundamental journal entries, ledger formats, and time-saving board exam adjustments with full working note presentation."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
