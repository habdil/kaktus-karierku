import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAdminSession } from "@/lib/auth";

const prisma = new PrismaClient();

// GET all events
export async function GET() {
  try {

    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        admin: {
          select: {
            fullName: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch events" 
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST new event
export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    
    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unauthorized" 
        }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, bannerUrl, location, date } = body;

    // Validation
    if (!title || !description || !bannerUrl || !location || !date) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields" 
        }, 
        { status: 400 }
      );
    }

    // Cek apakah admin sudah ada
    const admin = await prisma.admin.findUnique({
      where: {
        userId: session.id
      }
    });

    if (!admin) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Admin not found" 
        }, 
        { status: 404 }
      );
    }

    // Buat event dalam transaction untuk memastikan konsistensi data
    const result = await prisma.$transaction(async (tx) => {
      // Buat event
      const event = await tx.event.create({
        data: {
          title,
          description,
          bannerUrl,
          location,
          date: new Date(date),
          adminId: admin.id
        },
        include: {
          admin: {
            select: {
              fullName: true
            }
          }
        }
      });

      // Buat notifikasi untuk semua mentor
      const mentors = await tx.mentor.findMany({
        where: {
          status: 'ACTIVE'
        },
        select: { id: true }
      });

      if (mentors.length > 0) {
        await tx.notification.createMany({
          data: mentors.map(mentor => ({
            title: "New Event Available!",
            message: `Admin just posted a new event: "${title}"`,
            type: "EVENT",
            mentorId: mentor.id,
            eventId: event.id
          }))
        });
      }

      return event;
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create event",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}