// app/api/mentor/consultations/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getMentorSession } from "@/lib/auth";

export async function GET() {
  try {
    // 1. Validate mentor session
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    if (!session.mentorId) {
      return NextResponse.json(
        { error: "Invalid mentor session - no mentorId found" },
        { status: 400 }
      );
    }

    console.log("[GET Consultations] Mentor Session:", {
      mentorId: session.mentorId,
      fullName: session.fullName
    });

    // 2. Fetch consultations with related data
    const consultations = await prisma.consultation.findMany({
      where: {
        mentorId: session.mentorId,
      },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            major: true,
            currentStatus: true,
            dreamJob: true
          }
        },
        slot: {
          select: {
            startTime: true,
            endTime: true,
            duration: true,
            isBooked: true
          }
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            type: true
          }
        }
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    console.log(`[GET Consultations] Found ${consultations.length} consultations for mentor ${session.mentorId}`);

    // 3. Transform data format
    const transformedConsultations = consultations.map(consultation => ({
      id: consultation.id,
      status: consultation.status,
      zoomLink: consultation.zoomLink,
      startTime: consultation.slot?.startTime,
      endTime: consultation.slot?.endTime,
      duration: consultation.slot?.duration,
      createdAt: consultation.createdAt,
      updatedAt: consultation.updatedAt,
      rating: consultation.rating,
      review: consultation.review,
      cancelReason: consultation.cancelReason,
      cancelledAt: consultation.cancelledAt,
      mentorNotes: consultation.mentorNotes,
      client: {
        id: consultation.client.id,
        fullName: consultation.client.fullName,
        major: consultation.client.major,
        currentStatus: consultation.client.currentStatus,
        dreamJob: consultation.client.dreamJob
      },
      slot: consultation.slot ? {
        startTime: consultation.slot.startTime,
        endTime: consultation.slot.endTime,
        duration: consultation.slot.duration,
        isBooked: consultation.slot.isBooked
      } : null,
      lastMessage: consultation.messages[0] || null
    }));

    return NextResponse.json(transformedConsultations);
  } catch (error) {
    console.error("[GET Consultations] Error:", error);
    
    // 4. Detailed error response
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    const errorResponse = {
      error: "Failed to fetch consultations",
      details: errorMessage,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Handle PATCH requests for updating consultation status or adding zoom links
export async function PATCH(req: Request) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { consultationId, status, zoomLink } = body;

    if (!consultationId) {
      return NextResponse.json(
        { error: "Consultation ID is required" },
        { status: 400 }
      );
    }

    // Verify consultation belongs to mentor
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        mentorId: session.mentorId
      }
    });

    if (!consultation) {
      return NextResponse.json(
        { error: "Consultation not found" },
        { status: 404 }
      );
    }

    // Update consultation
    const updateData: any = {};
    if (status) updateData.status = status;
    if (zoomLink !== undefined) updateData.zoomLink = zoomLink;

    const updatedConsultation = await prisma.consultation.update({
      where: {
        id: consultationId
      },
      data: updateData,
      include: {
        client: true,
        slot: true,
        messages: {
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        }
      }
    });

    console.log(`[PATCH Consultation] Updated consultation ${consultationId}:`, updateData);

    return NextResponse.json(updatedConsultation);
  } catch (error) {
    console.error("[PATCH Consultation] Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Failed to update consultation",
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}