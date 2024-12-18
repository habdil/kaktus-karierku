import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getClientSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const session = await getClientSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        clientId: session.clientId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20, // Limit to the latest 20 notifications
    });

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching client notifications:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
