// components/mentor/dashboard/ClientActivity.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ConsultationStatus } from "@prisma/client";
import { getRecentActivity } from "@/lib/dashboard";

// Define types for activity data
type ActivityData = {
  id: string;
  status: ConsultationStatus;
  createdAt: Date;
  client: {
    user: {
      id: string;
      name: string | null;
    };
    fullName: string;
  };
};

export async function ClientActivity() {
  const activities = await getRecentActivity() as ActivityData[];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 rounded-lg border p-3"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.client.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.status}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}