/**
 * YouTube-style duration and thumbnail formatting utilities
 */

export function formatDuration(duration: string | number | null | undefined): string {
  if (!duration) return "45:00";
  if (typeof duration === "number") {
    const totalSec = Math.round(duration);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hrs > 0) {
      return `${hrs}:${remMins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  const str = String(duration).trim();
  // If format is MM:SS or H:MM:SS
  if (/^\d+:\d{2}(:\d{2})?$/.test(str)) {
    return str;
  }

  // If format is like "45 mins" or "45 min" or "45m"
  const matchMins = str.match(/(\d+)\s*(?:min|mins|m)/i);
  if (matchMins) {
    const mins = parseInt(matchMins[1], 10);
    return `${mins}:00`;
  }

  return str;
}

export function getThumbnailUrl(rawKey: string | null | undefined): string | null {
  if (!rawKey) return null;
  if (
    rawKey.startsWith("http://") ||
    rawKey.startsWith("https://") ||
    rawKey.startsWith("/") ||
    rawKey.startsWith("data:")
  ) {
    return rawKey;
  }
  return `/api/storage/thumbnail?key=${encodeURIComponent(rawKey)}`;
}
