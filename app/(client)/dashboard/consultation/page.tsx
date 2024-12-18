// app/(client)/dashboard/consultation/page.tsx
"use client";

import { useState, useEffect } from "react";
import ConsultationList from "@/components/client/consultations/ConsultationList";
import { ConsultationDetails } from "@/lib/types/consultations";
import { useToast } from "@/hooks/use-toast";
import { LoadingBars } from "@/components/ui/loading-bars";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConsultationSSE } from "@/hooks/useConsultationSSE";

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<ConsultationDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/client/consultations");
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
    endpoint: "/api/client/consultations",
    userType: "CLIENT",
    setConsultations,
    fetchConsultations
  });

  useEffect(() => {
    fetchConsultations();
  }, []);

  const filteredConsultations = consultations.filter((consultation) => {
    if (filter === "all") return true;
    return consultation.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingBars />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Consultations</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredConsultations.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No consultations found</p>
          <Button
            className="mt-4"
            onClick={() => (window.location.href = "/dashboard/consultation/available-mentors")}
          >
            Find a Mentor
          </Button>
        </div>
      ) : (
        <ConsultationList consultations={filteredConsultations} />
      )}
    </div>
  );
}