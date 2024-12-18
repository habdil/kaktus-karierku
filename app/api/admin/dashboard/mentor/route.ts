// app/api/admin/dashboard/mentor/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mentorActivities = await prisma.consultation.findMany({
      take: 10, // Limit to last 10 activities
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        mentor: {
          select: {
            fullName: true,
            company: true,
            jobRole: true,
            status: true
          }
        },
        client: {
          select: {
            fullName: true,
            major: true
          }
        }
      }
    });

    return NextResponse.json(mentorActivities);
  } catch (error) {
    console.error("Error fetching mentor activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentor activities" },
      { status: 500 }
    );
  }
}