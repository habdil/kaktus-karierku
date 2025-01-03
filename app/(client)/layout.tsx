import { Metadata } from "next";
import { ClientHeader } from "@/components/client/ClientHeader";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { Toaster } from "@/components/ui/toaster";
import { redirect } from "next/navigation";
import { getClientSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Client Dashboard - KarierKu",
  description: "Manage your career development journey",
};

async function getClientData(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      image: true,
    },
  });
}

export default async function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getClientSession();
  if (!session || session.role !== "CLIENT") {
    redirect("/login");
  }
  // Get user data including image
  const userData = await getClientData(session.id);

  return (
    <div className="relative min-h-screen flex">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-30">
        <ClientSidebar />
      </div>
      
      {/* Mobile Sidebar Overlay - Will be handled by ClientSidebar component */}
      <div className="md:hidden">
        <ClientSidebar />
      </div>
      
      {/* Main Content with Header */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-64">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <ClientHeader 
            clientName={session.fullName} 
            userImage={userData?.image}
          />
        </div>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}