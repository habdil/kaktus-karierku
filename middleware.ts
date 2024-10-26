import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMentorSession, getAdminSession, getClientSession } from "@/lib/auth";

// Protected routes definition
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

const CLIENT_ROUTES = [
  '/dashboard-client',
  '/dashboard-client/career',
  '/dashboard-client/events',
  '/dashboard-client/consultation'
];

// Auth routes yang tidak perlu diproteksi
const PUBLIC_ROUTES = ['/login', '/register', '/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware untuk public routes dan static files
  if (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.includes('/_next') ||
    pathname.includes('/api') ||
    pathname.includes('/images')
  ) {
    return NextResponse.next();
  }

  // Check route types
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  const isMentorRoute = MENTOR_ROUTES.some(route => pathname.startsWith(route));
  const isClientRoute = CLIENT_ROUTES.some(route => pathname.startsWith(route));

  // Handle admin routes
  if (isAdminRoute) {
    const session = await getAdminSession(request);
    if (!session || session.role !== "ADMIN") {
      // Redirect ke login hanya jika belum di halaman login
      if (pathname !== '/') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  // Handle mentor routes
  if (isMentorRoute) {
    const session = await getMentorSession(request);
    if (!session || session.role !== "MENTOR") {
      if (pathname !== '/mentor') {
        return NextResponse.redirect(new URL('/mentor', request.url));
      }
    }
  }

  // Handle client routes
  if (isClientRoute) {
    const session = await getClientSession(request);
    if (!session || session.role !== "CLIENT") {
      if (pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

// Update matcher untuk exclude static files dan api routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};