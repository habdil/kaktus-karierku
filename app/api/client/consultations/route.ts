// app/api/client/consultations/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getClientSession } from "@/lib/auth";
import { broadcastConsultationsUpdate, broadcastMentorConsultations } from "@/lib/sseClient";

export async function GET() {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const consultations = await prisma.consultation.findMany({
      where: {
        clientId: session.clientId,
      },
      include: {
        mentor: {
          include: {
            expertise: true, // Include mentor expertise
            user: {
              select: {
                image: true,
              }
            }
          },
        },
        slot: true,
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Transform data to include mentor image and expertise
    const transformedConsultations = consultations.map(consultation => ({
      ...consultation,
      mentor: {
        id: consultation.mentor.id,
        fullName: consultation.mentor.fullName,
        image: consultation.mentor.user.image,
        expertise: consultation.mentor.expertise.map(exp => ({
          id: exp.id,
          area: exp.area
        }))
      }
    }));

    return NextResponse.json(transformedConsultations);
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST method remains the same but use session.clientId
export async function POST(req: Request) {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slotId, message } = await req.json();
    
    const slot = await prisma.consultationSlot.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.isBooked) {
      return NextResponse.json(
        { error: "Slot not available" },
        { status: 400 }
      );
    }

    // Create consultation
    const consultation = await prisma.consultation.create({
      data: {
        clientId: session.clientId,
        mentorId: slot.mentorId,
        status: "PENDING",
        slotId,
        messages: {
          create: message ? {
            senderId: session.clientId,
            content: message,
            type: "TEXT",
          } : undefined,
        },
      },
      include: {
        messages: true,
      },
    });

    // Broadcast update ke client dan mentor
    await Promise.all([
      broadcastConsultationsUpdate(session.clientId),
      broadcastMentorConsultations(slot.mentorId)
    ]);

    // Mark slot as booked
    await prisma.consultationSlot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    return NextResponse.json(consultation);
  } catch (error) {
    console.error("Error creating consultation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}