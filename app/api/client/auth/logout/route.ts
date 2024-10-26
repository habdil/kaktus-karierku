import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getClientSession } from "@/lib/auth";

export async function POST() {
  try {
    // Verify if the user is actually a client
    const session = await getClientSession();
    
    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unauthorized" 
        }, 
        { status: 401 }
      );
    }

    // Clear client token
    cookies().set("client-token", "", {
      expires: new Date(0),
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
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