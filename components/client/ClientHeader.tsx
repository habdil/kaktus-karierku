"use client";

import { useEffect, useState } from "react";
import { Bell, Search, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CareerPlanDialog } from "./navbar/CareerPlanDialog";
import { ConsultationHistoryDialog } from "./navbar/ConsultationHistoryDialog";
import { ProfileSettingDialog } from "./navbar/ProfileSettingDialog";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: string;
  eventId?: string;
}

interface ClientHeaderProps {
  clientName?: string;
  userImage?: string | null;
}

export function ClientHeader({ clientName = "Client", userImage }: ClientHeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      const response = await fetch("/api/client/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to logout");
      }

      toast({
        title: "Success",
        description: "Logged out successfully",
      });

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 500);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to logout";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/client/notification");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch notifications");

      setNotifications(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await fetch("/api/client/notification/mark-all-read", { method: "PATCH" });
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      toast({ title: "All notifications marked as read." });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // Handle notification click
  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/client/notification/${notificationId}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Redirect if the notification has an event ID
    if (notification.type === "EVENT" && notification.eventId) {
      router.push(`/dashboard/events/${notification.eventId}`);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Search Section */}
        <div className="flex items-center gap-4 flex-1">
          <form className="hidden lg:flex lg:flex-1 lg:max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-full pl-9 bg-muted/50 rounded-md shadow-sm"
              />
            </div>
          </form>
        </div>

        {/* Notification & User Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="info"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-lg shadow-md">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={loading || unreadCount === 0}
                >
                  Mark all as read
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {error ? (
                <div className="text-sm text-red-500 text-center py-4">{error}</div>
              ) : loading ? (
                <div className="text-sm text-center py-4 text-muted-foreground">
                  Loading notifications...
                </div>
              ) : notifications.length > 0 ? (
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={classNames(
                        "flex items-start gap-2 p-3 cursor-pointer rounded-lg",
                        { "bg-muted/50": !notification.read }
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {notification.type === "EVENT" ? (
                          <Calendar className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Bell className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-center py-4 text-muted-foreground">
                  No new notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={userImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        clientName
                      )}&backgroundColor=3b82f6`}
                      alt={clientName}
                    />
                    <AvatarFallback>
                      {clientName.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[200px] sm:w-[240px] rounded-md shadow-lg"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none truncate">
                    {clientName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Career Seeker
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
              <ProfileSettingDialog 
                  trigger={
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start px-2 font-normal"
                    >
                      Profile Settings
                    </Button>
                  }
                />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                  <CareerPlanDialog 
                    trigger={
                      <Button variant="ghost" className="w-full justify-start px-2 font-normal">
                        My Career Plan
                      </Button>
                    }
                  />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
              <ConsultationHistoryDialog 
                  trigger={
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start px-2 font-normal"
                    >
                      Consultations History
                    </Button>
                  }
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
              className="text-destructive focus:bg-destructive/10 cursor-pointer"
              onClick={handleLogout}
              disabled={isLoggingOut}
              >
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
