// app/api/client/consultations/[consultationId]/route.ts
import { NextRequest } from "next/server";
import  prisma  from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth-options";
import { NextResponse } from "next/server";
import { getClientSession } from "@/lib/auth";
import { broadcastConsultationsUpdate, broadcastMentorConsultations } from "@/lib/sseClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { consultationId: string } }
) {
  try {
    // 1. Gunakan getClientSession untuk autentikasi khusus client
    const session = await getClientSession();
    if (!session?.clientId) {
      return NextResponse.json(
        { error: "Unauthorized - Client access only" },
        { status: 401 }
      );
    }

    // 2. Validasi bahwa konsultasi milik client yang sedang login
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: params.consultationId,
        clientId: session.clientId, // Pastikan hanya mengambil konsultasi milik client yang login
      },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                image: true,
              },
            },
            expertise: true,
          },
        },
        slot: true,
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!consultation) {
      return NextResponse.json(
        { error: "Consultation not found or access denied" },
        { status: 404 }
      );
    }

    // 3. Format response dengan data yang aman
    const formattedConsultation = {
      id: consultation.id,
      status: consultation.status,
      mentor: {
        id: consultation.mentor.id,
        fullName: consultation.mentor.fullName,
        image: consultation.mentor.user.image,
        jobRole: consultation.mentor.jobRole,
        company: consultation.mentor.company,
        education: consultation.mentor.education,
        motivation: consultation.mentor.motivation,
        expertise: consultation.mentor.expertise,
      },
      startTime: consultation.slot?.startTime,
      endTime: consultation.slot?.endTime,
      zoomLink: consultation.zoomLink,
      messages: consultation.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        createdAt: msg.createdAt
      })),
    };

    return NextResponse.json(formattedConsultation);
  } catch (error) {
    console.error("Error in consultation GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const consultation = await prisma.consultation.findFirst({
      where: {
        id: params.id,
        clientId: session.clientId
      },
      include: {
        mentor: true
      }
    });

    if (!consultation) {
      return NextResponse.json(
        { error: "Consultation not found" },
        { status: 404 }
      );
    }

    const { status } = await req.json();

    const updatedConsultation = await prisma.consultation.update({
      where: {
        id: params.id
      },
      data: {
        status
      },
      include: {
        mentor: true,
        client: true
      }
    });

    // Broadcast ke kedua sisi
    await Promise.all([
      broadcastConsultationsUpdate(session.clientId),
      broadcastMentorConsultations(consultation.mentor.id)
    ]);

    return NextResponse.json(updatedConsultation);
  } catch (error) {
    console.error("Error updating consultation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}