import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getMentorSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Verify if the user is actually a mentor
    const session = await getMentorSession();
    
    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unauthorized" 
        }, 
        { status: 401 }
      );
    }

    // Clear mentor token
    cookies().set("mentor-token", "", {
      expires: new Date(0),
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "An error occurred during logout" 
      }, 
      { status: 500 }
    );
  }
}