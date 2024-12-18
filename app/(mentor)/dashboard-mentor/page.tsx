// app/(mentor)/dashboard-mentor/page.tsx (update the parent component)
import { Suspense } from "react";
import { Metadata } from "next";
import { MentorGreeting } from "@/components/mentor/dashboard/MentorGreeting";
import { ClientActivity } from "@/components/mentor/dashboard/ClientActivity";
import { ConsultationStats } from "@/components/mentor/dashboard/ConsultationStats";
import { PendingRequests } from "@/components/mentor/dashboard/PendingRequests";
import { DashboardSkeleton } from "@/components/mentor/dashboard/DashboardSkeleton";
import { getPendingRequests } from "@/lib/dashboard";

export const metadata: Metadata = {
  title: "Dashboard - Mentor Area",
  description: "Mentor dashboard overview",
};

export default async function MentorDashboardPage() {
  const requests = await getPendingRequests();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <MentorGreeting />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ConsultationStats />
          <ClientActivity />
        </div>
        <PendingRequests requests={requests} />
      </Suspense>
    </div>
  );
}