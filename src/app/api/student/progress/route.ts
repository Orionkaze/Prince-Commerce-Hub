import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/roles";
import { saveLectureProgress, getLectureProgress } from "@/services/progress";


export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const lectureId = searchParams.get("lectureId");
    if (!lectureId) {
      return NextResponse.json({ error: "lectureId required" }, { status: 400 });
    }

    const progress = await getLectureProgress(user.id, lectureId);
    return NextResponse.json({ success: true, progress });
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_") || error?.digest === "HANGING_PROMISE_REJECTION") {
      throw error;
    }
    return NextResponse.json(
      { error: error?.message || "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const { lectureId, lastPositionSeconds, completed } = body;

    if (!lectureId) {
      return NextResponse.json({ error: "lectureId required" }, { status: 400 });
    }

    const progress = await saveLectureProgress({
      studentId: user.id,
      lectureId,
      lastPositionSeconds: Number(lastPositionSeconds) || 0,
      completed,
    });

    return NextResponse.json({ success: true, progress });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to save progress" },
      { status: 500 }
    );
  }
}
