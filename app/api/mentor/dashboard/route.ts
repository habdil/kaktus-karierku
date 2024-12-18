import { NextResponse } from "next/server";
import { getConsultationStats, getRecentActivity, getPendingRequests } from "@/lib/dashboard";

export async function GET() {
  try {
    const [stats, activity, requests] = await Promise.all([
      getConsultationStats(),
      getRecentActivity(),
      getPendingRequests()
    ]);

    return NextResponse.json({
      stats,
      activity,
      requests
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}