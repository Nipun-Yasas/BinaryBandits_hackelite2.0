import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for admin routes
  if (pathname.startsWith("/admin")) {
    // Check for session cookie
    const sessionCookie = request.cookies.get("pathfinder-session");
    
    // If no session cookie, redirect to admin login
    if (!sessionCookie) {
      const loginUrl = new URL("/admin-login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect main dashboard routes - require login
  if (pathname.startsWith("/(main)") || pathname === "/dashboard" || pathname === "/profile") {
    const sessionCookie = request.cookies.get("pathfinder-session");
    
    // If no session cookie, redirect to login
    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login/signup pages
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup|admin-login).*)",
  ],
};
