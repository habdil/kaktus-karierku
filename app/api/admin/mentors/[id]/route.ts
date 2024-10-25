import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const mentor = await prisma.mentor.findUnique({
      where: {
        id: params.id,
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

    if (!mentor) {
      return NextResponse.json(
        { success: false, error: "Mentor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: mentor,
    });

  } catch (error) {
    console.error("Error fetching mentor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mentor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      fullName,
      phoneNumber,
      education,
      maritalStatus,
      company,
      jobRole,
      motivation,
      status,
    } = body;

    const updatedMentor = await prisma.mentor.update({
      where: {
        id: params.id,
      },
      data: {
        fullName,
        phoneNumber,
        education,
        maritalStatus,
        company,
        jobRole,
        motivation,
        status,
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

    return NextResponse.json({
      success: true,
      message: "Mentor updated successfully",
      data: updatedMentor,
    });

  } catch (error) {
    console.error("Error updating mentor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update mentor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get mentor to find userId
    const mentor = await prisma.mentor.findUnique({
      where: {
        id: params.id,
      },
      select: {
        userId: true,
      },
    });

    if (!mentor) {
      return NextResponse.json(
        { success: false, error: "Mentor not found" },
        { status: 404 }
      );
    }

    // Delete user and mentor in transaction
    await prisma.$transaction([
      prisma.mentor.delete({
        where: {
          id: params.id,
        },
      }),
      prisma.user.delete({
        where: {
          id: mentor.userId,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Mentor deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting mentor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete mentor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}