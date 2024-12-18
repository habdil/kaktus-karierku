// app/(mentor)/dashboard-mentor/consultation/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConsultationList from "@/components/mentor/consultations/ConsultationList";
import { ConsultationDetails } from "@/lib/types/consultations";
import { useToast } from "@/hooks/use-toast";
import { LoadingBars } from "@/components/ui/loading-bars";
import { Button } from "@/components/ui/button";
import { Video, Clock, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SlotManagementDialog from "@/components/mentor/consultations/SlotManagementDialog";
import { useConsultationSSE } from "@/hooks/useConsultationSSE";

export default function MentorConsultationsPage() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<ConsultationDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const { toast } = useToast();

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/mentor/consultations");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setConsultations(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load consultations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useConsultationSSE({
    endpoint: "/api/mentor/consultations",
    userType: "MENTOR",
    setConsultations,
    fetchConsultations
  });

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/mentor/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Refresh consultations after status change
      fetchConsultations();

      toast({
        title: "Success",
        description: "Consultation status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleAddZoomLink = async (id: string, zoomLink: string) => {
    try {
      const res = await fetch(`/api/mentor/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zoomLink }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Update local state
      setConsultations(prev =>
        prev.map(c => c.id === id ? { ...c, zoomLink } : c)
      );

      toast({
        title: "Success",
        description: "Zoom link added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add Zoom link",
        variant: "destructive",
      });
    }
  };

  const getFilteredConsultations = () => {
    const now = new Date();
    switch (activeTab) {
      case "upcoming":
        return consultations.filter(
          c => c.startTime && new Date(c.startTime) > now
        );
      case "past":
        return consultations.filter(
          c => c.status === "COMPLETED" || (c.startTime && new Date(c.startTime) < now)
        );
      default:
        return consultations;
    }
  };

  const getActiveConsultation = () => {
    return consultations.find(c => c.status === "ACTIVE");
  };

  const getUpcomingConsultation = () => {
    const now = new Date();
    return consultations.find(
      c => c.startTime && new Date(c.startTime) > now && c.status === "PENDING"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingBars />
      </div>
    );
  }

  const activeConsultation = getActiveConsultation();
  const upcomingConsultation = getUpcomingConsultation();
  const filteredConsultations = getFilteredConsultations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Consultations</h1>
        <div className="flex items-center gap-2">
          <SlotManagementDialog />
          {activeConsultation && (
            <Button
              onClick={() => router.push(`/dashboard-mentor/consultation/${activeConsultation.id}`)}
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Manage Active Session
            </Button>
          )}
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Consultation Card */}
        <Card className={activeConsultation ? "border-primary" : undefined}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Active Consultation
            </CardTitle>
            <CardDescription>Currently ongoing session</CardDescription>
          </CardHeader>
          <CardContent>
            {activeConsultation ? (
              <div className="space-y-2">
                <p className="font-medium">{activeConsultation.client.fullName}</p>
                {activeConsultation.startTime && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Started at {new Date(activeConsultation.startTime).toLocaleTimeString()}
                  </div>
                )}
                <Button 
                  className="w-full mt-2"
                  onClick={() => router.push(`/dashboard-mentor/consultation/${activeConsultation.id}`)}
                >
                  Manage Session
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">No active consultation</p>
            )}
          </CardContent>
        </Card>

        {/* Next Upcoming Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Next Consultation
            </CardTitle>
            <CardDescription>Your next scheduled session</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingConsultation ? (
              <div className="space-y-2">
                <p className="font-medium">{upcomingConsultation.client.fullName}</p>
                {upcomingConsultation.startTime && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Starts at {new Date(upcomingConsultation.startTime).toLocaleTimeString()}
                  </div>
                )}
                <Badge variant="outline">Pending</Badge>
              </div>
            ) : (
              <p className="text-muted-foreground">No upcoming consultations</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs and List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredConsultations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No consultations found</p>
                <p className="text-muted-foreground">
                  {activeTab === "upcoming"
                    ? "You don't have any upcoming consultations scheduled."
                    : "You don't have any past consultations."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <ConsultationList
              consultations={filteredConsultations}
              onStatusChange={handleStatusChange}
              onAddZoomLink={handleAddZoomLink}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}