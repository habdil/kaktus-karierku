import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/services/auth";
import { createAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Authenticate admin
    const adminData = await authenticateAdmin({ email, password });

    // Create session
    await createAdminSession({
      id: adminData.id,
      email: adminData.email,
      role: "ADMIN",
      permissions: ["ALL"] // Bisa disesuaikan dengan kebutuhan
    });

    return NextResponse.json({
      success: true,
      user: {
        email: adminData.email,
        fullName: adminData.fullName
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { success: false, error: message },
      { status: 401 }
    );
  }
}