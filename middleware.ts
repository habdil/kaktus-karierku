// middleware.ts

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

// Public routes yang tidak perlu diproteksi
const PUBLIC_ROUTES = ['/login', '/register', '/', '/events'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware untuk public routes, static files, dan API routes
  if (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/public') || // Explicitly allow public API routes
    pathname.startsWith('/api/events') || // Allow events API
    pathname.startsWith('/images') ||
    pathname.includes('favicon')
  ) {
    return NextResponse.next();
  }

  // Protected API routes check
  if (pathname.startsWith('/api/')) {
    // Allow specific API patterns
    if (
      pathname.startsWith('/api/public/') ||
      pathname.startsWith('/api/events/')
    ) {
      return NextResponse.next();
    }

    // Protect other API routes based on role
    if (pathname.includes('/api/admin/login')) {
      const session = await getAdminSession(request);
      if (!session || session.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (pathname.includes('/api/mentor/login')) {
      const session = await getMentorSession(request);
      if (!session || session.role !== "MENTOR") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (pathname.includes('/api/client/login')) {
      const session = await getClientSession(request);
      if (!session || session.role !== "CLIENT") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.next();
  }

  // Check route types for pages
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  const isMentorRoute = MENTOR_ROUTES.some(route => pathname.startsWith(route));
  const isClientRoute = CLIENT_ROUTES.some(route => pathname.startsWith(route));

  // Handle admin routes
  if (isAdminRoute) {
    const session = await getAdminSession(request);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Handle mentor routes
  if (isMentorRoute) {
    const session = await getMentorSession(request);
    if (!session || session.role !== "MENTOR") {
      return NextResponse.redirect(new URL('/mentor', request.url));
    }
  }

  // Handle client routes
  if (isClientRoute) {
    const session = await getClientSession(request);
    if (!session || session.role !== "CLIENT") {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|images|favicon.ico).*)',
    // Include API routes in matcher
    '/api/:path*'
  ],
};