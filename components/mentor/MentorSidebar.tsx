"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Calendar,
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
    href: "/dashboard-mentor",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Konsultasi",
    href: "/dashboard-mentor/consultation",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "List Client",
    href: "/dashboard-mentor/clients",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Event",
    href: "/dashboard-mentor/events",
    icon: <Calendar className="h-5 w-5" />,
  },
];

interface MentorSidebarProps {
  items?: SidebarItem[];
  className?: string;
}

export function MentorSidebar({ items = defaultItems, className }: MentorSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/mentor/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });

      router.push("/mentor");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      });
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
            KarierKu
          </span>
        )}
      </div>

      {/* Navigation */}
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
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
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