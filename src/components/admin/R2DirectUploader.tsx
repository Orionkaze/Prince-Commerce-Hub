"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X, RefreshCw, FileText, Video, Image as ImageIcon } from "lucide-react";

interface R2DirectUploaderProps {
  label: string;
  accept: string;
  fileCategory: "video" | "pdf" | "thumbnail" | "assignment" | "other";
  courseId?: string;
  moduleId?: string;
  lectureId?: string;
  currentKey?: string | null;
  onUploadSuccess: (key: string) => void;
  maxSizeMB?: number;
}

export function R2DirectUploader({
  label,
  accept,
  fileCategory,
  courseId,
  moduleId,
  lectureId,
  currentKey,
  onUploadSuccess,
  maxSizeMB = 500, // up to 500MB
}: R2DirectUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedKey, setUploadedKey] = useState<string | null>(currentKey || null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File exceeds maximum allowed size of ${maxSizeMB}MB.`);
      return;
    }
    setFile(selectedFile);
    startDirectUpload(selectedFile);
  };

  const startDirectUpload = async (fileToUpload: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // 1. Request presigned PUT URL from server
      const presignRes = await fetch("/api/uploads/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: fileToUpload.name,
          contentType: fileToUpload.type || "application/octet-stream",
          courseId,
          moduleId,
          lectureId,
        }),
      });

      if (!presignRes.ok) {
        const errData = await presignRes.json();
        throw new Error(errData.error || "Failed to initialize R2 upload");
      }

      const { uploadUrl, key } = await presignRes.json();

      // 2. Direct browser-to-R2 upload with XMLHttpRequest for accurate progress tracking
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100);
          setIsUploading(false);
          setUploadedKey(key);
          onUploadSuccess(key);
        } else {
          setIsUploading(false);
          setError(`Upload failed with status code ${xhr.status}.`);
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        setError("Network error occurred during direct Cloudflare R2 upload.");
      };

      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", fileToUpload.type || "application/octet-stream");
      xhr.send(fileToUpload);
    } catch (err: any) {
      console.error("Direct upload error:", err);
      setIsUploading(false);
      setError(err?.message || "Failed to upload file to Cloudflare R2.");
    }
  };

  const handleCancel = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
    }
    setIsUploading(false);
    setProgress(0);
    setFile(null);
  };

  const getCategoryIcon = () => {
    switch (fileCategory) {
      case "video":
        return <Video className="w-5 h-5 text-purple-600" />;
      case "thumbnail":
        return <ImageIcon className="w-5 h-5 text-amber-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          {getCategoryIcon()}
          <span>{label}</span>
        </label>
        {uploadedKey && !isUploading && (
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Uploaded to R2
          </span>
        )}
      </div>

      {/* Dropzone Container */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => {
          if (!isUploading) {
            fileInputRef.current?.click();
          }
        }}
        className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
          isDragOver
            ? "border-[#5B32D6] bg-purple-50/60"
            : uploadedKey
            ? "border-emerald-200 bg-emerald-50/30 hover:border-emerald-300"
            : "border-gray-300 bg-white hover:border-[#5B32D6]/60 hover:bg-gray-50/60"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-3 py-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-gray-700 truncate max-w-[200px]">
                {file?.name || "Uploading..."}
              </span>
              <span className="text-[#5B32D6]">{progress}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#5B32D6] to-[#7B52F6] h-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin text-[#5B32D6]" />
                Uploading directly to Cloudflare R2...
              </span>
              <button
                type="button"
                onClick={handleCancel}
                className="text-rose-600 hover:underline font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : uploadedKey ? (
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3 text-left min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-800 truncate">
                  {file?.name || uploadedKey.split("/").pop()}
                </div>
                <div className="text-[10px] font-mono text-gray-400 truncate">
                  {uploadedKey}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="text-xs font-bold text-[#5B32D6] hover:underline px-3 py-1 bg-white rounded-lg border border-gray-200 shadow-sm shrink-0"
            >
              Replace
            </button>
          </div>
        ) : (
          <div className="space-y-1.5 py-1">
            <UploadCloud className="w-8 h-8 text-gray-400 mx-auto" />
            <div className="text-xs font-bold text-gray-700">
              Click to select or drag and drop
            </div>
            <p className="text-[11px] text-gray-400">
              {accept} (up to {maxSizeMB}MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
