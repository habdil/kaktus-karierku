// app/api/mentor/consultations/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getMentorSession } from "@/lib/auth";
import { broadcastConsultationsUpdate, broadcastMentorConsultations } from "@/lib/sseClient";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }  // Changed from consultationId to id
) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Log params and session for debugging
    console.log("GET Request params:", params);
    console.log("Mentor session:", { mentorId: session.mentorId });

    const consultation = await prisma.consultation.findUnique({
      where: {
        id: params.id,  // Changed from params.consultationId
        mentorId: session.mentorId
      },
      include: {
        client: {
          include: {
            careerAssessments: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        slot: true
      }
    });

    if (!consultation) {
      return NextResponse.json(
        { error: "Consultation not found" },
        { status: 404 }
      );
    }

    // Format response
    const formattedConsultation = {
      ...consultation,
      careerAssessment: consultation.client.careerAssessments[0] || null,
      client: {
        id: consultation.client.id,
        fullName: consultation.client.fullName,
        currentStatus: consultation.client.currentStatus,
      },
      recentMessages: consultation.messages.reverse()
    };

    return NextResponse.json(formattedConsultation);
  } catch (error) {
    console.error("Error fetching consultation:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status, zoomLink } = body;

    if (!params.id) {
      return NextResponse.json(
        { error: "Consultation ID is required" },
        { status: 400 }
      );
    }

    // Verify consultation and get client ID
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: params.id,
        mentorId: session.mentorId
      },
      select: {
        clientId: true,
        mentorId: true,
        status: true
      }
    });

    if (!consultation) {
      return NextResponse.json(
        { error: "Consultation not found" },
        { status: 404 }
      );
    }

    // Update consultation with transaction
    const updatedConsultation = await prisma.$transaction(async (tx) => {
      // Update consultation status
      const updated = await tx.consultation.update({
        where: { id: params.id },
        data: {
          ...(status && { status }),
          ...(zoomLink !== undefined && { zoomLink })
        }
      });

      // Create notification for status change
      if (status && status !== consultation.status) {
        await tx.notification.create({
          data: {
            title: `Consultation ${status.toLowerCase()}`,
            message: `Your consultation has been ${status.toLowerCase()}`,
            type: "CONSULTATION",
            mentorId: consultation.mentorId,
            clientId: consultation.clientId
          }
        });

        // If completed or cancelled, release the slot
        if ((status === 'COMPLETED' || status === 'CANCELLED') && updated.slotId) {
          await tx.consultationSlot.update({
            where: { id: updated.slotId },
            data: { isBooked: false }
          });
        }
      }

      return updated;
    });

    // Broadcast updates to both mentor and client
    await Promise.all([
      broadcastConsultationsUpdate(consultation.clientId),
      broadcastMentorConsultations(session.mentorId)
    ]);

    console.log(`[PATCH] Updated consultation ${params.id} status to ${status}`);
    return NextResponse.json(updatedConsultation);

  } catch (error) {
    console.error("[PATCH Consultation] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}