import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Toaster } from "@/components/ui/toaster";
import { verifyToken } from "@/lib/auth";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard - KarierKu",
  description: "Dashboard admin untuk mengelola platform KarierKu",
};

async function getSession() {
  const token = cookies().get("admin-token")?.value;
  
  if (!token) {
    return null;
  }

  try {
    const session = await verifyToken(token);
    return session;
  } catch (error) {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin");
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="h-screen flex bg-background">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader user={session} />
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}