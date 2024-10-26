import { Metadata } from "next";
import { ClientHeader } from "@/components/client/ClientHeader";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { Toaster } from "@/components/ui/toaster";
import { redirect } from "next/navigation";
import { getClientSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Client Dashboard - KarierKu",
  description: "Manage your career development journey",
};

export default async function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getClientSession();

  if (!session || session.role !== "CLIENT") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-background">
      <ClientSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <ClientHeader clientName={session.fullName} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}