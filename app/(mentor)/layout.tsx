// app/(mentor)/layout.tsx
import { Metadata } from "next";
import { MentorHeader } from "@/components/mentor/MentorHeader";
import { MentorSidebar } from "@/components/mentor/MentorSidebar";
import { Toaster } from "@/components/ui/toaster";
import { getMentorSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Mentor Dashboard - KarierKu",
  description: "Mentor dashboard for managing consultations and clients",
};

export default async function MentorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getMentorSession();
  
  if (!session) {
    redirect("/mentor/login");
  }

  return (
    <div className="min-h-screen flex bg-background">
      <MentorSidebar />
      <div className="flex-1 flex flex-col">
        <MentorHeader 
          mentorName={session.fullName} 
          mentorEmail={session.email}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}