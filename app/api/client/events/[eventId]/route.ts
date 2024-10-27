// app/api/client/events/[eventId]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: params.eventId
      },
      include: {
        admin: {
          select: {
            fullName: true
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Event not found" 
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch event" 
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}