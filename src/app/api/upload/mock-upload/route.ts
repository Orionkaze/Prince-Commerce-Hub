import { NextRequest, NextResponse } from "next/server";

// Fallback PUT handler for local development testing when R2 credentials aren't set
export async function PUT(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key") || "mock-file";
  return NextResponse.json({
    success: true,
    message: `File uploaded successfully to mock storage for key: ${key}`,
    key,
  });
}
