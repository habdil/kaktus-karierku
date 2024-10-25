import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMentorSession } from "./lib/auth";

// Definisi protected routes sesuai struktur folder
const ADMIN_ROUTES = [
  '/dashboard-admin',
  '/dashboard-admin/analytics',
  '/dashboard-admin/events',
  '/dashboard-admin/mentors'
];

const MENTOR_ROUTES = [
  '/dashboard-mentor',
  '/dashboard-mentor/clients',
  '/dashboard-mentor/consultation',
  '/dashboard-mentor/events'
];

const AUTH_ROUTE = '/';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  const isMentorRoute = MENTOR_ROUTES.some(route => pathname.startsWith(route));
  const adminToken = request.cookies.get("admin-token")?.value;

  // Jika mengakses admin routes tanpa token
  if (isAdminRoute && !adminToken) {
    // Redirect ke login dengan return URL
    const searchParams = new URLSearchParams({
      returnUrl: pathname
    });
    return NextResponse.redirect(
      new URL(`${AUTH_ROUTE}?${searchParams}`, request.url)
    );
  }

  // Handle mentor routes
  if (isMentorRoute) {
    const session = await getMentorSession(request);

    // Jika tidak ada sesi atau role bukan mentor, redirect ke login mentor
    if (!session || session.role !== "MENTOR") {
      return NextResponse.redirect(new URL("/mentor/login", request.url));
    }
  }

  // Lanjut ke route berikutnya jika tidak ada kondisi redirect
  return NextResponse.next();
}

// Matcher untuk routes yang perlu di-protect
export const config = {
  matcher: [
    '/dashboard-admin/:path*',
    '/dashboard-mentor/:path*'
  ]
};
