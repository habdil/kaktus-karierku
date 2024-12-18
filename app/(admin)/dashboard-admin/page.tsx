// app/(admin)/dashboard-admin/page.tsx
"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewCards } from "@/components/admin/dashboard/OverviewCards";
import { RecentActivitiesList, type RecentActivity } from "@/components/admin/dashboard/RecentActivitiesList";
import { UserGrowthChart } from "@/components/admin/dashboard/UserGrowthChart";
import { ExportButton } from "@/components/admin/dashboard/ExportButton";
import { LoadingBars } from "@/components/ui/loading-bars";
import { useDashboardData } from "@/hooks/useDashboardData";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MentorActivities } from "@/components/admin/dashboard/MentorActivities";

export default function AdminDashboardPage() {
  const { analytics, activities, isLoading, isError } = useDashboardData();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingBars text="Loading dashboard data..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-6">
          <div className="text-center space-y-2">
            <p className="text-destructive text-lg font-semibold">Failed to load dashboard data</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const transformActivities = (): RecentActivity[] => {
    if (!activities) return [];

    const transformedActivities: RecentActivity[] = [
      ...activities.recentUsers.map((user): RecentActivity => ({
        id: user.id,
        type: "user",
        title: user.client?.fullName || user.mentor?.fullName || user.email,
        description: "New user registered",
        timestamp: new Date(user.createdAt)
      })),
      ...activities.recentConsultations.map((consultation): RecentActivity => ({
        id: consultation.id,
        type: "consultation",
        title: `${consultation.client.fullName} - ${consultation.mentor.fullName}`,
        description: `Consultation ${consultation.status.toLowerCase()}`,
        timestamp: new Date(consultation.createdAt)
      })),
      ...activities.recentEvents.map((event): RecentActivity => ({
        id: event.id,
        type: "event",
        title: event.title,
        description: `Event created by ${event.admin.fullName}`,
        timestamp: new Date(event.createdAt)
      }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return transformedActivities;
  };

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary-900">
            Dashboard Overview
          </h2>
          <p className="text-muted-foreground mt-1">
            Welcome back, Admin! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <ExportButton 
            onExport={async () => {
              console.log("Exporting data...");
            }} 
          />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
        <Suspense fallback={<LoadingBars text="Loading overview cards..." />}>
          {analytics && <OverviewCards analytics={analytics.overview} />}
        </Suspense>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg font-semibold">User Growth Trends</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Suspense fallback={<LoadingBars text="Loading user growth data..." />}>
                  {analytics && (
                    <UserGrowthChart 
                      data={analytics.userGrowth.map(item => ({
                        date: new Date(item.createdAt).toLocaleDateString(),
                        count: item._count.id
                      }))} 
                    />
                  )}
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full w-full">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Suspense fallback={<LoadingBars text="Loading recent activities..." />}>
                  {activities && (
                    <RecentActivitiesList 
                      activities={transformActivities()}
                    />
                  )}
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <div>
            <Suspense fallback={<LoadingBars text="Loading mentor activities..." />}>
              <MentorActivities />
            </Suspense>
          </div>
        </div>
      </TabsContent>
    </Tabs>
    </div>
  );
}