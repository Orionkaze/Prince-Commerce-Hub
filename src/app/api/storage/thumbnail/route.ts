import { NextRequest, NextResponse } from "next/server";
import { createPresignedPlaybackUrl } from "@/lib/storage/r2";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
  }

  // If already a full URL or absolute path
  if (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("/")) {
    return NextResponse.redirect(new URL(key, req.url));
  }

  try {
    const signedUrl = await createPresignedPlaybackUrl({
      key,
      expiresInSeconds: 86400, // 24 hours
    });

    return NextResponse.redirect(signedUrl, {
      status: 307,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err: any) {
    console.error("Error generating thumbnail signed URL:", err);
    return NextResponse.redirect(new URL("/images/class-11-accountancy.jpg", req.url));
  }
}
