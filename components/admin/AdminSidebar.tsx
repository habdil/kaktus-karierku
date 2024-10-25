"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  CalendarPlus,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const defaultItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard-admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/dashboard-admin/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Add Event",
    href: "/dashboard-admin/events",
    icon: <CalendarPlus className="h-5 w-5" />,
  },
  {
    title: "Add Mentor",
    href: "/dashboard-admin/mentors",
    icon: <Users className="h-5 w-5" />,
  },
];

interface AdminSidebarProps {
  items?: SidebarItem[];
  className?: string;
}

export function AdminSidebar({ items = defaultItems, className }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem("adminUser");
      }
      
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari sistem",
      });

      // Use window.location for full page refresh
      window.location.href = "/admin";
      
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout gagal",
        description: "Terjadi kesalahan saat logout",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex h-16 items-center border-b px-4",
        collapsed ? "justify-center" : "justify-start"
      )}>
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
        {!collapsed && (
          <span className="ml-2 font-semibold text-lg text-black">
            Karierku
          </span>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
                collapsed && "justify-center"
              )}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-primary hover:bg-background/80",
            collapsed && "justify-center"
          )}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && (
            <span className="ml-3">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          )}
        </Button>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-20 h-8 w-8 rounded-full border bg-background"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}