import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const baseUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin;

  // Handle errors directly passed back from Google/Supabase
  if (errorParam || errorDescription) {
    console.error("[Auth Callback] Provider returned error:", errorParam, errorDescription);
    const errText = errorDescription || errorParam || "oauth-provider-error";
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(errText)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`);
    }
    console.error("[Auth Callback] Exchange code error:", error.message);
    return NextResponse.redirect(
      `${baseUrl}/login?error=${encodeURIComponent(error.message || "auth-code-error")}`
    );
  }

  // Return the user to login with auth-code-error if code is missing
  return NextResponse.redirect(`${baseUrl}/login?error=auth-code-error`);
}
