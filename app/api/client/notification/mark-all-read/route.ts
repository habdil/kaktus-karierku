import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getClientSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const session = await getClientSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Mark all unread notifications as read for the client
    await prisma.notification.updateMany({
      where: {
        clientId: session.clientId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error marking all client notifications as read:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
