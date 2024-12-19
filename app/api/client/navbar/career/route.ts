import { getClientSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { userId: session.id },
      select: {
        major: true,
        interests: true,
        hobbies: true,
        dreamJob: true,
        careerPlans: true,
      },
    });

    return NextResponse.json({ data: client });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch career data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { major, interests, hobbies, dreamJob, careerPlans } = body;

    const updatedClient = await prisma.client.update({
      where: { userId: session.id },
      data: {
        major,
        interests,
        hobbies,
        dreamJob,
        careerPlans,
      },
    });

    return NextResponse.json({ data: updatedClient });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update career data" },
      { status: 500 }
    );
  }
}