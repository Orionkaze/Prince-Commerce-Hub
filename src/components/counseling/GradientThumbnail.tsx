import React from "react";

interface GradientThumbnailProps {
  className?: string;
  iconSize?: "sm" | "md" | "lg";
}

export function GradientThumbnail({
  className = "h-52 sm:h-56",
  iconSize = "md",
}: GradientThumbnailProps) {
  const circleDimensions =
    iconSize === "lg" ? "w-20 h-20" : iconSize === "sm" ? "w-12 h-12" : "w-16 h-16";
  const iconDimensions =
    iconSize === "lg" ? "w-9 h-9" : iconSize === "sm" ? "w-6 h-6" : "w-7 h-7";

  return (
    <div
      className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center shadow-inner transition-transform duration-500 ${className}`}
      style={{
        background:
          "radial-gradient(circle at 18% 88%, #E58FD4 0%, transparent 48%), linear-gradient(135deg, #C9D6FF 0%, #6B4BFF 52%, #5BB8FF 100%)",
      }}
    >
      {/* Translucent center white circle with purple teacher at board icon */}
      <div
        className={`${circleDimensions} rounded-full bg-white/75 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/60`}
      >
        <svg
          className={`${iconDimensions} text-[#6B4BFF] fill-current`}
          viewBox="0 0 24 24"
        >
          {/* Teacher at whiteboard glyph matching the uploaded screenshots */}
          <path d="M4 3h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v8h14V5H5zm7 11h2v3h-2v-3zm-6 3h14v2H6v-2z" />
          <circle cx="8" cy="8.5" r="1.5" />
          <path d="M11 11H5.5a2.5 2.5 0 0 1 5 0z" />
          <path d="M13 7h5v1.5h-5zm0 2.5h3.5v1.5H13z" />
        </svg>
      </div>
    </div>
  );
}
