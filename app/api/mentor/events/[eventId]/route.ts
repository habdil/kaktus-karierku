// app/api/mentor/events/[eventId]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getMentorSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getMentorSession();
    
    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unauthorized" 
        }, 
        { status: 401 }
      );
    }

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

    // Update notification as read if exists
    await prisma.notification.updateMany({
      where: {
        eventId: params.eventId,
        mentorId: session.mentorId,
        read: false
      },
      data: {
        read: true
      }
    });

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