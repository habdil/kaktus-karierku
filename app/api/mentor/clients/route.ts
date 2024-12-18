// app/api/mentor/clients/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getMentorSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    // Query langsung ke tabel Client
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        fullName: true,
        major: true,
        interests: true,
        hobbies: true,
        dreamJob: true,
        currentStatus: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            email: true,
            image: true,
            createdAt: true
          }
        },
        careerAssessments: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            id: true,
            geminiResponse: true,
            createdAt: true
          }
        },
        consultations: {
          where: {
            mentorId: session.mentorId
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            id: true,
            status: true,
            createdAt: true,
            messages: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1,
              select: {
                content: true,
                createdAt: true,
                status: true
              }
            }
          }
        }
      },
      where: search ? {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { major: { contains: search, mode: 'insensitive' } },
          { dreamJob: { contains: search, mode: 'insensitive' } },
          { user: { email: { contains: search, mode: 'insensitive' } } }
        ]
      } : {},
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedClients = clients.map((client) => ({
      id: client.id,
      fullName: client.fullName,
      email: client.user.email,
      image: client.user.image,
      major: client.major,
      currentStatus: client.currentStatus,
      dreamJob: client.dreamJob,
      interests: client.interests,
      hobbies: client.hobbies,
      mentorshipStatus: 'NEW', // Default status karena tidak menggunakan ClientMentor
      lastConsultation: client.consultations[0] || null,
      lastMessage: client.consultations[0]?.messages[0] || null,
      careerAssessment: client.careerAssessments[0] || null,
      joinedDate: client.user.createdAt,
      relationCreatedAt: client.createdAt,
      relationUpdatedAt: client.updatedAt
    }));

    return NextResponse.json(formattedClients);

  } catch (error) {
    console.error("[GET Clients] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}
// POST Method - Menambahkan client baru
export async function POST(req: Request) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { clientId } = await req.json();
    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    // Check if relation already exists
    const existingRelation = await prisma.clientMentor.findFirst({
      where: {
        clientId,
        mentorId: session.mentorId
      }
    });

    if (existingRelation) {
      return NextResponse.json(
        { error: "Relationship already exists" },
        { status: 400 }
      );
    }

    // Create new mentor-client relationship
    const clientMentor = await prisma.clientMentor.create({
      data: {
        clientId,
        mentorId: session.mentorId,
        status: 'NEW'
      },
      include: {
        client: {
          include: {
            user: {
              select: {
                email: true,
                image: true
              }
            }
          }
        }
      }
    });

    // Buat notifikasi untuk client
    await prisma.notification.create({
      data: {
        title: "New Mentor Assignment",
        message: `${session.fullName} has been assigned as your mentor`,
        type: "MENTOR_RECOMMENDATION",
        mentorId: session.mentorId,
        clientId: clientId
      }
    });

    return NextResponse.json(clientMentor);

  } catch (error) {
    console.error("[POST Client] Error:", error);
    return NextResponse.json(
      { error: "Failed to create client relationship" },
      { status: 500 }
    );
  }
}

// Update client mentorship status
export async function PATCH(req: Request) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { clientId, status } = await req.json();
    if (!clientId || !status) {
      return NextResponse.json(
        { error: "Client ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ['NEW', 'IN_PROGRESS', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedRelation = await prisma.clientMentor.update({
      where: {
        clientId_mentorId: {
          clientId,
          mentorId: session.mentorId
        }
      },
      data: { status },
      include: {
        client: true
      }
    });

    // Create notification for status change
    await prisma.notification.create({
      data: {
        title: "Mentorship Status Updated",
        message: `Your mentorship status has been updated to ${status}`,
        type: "MENTOR_RECOMMENDATION",
        mentorId: session.mentorId,
        clientId: clientId
      }
    });

    return NextResponse.json(updatedRelation);
  } catch (error) {
    console.error("[PATCH Client] Error:", error);
    return NextResponse.json(
      { error: "Failed to update client relationship" },
      { status: 500 }
    );
  }
}

// Remove client from mentor
export async function DELETE(req: Request) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    // Delete the relationship
    await prisma.clientMentor.delete({
      where: {
        clientId_mentorId: {
          clientId,
          mentorId: session.mentorId
        }
      }
    });

    // Create notification for client
    await prisma.notification.create({
      data: {
        title: "Mentorship Ended",
        message: `Your mentorship with ${session.fullName} has ended`,
        type: "MENTOR_RECOMMENDATION",
        mentorId: session.mentorId,
        clientId: clientId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE Client] Error:", error);
    return NextResponse.json(
      { error: "Failed to remove client relationship" },
      { status: 500 }
    );
  }
}