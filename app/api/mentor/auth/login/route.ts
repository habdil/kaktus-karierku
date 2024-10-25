import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import { createMentorSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Email and password are required" 
        }, 
        { status: 400 }
      );
    }

    // Cari user dengan role MENTOR
    const user = await prisma.user.findFirst({
      where: {
        email,
        role: "MENTOR",
      },
      include: {
        mentor: true, // Include mentor data
      },
    });

    if (!user || !user.mentor) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid credentials" 
        }, 
        { status: 401 }
      );
    }

    // Verifikasi password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid credentials" 
        }, 
        { status: 401 }
      );
    }

    // Check if mentor is active
    if (user.mentor.status === "INACTIVE") {
      return NextResponse.json(
        { 
          success: false, 
          error: "Mentor account is inactive" 
        }, 
        { status: 403 }
      );
    }

    // Create session
    await createMentorSession({
      id: user.id,
      email: user.email,
      role: "MENTOR",
      fullName: user.mentor.fullName,
      mentorId: user.mentor.id,
      permissions: ["MENTOR_ACCESS"],
    });

    // Return success response with mentor data
    return NextResponse.json({
      success: true,
      data: {
        email: user.email,
        fullName: user.mentor.fullName,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "An error occurred during login" 
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}