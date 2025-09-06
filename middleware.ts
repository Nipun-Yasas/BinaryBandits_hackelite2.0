import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/(main)/admin")) {
    // Check for session cookie
    const sessionCookie = request.cookies.get("pathfinder-session");
    
    // If no session cookie, redirect to admin login
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  // Protect main dashboard routes - require login
  if (pathname.startsWith("/(main)") || pathname === "/dashboard" || pathname === "/profile") {
    const sessionCookie = request.cookies.get("pathfinder-session");
    
    // If no session cookie, redirect to login
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
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
