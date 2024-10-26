import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMentorSession, getAdminSession, getClientSession } from "./lib/auth";

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
  '/dashboard',
  '/dashboard/career',
  '/dashboard/events',
  '/dashboard/consultation'
];

const PUBLIC_ROUTES = ['/', '/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check route types
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  const isMentorRoute = MENTOR_ROUTES.some(route => pathname.startsWith(route));
  const isClientRoute = CLIENT_ROUTES.some(route => pathname.startsWith(route));
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route);

  // Handle admin routes
  if (isAdminRoute) {
    const session = await getAdminSession(request);
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Handle mentor routes
  if (isMentorRoute) {
    const session = await getMentorSession(request);
    
    if (!session || session.role !== "MENTOR") {
      return NextResponse.redirect(new URL("/mentor", request.url));
    }
  }

  // Handle client routes
  if (isClientRoute) {
    const session = await getClientSession(request);
    
    if (!session || session.role !== "CLIENT") {
      // Store the intended destination
      const searchParams = new URLSearchParams({
        callbackUrl: pathname
      });
      
      return NextResponse.redirect(
        new URL(`/login?${searchParams}`, request.url)
      );
    }
  }

  // Handle public routes when user is already authenticated
  if (isPublicRoute) {
    const adminSession = await getAdminSession(request);
    const mentorSession = await getMentorSession(request);
    const clientSession = await getClientSession(request);

    if (adminSession) {
      return NextResponse.redirect(new URL("/dashboard-admin", request.url));
    }

    if (mentorSession) {
      return NextResponse.redirect(new URL("/dashboard-mentor", request.url));
    }

    if (clientSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Continue to next middleware or route handler
  return NextResponse.next();
}

// Matcher configuration
export const config = {
  matcher: [
    // Protected routes
    '/dashboard-admin/:path*',
    '/dashboard-mentor/:path*',
    '/dashboard/:path*',
    // Public routes
    '/',
    '/login',
    '/register'
  ]
};