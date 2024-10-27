// app\(public)\events\[eventId]\page.tsx

"use client";

import { useRouter } from "next/router";
import { PublicEventDetail } from "@/components/public/PublicEventDetail";
import { useEffect, useState } from "react";

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
  const { eventId } = params;

  return (
    <div className="container mx-auto py-8">
      <PublicEventDetail eventId={eventId} />
    </div>
  );
}
