import { PrismaClient } from "@prisma/client";
import { verifyPassword } from "../utils/password";
import { LoginCredentials, AdminSessionData } from "../types/auth";

const prisma = new PrismaClient();

export async function authenticateAdmin(credentials: LoginCredentials) {
  // Cari user berdasarkan email
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
    include: {
      admin: true, // Include relasi admin
    },
  });

  // Jika user tidak ditemukan atau bukan admin
  if (!user || user.role !== 'ADMIN' || !user.admin) {
    throw new Error('Invalid credentials');
  }

  // Verifikasi password
  const isValid = await verifyPassword(credentials.password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Return session data
  const sessionData: AdminSessionData = {
    id: user.id,
    email: user.email,
    fullName: user.admin.fullName,
    role: 'ADMIN',
  };

  return sessionData;
}