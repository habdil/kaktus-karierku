import { FeatureMaintenance } from "@/components/shared/FeatureMaintanace";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Mentor Area",
  description: "Mentor dashboard overview",
};

export default function MentorDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center h-screen">
      <FeatureMaintenance
          title="Tahap Pengambangan"
          description="Kami sedang mengembangkan fitur ini untuk memperbaiki dan meningkatkan kualitas layanan kami."
      />
  </div>
    </div>
  );
}