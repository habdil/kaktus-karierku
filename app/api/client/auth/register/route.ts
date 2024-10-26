import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import * as z from "zod";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Validation schema
const registerSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters long.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters long.",
  }),
  major: z.string().optional(),
  interests: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
  dreamJob: z.string().optional(),
  currentStatus: z.enum(["Masih Kuliah", "Mencari Kerja", "Sudah Kerja"]).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if email already exists
    const existingUserEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUserEmail) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Email already registered" 
        }, 
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username: validatedData.username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Username already taken" 
        }, 
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12);

    // Create user and client profile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          username: validatedData.username,
          password: hashedPassword,
          role: "CLIENT",
        },
      });

      // Create client profile
      const client = await tx.client.create({
        data: {
          userId: user.id,
          fullName: validatedData.fullName,
          major: validatedData.major,
          interests: validatedData.interests || [],
          hobbies: validatedData.hobbies || [],
          dreamJob: validatedData.dreamJob,
          currentStatus: validatedData.currentStatus,
        },
        include: {
          user: {
            select: {
              email: true,
              username: true,
              role: true,
            },
          },
        },
      });

      return client;
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Registration successful",
      data: {
        id: result.id,
        email: result.user.email,
        username: result.user.username,
        fullName: result.fullName,
      },
    });

  } catch (error) {
    // Handle different types of errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation error", 
          details: error.errors 
        }, 
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const field = error.meta?.target as string[];
        return NextResponse.json(
          { 
            success: false, 
            error: `${field[0]} already exists` 
          }, 
          { status: 400 }
        );
      }
    }

    // Log the error for debugging
    console.error("Registration error:", error);

    // Return generic error for unknown errors
    return NextResponse.json(
      { 
        success: false, 
        error: "An error occurred during registration" 
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}