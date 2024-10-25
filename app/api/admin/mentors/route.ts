import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      username,
      password,
      fullName,
      phoneNumber,
      education,
      maritalStatus,
      company,
      jobRole,
      motivation,
    } = body;

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user and mentor in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user first
      const user = await tx.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role: "MENTOR",
        },
      });

      // Create mentor profile
      const mentor = await tx.mentor.create({
        data: {
          userId: user.id,
          fullName,
          phoneNumber,
          education,
          maritalStatus,
          company,
          jobRole,
          motivation,
          status: "ACTIVE",
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

      return mentor;
    });

    return NextResponse.json({
      success: true,
      message: "Mentor created successfully",
      data: {
        id: result.id,
        fullName: result.fullName,
        email: result.user.email,
        status: result.status,
      },
    });

  } catch (error) {
    console.error("Error creating mentor:", error);

    // Handle unique constraint violations
    if ((error as any).code === 'P2002') {
      const prismaError = error as { meta: { target: string[] } };
      return NextResponse.json(
        {
          success: false,
          error: `${prismaError.meta.target[0]} already exists`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create mentor",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: Request) {
  try {
    const mentors = await prisma.mentor.findMany({
      include: {
        user: {
          select: {
            email: true,
            username: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: mentors,
    });

  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch mentors",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}