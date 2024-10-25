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
      
      {/* Content will be added later */}
    </div>
  );
}