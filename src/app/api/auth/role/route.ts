import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, getUserRole } from "@/lib/auth/roles";



export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({
        authenticated: false,
        role: "guest",
        isAdmin: false,
      });
    }

    const role = await getUserRole(user.id, user.email);

    return NextResponse.json({
      authenticated: true,
      userId: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
      avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      role,
      isAdmin: role === "admin",
    });
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_") || error?.digest === "HANGING_PROMISE_REJECTION") {
      throw error;
    }
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
