import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/app/lib/auth";

export async function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const session = await getSession();

    // If no session or not admin, redirect to admin login
    if (!session?.user || session.user.role !== "admin") {
      const loginUrl = new URL("/admin-login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
