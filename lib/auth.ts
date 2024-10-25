import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

// Secret key untuk JWT, pastikan ditambahkan di .env
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const key = new TextEncoder().encode(SECRET_KEY);

// Interface untuk data session admin
import { JWTPayload } from "jose";

export interface AdminSession extends JWTPayload {
  id: string;
  email: string;
  role: "ADMIN";
  permissions: string[];
}

// Fungsi untuk membuat session admin
export async function createAdminSession(session: AdminSession) {
  // Buat JWT token
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h") // Token expired dalam 8 jam
    .sign(key);

  // Set cookie dengan token
  cookies().set("admin-token", token, {
    httpOnly: true, // Cookie tidak bisa diakses via JavaScript
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax",
    maxAge: 8 * 60 * 60, // 8 jam dalam detik
    path: "/",
  });

  return token;
}

// Fungsi untuk verifikasi token
export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, key);
    return verified.payload as AdminSession;
  } catch {
    throw new Error("Invalid token");
  }
}

// Fungsi untuk mendapatkan session admin dari request
export async function getAdminSession(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value;
  
  if (!token) return null;
  
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

// Fungsi untuk check permission
export async function checkPermission(permission: string, session: AdminSession | null) {
  if (!session) return false;
  return session.permissions.includes(permission);
}

// Fungsi untuk logout
export async function logout() {
  cookies().set("admin-token", "", {
    expires: new Date(0),
  });
}