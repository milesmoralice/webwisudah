import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "wisudah_admin_session";
const ADMIN_SESSION_TOKEN = "token_session_kelompok2ceria_auth_2026";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isLoggedIn = session === ADMIN_SESSION_TOKEN;

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    // If accessing the login page itself
    if (pathname === "/admin/login") {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Other /admin routes require authentication
    if (!isLoggedIn) {
      const loginUrl = new URL("/admin/login", request.url);
      if (pathname !== "/admin") {
        loginUrl.searchParams.set("from", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
