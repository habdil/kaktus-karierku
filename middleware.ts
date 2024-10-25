import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Definisi protected routes sesuai struktur folder
const ADMIN_ROUTES = [
  '/dashboard-admin',
  '/dashboard-admin/analytics',
  '/dashboard-admin/events',
  '/dashboard-admin/mentors'
];

const AUTH_ROUTE = '/';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.includes(route));
  const token = request.cookies.get("admin-token")?.value;

  // Jika mengakses admin routes tanpa token
  if (isAdminRoute && !token) {
    // Redirect ke login dengan return URL
    const searchParams = new URLSearchParams({
      'returnUrl': pathname
    });
    return NextResponse.redirect(
      new URL(`${AUTH_ROUTE}?${searchParams}`, request.url)
    );
  }

  return NextResponse.next();
}

// Matcher untuk routes yang perlu di-protect
export const config = {
  matcher: [
    '/dashboard-admin/:path*',
    '/dashboard-admin/analytics/:path*',
    '/dashboard-admin/events/:path*',
    '/dashboard-admin/mentors/:path*'
  ]
};