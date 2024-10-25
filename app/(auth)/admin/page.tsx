import { Metadata } from "next";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Login ke dashboard admin KarierKu",
};

export default function AdminLoginPage() {
  return <AdminLoginPanel />;
}