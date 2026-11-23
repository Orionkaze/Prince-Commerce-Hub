import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/roles";
import { getStudentDashboardData } from "@/services/progress";


export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const data = await getStudentDashboardData(user.id);
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_") || error?.digest === "HANGING_PROMISE_REJECTION") {
      throw error;
    }
    console.error("Dashboard data error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
