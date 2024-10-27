import { Metadata } from "next";
import { MentorHeader } from "@/components/mentor/MentorHeader";
import { MentorSidebar } from "@/components/mentor/MentorSidebar";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Mentor Dashboard - KarierKu",
  description: "Mentor dashboard for managing consultations and clients",
};

export default function MentorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      <MentorSidebar />
      <div className="flex-1 flex flex-col">
        <MentorHeader mentorName="John Doe" />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}