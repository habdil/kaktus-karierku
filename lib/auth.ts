import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { JWTPayload } from "jose";

// Secret key untuk JWT
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const key = new TextEncoder().encode(SECRET_KEY);

// Base Session interface
interface BaseSession extends JWTPayload {
  id: string;
  email: string;
  permissions: string[];
}

// Session interfaces
export interface AdminSession extends BaseSession {
  role: "ADMIN";
}

export interface MentorSession extends BaseSession {
  role: "MENTOR";
  fullName: string;
  mentorId: string;
}

export interface ClientSession extends BaseSession {
  role: "CLIENT";
  fullName: string;
  clientId: string;
}

// Type untuk role-specific session
type UserSession = AdminSession | MentorSession | ClientSession;

// Generic function untuk membuat session
async function createSession<T extends UserSession>(
  session: T,
  cookieName: string
) {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(key);

  cookies().set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 8 * 60 * 60,
    path: "/",
  });

  return token;
}

// Specific session creators
export async function createAdminSession(session: AdminSession) {
  return createSession(session, "admin-token");
}

export async function createMentorSession(session: MentorSession) {
  return createSession(session, "mentor-token");
}

export async function createClientSession(session: ClientSession) {
  return createSession(session, "client-token");
}

// Token verification
export async function verifyToken<T extends UserSession>(token: string): Promise<T> {
  try {
    const verified = await jwtVerify(token, key);
    return verified.payload as T;
  } catch {
    throw new Error("Invalid token");
  }
}

// Session getters
export async function getAdminSession(req?: NextRequest) {
  try {
    const token = req
      ? req.cookies.get("admin-token")?.value
      : cookies().get("admin-token")?.value;

    if (!token) return null;

    const verified = await verifyToken<AdminSession>(token);
    if (verified.role !== "ADMIN") return null;

    return verified;
  } catch {
    return null;
  }
}

export async function getMentorSession(req?: NextRequest) {
  try {
    const token = req
      ? req.cookies.get("mentor-token")?.value
      : cookies().get("mentor-token")?.value;

    if (!token) return null;

    const verified = await verifyToken<MentorSession>(token);
    if (verified.role !== "MENTOR") return null;

    return verified;
  } catch {
    return null;
  }
}

export async function getClientSession(req?: NextRequest) {
  try {
    const token = req
      ? req.cookies.get("client-token")?.value
      : cookies().get("client-token")?.value;

    if (!token) return null;

    const verified = await verifyToken<ClientSession>(token);
    if (verified.role !== "CLIENT") return null;

    return verified;
  } catch {
    return null;
  }
}

// Permission checking
export function checkPermission(
  permission: string,
  session: UserSession | null
) {
  if (!session) return false;
  return session.permissions.includes(permission);
}

// Logout function
export async function logout() {
  const cookieOptions = { 
    expires: new Date(0),
    path: "/" 
  };
  
  cookies().set("admin-token", "", cookieOptions);
  cookies().set("mentor-token", "", cookieOptions);
  cookies().set("client-token", "", cookieOptions);
}

// Helper function to get any type of session
export async function getCurrentSession(req?: NextRequest) {
  const adminSession = await getAdminSession(req);
  if (adminSession) return adminSession;

  const mentorSession = await getMentorSession(req);
  if (mentorSession) return mentorSession;

  const clientSession = await getClientSession(req);
  if (clientSession) return clientSession;

  return null;
}