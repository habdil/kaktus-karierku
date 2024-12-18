// components/mentor/listClient/ClientList.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  GraduationCap,
  Clock,
  Bell,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Client {
  id: string;
  fullName: string;
  email: string;
  image: string | null;
  major: string | null;
  currentStatus: string | null;
  dreamJob: string | null;
  mentorshipStatus: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
  lastConsultation?: {
    id: string;
    status: string;
    createdAt: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  recentNotifications: Array<{
    id: string;
    title: string;
    message: string;
    createdAt: string;
  }>;
  joinedDate: string;
}

interface ClientListProps {
  clients: Client[];
  onStatusChange?: () => void;
}

export default function ClientList({ clients, onStatusChange }: ClientListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const statusColors = {
      NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      IN_PROGRESS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      NEW: <AlertCircle className="h-4 w-4" />,
      IN_PROGRESS: <Clock className="h-4 w-4" />,
      COMPLETED: <CheckCircle2 className="h-4 w-4" />,
    };
    return icons[status as keyof typeof icons];
  };

  const handleStatusChange = async (clientId: string, newStatus: string) => {
    try {
      setUpdatingStatus(clientId);
      const res = await fetch("/api/mentor/clients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      toast({
        title: "Status Updated",
        description: `Client status has been updated to ${newStatus.replace('_', ' ')}`,
      });

      onStatusChange?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update client status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewProfile = (clientId: string) => {
    router.push(`/dashboard-mentor/clients/${clientId}`);
  };

  const handleStartConsultation = (clientId: string) => {
    router.push(`/dashboard-mentor/consultation/${clientId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => (
        <Card 
          key={client.id} 
          className="hover:shadow-md transition-shadow duration-200"
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={client.image || undefined} alt={client.fullName} />
                        <AvatarFallback>{client.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Joined {formatDistanceToNow(new Date(client.joinedDate))} ago</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div>
                  <CardTitle className="text-lg font-semibold">{client.fullName}</CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    {client.email}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge 
                className={`${getStatusColor(client.mentorshipStatus)} flex items-center gap-1`}
              >
                {getStatusIcon(client.mentorshipStatus)}
                {client.mentorshipStatus.replace('_', ' ')}
              </Badge>
              {client.lastConsultation && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline">
                        Last Session: {formatDistanceToNow(new Date(client.lastConsultation.createdAt))} ago
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{format(new Date(client.lastConsultation.createdAt), 'PPP')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <div className="space-y-2">
              {client.major && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  {client.major}
                </div>
              )}
              {client.dreamJob && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  {client.dreamJob}
                </div>
              )}
            </div>

            {client.recentNotifications?.length > 0 && (
              <div className="border-t pt-3">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Bell className="h-4 w-4" />
                  Recent Activity
                </div>
                <div className="space-y-1">
                  {client.recentNotifications.slice(0, 2).map((notification) => (
                    <p key={notification.id} className="text-sm text-muted-foreground truncate">
                      {notification.title}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button 
                className="flex-1 text-white" 
                onClick={() => handleViewProfile(client.id)}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}