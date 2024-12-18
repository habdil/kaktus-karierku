import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getMentorSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const session = await getMentorSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Update all unread notifications to read
    await prisma.notification.updateMany({
      where: {
        mentorId: session.mentorId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error in PATCH /api/mentor/notifications/mark-all-read:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
