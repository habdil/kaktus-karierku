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
import { PlusCircle } from "lucide-react";

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

  const navigateToMentors = () => {
    window.location.href = "/dashboard/consultation/available-mentors";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingBars />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">My Consultations</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
          <Button 
            onClick={navigateToMentors}
            className="flex items-center justify-center gap-2 text-white w-full sm:w-auto"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Find a Mentor</span>
          </Button>
        </div>
      </div>

      {filteredConsultations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No consultations found</p>
          <Button 
            onClick={navigateToMentors}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Start a New Consultation
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <ConsultationList consultations={filteredConsultations} />
        </div>
      )}
    </div>
  );
}