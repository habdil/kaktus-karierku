import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const consultationId = searchParams.get("consultationId");

    if (!consultationId) {
      return NextResponse.json({ error: "Consultation ID required" }, { status: 400 });
    }

    console.log("Current session:", {
      role: session.role,
      id: session.id
    });

    // Query consultation berdasarkan role
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        ...(session.role !== "ADMIN" && {
          OR: [
            {
              client: {
                userId: session.id
              }
            },
            {
              mentor: {
                userId: session.id
              }
            }
          ]
        })
      },
      include: {
        messages: {
          include: {
            sender: true
          },
          orderBy: {
            createdAt: "asc"
          }
        },
        client: {
          include: {
            user: true
          }
        },
        mentor: {
          include: {
            user: true
          }
        }
      }
    });

    if (!consultation) {
      console.log("Access denied. Details:", {
        consultationId,
        userRole: session.role,
        userId: session.id
      });
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Transform messages
    const transformedMessages = consultation.messages.map(message => ({
      id: message.id,
      content: message.content,
      senderId: message.sender.id,
      senderName: message.sender.name || "Unknown",
      type: message.type,
      status: message.status,
      createdAt: message.createdAt
    }));

    return NextResponse.json({
      messages: transformedMessages,
      consultation: {
        id: consultation.id,
        status: consultation.status,
        client: {
          id: consultation.client.id,
          name: consultation.client.fullName,
          userId: consultation.client.userId
        },
        mentor: {
          id: consultation.mentor.id,
          name: consultation.mentor.fullName,
          userId: consultation.mentor.userId
        }
      }
    });

  } catch (error) {
    console.error("Error in GET /api/chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { consultationId, content } = body;

    if (!consultationId || !content.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verifikasi akses ke consultation
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: consultationId,
        status: "ACTIVE",
        ...(session.role !== "ADMIN" && {
          OR: [
            {
              client: {
                userId: session.id
              }
            },
            {
              mentor: {
                userId: session.id
              }
            }
          ]
        })
      },
      include: {
        client: true,
        mentor: true
      }
    });

    if (!consultation) {
      console.log("Access denied for user:", session.id, "to consultation:", consultationId);
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Buat pesan
    const message = await prisma.message.create({
      data: {
        consultationId,
        senderId: session.id,
        content: content.trim(),
        type: "TEXT",
        status: "SENT"
      },
      include: {
        sender: true
      }
    });

    // Update lastMessageAt
    await prisma.consultation.update({
      where: { id: consultationId },
      data: {
        lastMessageAt: new Date(),
        lastMessageId: message.id
      }
    });

    // Transform response
    const transformedMessage = {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderName: message.sender.name || "Unknown",
      type: message.type,
      status: message.status,
      createdAt: message.createdAt
    };

    return NextResponse.json(transformedMessage);
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}