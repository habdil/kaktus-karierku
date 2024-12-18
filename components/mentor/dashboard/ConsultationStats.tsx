// components/mentor/dashboard/ConsultationStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getConsultationStats } from "@/lib/dashboard";
import { CheckCircle, Clock, XCircle } from "lucide-react";

type Stats = {
  completed: number;
  pending: number;
  cancelled: number;
} | null;

export async function ConsultationStats() {
  const stats = await getConsultationStats() as Stats;

  // Default values if stats is null
  const defaultStats = {
    completed: 0,
    pending: 0,
    cancelled: 0
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayStats.completed}</div>
          <p className="text-xs text-muted-foreground">
            Successfully completed consultations
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayStats.pending}</div>
          <p className="text-xs text-muted-foreground">
            Awaiting response or schedule
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayStats.cancelled}</div>
          <p className="text-xs text-muted-foreground">
            Cancelled consultations
          </p>
        </CardContent>
      </Card>
    </div>
  );
}