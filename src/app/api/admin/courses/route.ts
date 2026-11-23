import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { getCourses, createCourse } from "@/services/courses";


export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = req.nextUrl;
    const classLevel = searchParams.get("classLevel") || undefined;
    const courses = await getCourses({ classLevel });

    return NextResponse.json({ courses });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    if (!body.title || !body.price) {
      return NextResponse.json(
        { error: "Course title and price are required." },
        { status: 400 }
      );
    }

    const courseId = body.id || body.title.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    const course = await createCourse({
      ...body,
      id: courseId,
    });

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create course" },
      { status: 500 }
    );
  }
}
