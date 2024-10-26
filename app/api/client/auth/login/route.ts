import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import * as z from "zod";
import { createClientSession } from "@/lib/auth";
import  prisma  from "@/lib/prisma";

// Validation schema
const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        email,
        role: "CLIENT",
      },
      include: {
        client: true,
      },
    });

    // Check if user exists and is a client
    if (!user || !user.client) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // Create session
    await createClientSession({
      id: user.id,
      email: user.email,
      role: "CLIENT",
      fullName: user.client.fullName,
      clientId: user.client.id,
      permissions: ["CLIENT_ACCESS"],
    });

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        email: user.email,
        fullName: user.client.fullName,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
        },
        { status: 500 }
      );
    }

    // Return generic error
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during login",
      },
      { status: 500 }
    );
  }
}