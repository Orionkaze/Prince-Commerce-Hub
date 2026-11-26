import { LiveClassStatus } from "@/types/lms";

/**
 * Validates whether a given string is a valid Google Meet link.
 */
export function isValidGoogleMeetUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url.trim());
    return (
      (parsed.hostname === "meet.google.com" || parsed.hostname.endsWith(".meet.google.com")) &&
      parsed.pathname.length > 1
    );
  } catch {
    return false;
  }
}

/**
 * Helper to compute the dynamic status of a live class according to Asia/Kolkata (IST).
 * If admin explicitly marked "Cancelled", keep it "Cancelled".
 * If admin explicitly selected "Completed" or "Live Now" in manual mode, that can also be respected,
 * but dynamically it checks whether current time is before, during, or after the class window.
 */
export function computeLiveClassStatus(
  status: LiveClassStatus,
  scheduledDate: string,
  startTime: string,
  endTime: string
): LiveClassStatus {
  if (status === "Cancelled") {
    return "Cancelled";
  }

  try {
    // Current time in Asia/Kolkata
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    // Current UTC time + IST offset
    const istNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);

    // Format YYYY-MM-DD
    const pad = (n: number) => n.toString().padStart(2, "0");
    const todayStr = `${istNow.getFullYear()}-${pad(istNow.getMonth() + 1)}-${pad(istNow.getDate())}`;

    // Normalize start and end times (HH:mm)
    const normStart = startTime.slice(0, 5);
    const normEnd = endTime.slice(0, 5);

    const currentTimeStr = `${pad(istNow.getHours())}:${pad(istNow.getMinutes())}`;

    if (scheduledDate < todayStr) {
      return "Completed";
    }

    if (scheduledDate > todayStr) {
      return "Upcoming";
    }

    // scheduledDate === todayStr
    if (currentTimeStr < normStart) {
      return "Upcoming";
    } else if (currentTimeStr >= normStart && currentTimeStr <= normEnd) {
      return "Live Now";
    } else {
      return "Completed";
    }
  } catch {
    return status || "Upcoming";
  }
}

/**
 * Format a 24-hr time string "18:00" to "6:00 PM"
 */
export function formatTime12Hr(timeStr: string): string {
  if (!timeStr) return "";
  try {
    const parts = timeStr.split(":");
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1] || "00";
    if (isNaN(hours)) return timeStr;

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  } catch {
    return timeStr;
  }
}

/**
 * Format date string "YYYY-MM-DD" to readable string "Friday, 28 Nov 2026"
 */
export function formatDateReadable(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
