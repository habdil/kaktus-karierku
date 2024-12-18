// app/(mentor)/dashboard-mentor/clients/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { LoadingBars } from "@/components/ui/loading-bars";
import ClientList from "@/components/mentor/listClient/ClientList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  AlertCircle, 
  Users, 
  RefreshCcw 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Client } from "@/lib/types/client";

export default function MentorClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [refreshing, setRefreshing] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      
      const res = await fetch(`/api/mentor/clients?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
      setClients(data);
    } catch (error) {
      toast({
        title: "Error loading clients",
        description: error instanceof Error ? error.message : "Failed to load clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [debouncedSearch, statusFilter, toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchClients();
  };

  const clientStats = {
    total: clients.length,
    new: clients.filter(c => c.mentorshipStatus === 'NEW').length,
    inProgress: clients.filter(c => c.mentorshipStatus === 'IN_PROGRESS').length,
    completed: clients.filter(c => c.mentorshipStatus === 'COMPLETED').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
              <LoadingBars />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Client Management</h1>
            <p className="text-muted-foreground">
              Manage and monitor your client relationships
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="icon"
            disabled={refreshing}
          >
            <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientStats.total}</div>
            </CardContent>
          </Card>
          {/* Tambahkan card statistik lainnya disini */}
        </div>
      </div>

      <div className="flex items-center gap-4 flex-col sm:flex-row">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, major..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-10">
          <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No clients found</h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== 'ALL' 
              ? "Try adjusting your filters"
              : "You don't have any clients yet"}
          </p>
        </div>
      ) : (
        <ClientList clients={clients} onStatusChange={fetchClients} />
      )}
    </div>
  );
}