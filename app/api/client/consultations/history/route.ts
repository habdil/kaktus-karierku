import { getClientSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get client session
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get client ID from session
    const client = await prisma.client.findUnique({
      where: { userId: session.id },
      select: { id: true }
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Fetch consultations with related data
    const consultations = await prisma.consultation.findMany({
      where: {
        clientId: client.id,
      },
      select: {
        id: true,
        mentorId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        rating: true,
        review: true,
        cancelReason: true,
        cancelledAt: true,
        mentor: {
          select: {
            fullName: true,
            jobRole: true,
            company: true,
            user: {
              select: {
                image: true,
              }
            }
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            id: true,
            content: true,
            createdAt: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match the frontend interface
    const transformedConsultations = consultations.map(consultation => ({
      ...consultation,
      mentor: {
        ...consultation.mentor,
        image: consultation.mentor.user.image,
      },
      messages: consultation.messages.map(message => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
      })),
      createdAt: consultation.createdAt.toISOString(),
      updatedAt: consultation.updatedAt.toISOString(),
      cancelledAt: consultation.cancelledAt?.toISOString(),
    }));

    return NextResponse.json({
      data: transformedConsultations
    });

  } catch (error) {
    console.error("Error fetching consultation history:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultation history" },
      { status: 500 }
    );
  }
}