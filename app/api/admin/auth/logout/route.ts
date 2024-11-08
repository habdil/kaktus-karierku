import { NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export async function POST() {
  try {
    // Gunakan fungsi logout dari lib/auth
    await logout();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to logout" 
      },
      { status: 500 }
    );
  }
}