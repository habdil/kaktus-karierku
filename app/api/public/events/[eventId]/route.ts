import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Implement singleton pattern for PrismaClient
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Type definition for better error handling
interface PrismaError {
  code?: string;
  meta?: { cause?: string };
  message: string;
}

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    // Validate eventId format (assuming CUID)
    if (!params.eventId || typeof params.eventId !== 'string' || params.eventId.length < 20) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid event ID format"
        },
        { status: 400 }
      );
    }

    // Fetch event with additional details
    const event = await prisma.event.findUnique({
      where: {
        id: params.eventId
      },
      include: {
        admin: {
          select: {
            fullName: true
          }
        },
        registrations: {
          select: {
            id: true,
            createdAt: true,
          }
        },
        _count: {
          select: {
            registrations: true
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

    // Format the response data
    const formattedEvent = {
      ...event,
      registrationCount: event._count.registrations,
      isUpcoming: new Date(event.date) > new Date(),
      formattedDate: new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      _count: undefined // Remove _count from response
    };

    // Cache-Control headers for optimization
    const headers = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedEvent
      },
      { headers }
    );

  } catch (error) {
    // Enhanced error logging
    const prismaError = error as PrismaError;
    console.error("[Event Detail API] Error details:", {
      timestamp: new Date().toISOString(),
      eventId: params.eventId,
      errorCode: prismaError.code,
      errorCause: prismaError.meta?.cause,
      errorMessage: prismaError.message,
      stack: error instanceof Error ? error.stack : undefined
    });

    // Determine if it's a Prisma error or other error
    const isDatabaseError = error instanceof Error && 
      error.message.includes('prisma');

    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === "development"
          ? prismaError.message
          : isDatabaseError
            ? "Database error occurred"
            : "Failed to fetch event details"
      },
      { status: isDatabaseError ? 503 : 500 }
    );
  }
}

// Add cache configuration for Next.js
export const revalidate = 30; // Revalidate every 30 seconds