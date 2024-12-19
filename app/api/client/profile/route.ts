import { getClientSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET endpoint untuk mengambil data profil
export async function GET() {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { userId: session.id },
      select: {
        fullName: true,
        user: {
          select: {
            email: true,
            username: true,
            image: true,
          }
        }
      }
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        fullName: client.fullName,
        email: client.user.email,
        username: client.user.username,
        image: client.user.image,
      }
    });

  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT endpoint untuk update profil
export async function PUT(request: Request) {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, username, image } = body;

    // Validasi input
    if (!fullName || !username) {
      return NextResponse.json(
        { error: "Full name and username are required" },
        { status: 400 }
      );
    }

    // Check if username is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        username,
        NOT: {
          id: session.id
        }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    // Update user and client data
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.id },
        data: {
          username,
          image,
        },
      }),
      prisma.client.update({
        where: { userId: session.id },
        data: {
          fullName,
        },
      }),
    ]);

    return NextResponse.json({
      data: {
        message: "Profile updated successfully",
      }
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}