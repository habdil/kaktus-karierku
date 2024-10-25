import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - KarierKu Admin",
  description: "Admin dashboard untuk mengelola platform KarierKu",
};

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-4">
      {/* Content placeholders */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <div className="rounded-xl border bg-card h-[200px]" />
        <div className="rounded-xl border bg-card h-[200px]" />
      </div>
      <div className="rounded-xl border bg-card h-[400px]" />
    </div>
  );
}