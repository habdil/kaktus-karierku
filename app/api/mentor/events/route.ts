// app/api/mentor/events/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        date: 'asc'
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