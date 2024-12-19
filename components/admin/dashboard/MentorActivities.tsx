// components/admin/dashboard/MentorActivities.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface MentorActivity {
  id: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  mentor: {
    fullName: string;
    company: string;
    jobRole: string;
    status: "ACTIVE" | "INACTIVE";
  };
  client: {
    fullName: string;
    major: string | null;
  };
}

export function MentorActivities() {
  const [activities, setActivities] = useState<MentorActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/admin/dashboard/mentor");
        if (!response.ok) throw new Error("Failed to fetch activities");
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      ACTIVE: "bg-green-100 text-green-800 border-green-200",
      COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Mentor Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48 text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Mentor Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 max-h-[500px] overflow-auto custom-scrollbar pr-4">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start space-x-4 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className="bg-primary/10">
                  {getInitials(activity.mentor.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold truncate">
                    {activity.mentor.fullName}
                  </p>
                  <Badge 
                    variant="outline"
                    className={`${getStatusColor(activity.status)} shrink-0`}
                  >
                    {activity.status.toLowerCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  Consultation with {activity.client.fullName}
                  {activity.client.major && ` • ${activity.client.major}`}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <span className="truncate">{activity.mentor.jobRole}</span>
                  <span>•</span>
                  <span className="truncate">{activity.mentor.company}</span>
                  <span>•</span>
                  <time className="shrink-0">
                    {formatDistanceToNow(new Date(activity.createdAt), { 
                      addSuffix: true 
                    })}
                  </time>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}