// app/api/public/events/route.ts

import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export const revalidate = 0; // Disable cache

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

    // Add cache control headers for real-time updates
    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    return NextResponse.json({
      success: true,
      data: events
    }, { headers });

  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch events" 
      }, 
      { status: 500 }
    );
  }
}