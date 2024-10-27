// app/api/mentor/consultations/route.ts
import { NextResponse } from "next/server";
import { ConsultationStatus, PrismaClient } from "@prisma/client";
import { getMentorSession } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Ambil semua konsultasi mentor
export async function GET(request: Request) {
  try {
    const session = await getMentorSession();
    
    if (!session?.mentorId) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unauthorized" 
        }, 
        { status: 401 }
      );
    }

    // Ambil query parameters untuk filter
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as ConsultationStatus | undefined;
    const date = searchParams.get('date');

    // Buat base query
    const where = {
      mentorId: session.mentorId,
      ...(status && { status }),
      ...(date && {
        slot: {
          startTime: {
            gte: new Date(date),
            lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
          },
        },
      }),
    };

    // Ambil konsultasi dengan relasi
    const consultations = await prisma.consultation.findMany({
      where,
      include: {
        client: {
          select: {
            fullName: true,
            currentStatus: true
          }
        },
        slot: true,
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1 // Ambil pesan terakhir saja
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: consultations
    });

  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch consultations" 
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Buat konsultasi baru atau slot konsultasi
export async function POST(request: Request) {
  try {
    const session = await getMentorSession();
    
    if (!session?.mentorId) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unauthorized" 
        }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      startTime, 
      endTime, 
      duration,
      maxBookings = 1,
      isRecurring = false,
      recurringDays = []
    } = body;

    // Validasi input
    if (!startTime || !endTime || !duration) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields" 
        }, 
        { status: 400 }
      );
    }

    // Validasi waktu
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return NextResponse.json(
        { 
          success: false, 
          error: "End time must be after start time" 
        }, 
        { status: 400 }
      );
    }

    // Cek overlap dengan slot yang sudah ada
    const existingSlot = await prisma.consultationSlot.findFirst({
      where: {
        mentorId: session.mentorId,
        OR: [
          {
            AND: [
              { startTime: { lte: start } },
              { endTime: { gt: start } }
            ]
          },
          {
            AND: [
              { startTime: { lt: end } },
              { endTime: { gte: end } }
            ]
          }
        ]
      }
    });

    if (existingSlot) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Time slot overlaps with existing slot" 
        }, 
        { status: 400 }
      );
    }

    // Buat slot konsultasi baru
    const slot = await prisma.consultationSlot.create({
      data: {
        mentorId: session.mentorId,
        startTime: start,
        endTime: end,
        duration,
        maxBookings,
        isRecurring,
        recurringDays,
      }
    });

    // Jika recurring, buat slot untuk minggu-minggu berikutnya
    if (isRecurring && recurringDays.length > 0) {
      // Implementasi logika recurring di sini
      // ...
    }

    return NextResponse.json({
      success: true,
      data: slot
    });

  } catch (error) {
    console.error("Error creating consultation slot:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create consultation slot",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}