// app/api/mentor/notifications/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getMentorSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getMentorSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        mentorId: session.mentorId,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // Limit to last 20 notifications
    });

    return NextResponse.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}