"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EventList } from "@/components/admin/EventList";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  location: string;
  date: string;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load events
  const loadEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load events"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadEvents();
  }, []);

  // Handle add new
  const handleAddNew = () => {
    router.push('/dashboard-admin/events/add');
  };

  // Handle edit
  const handleEdit = (event: Event) => {
    router.push(`/dashboard-admin/events/${event.id}/edit`);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      setDeletingEventId(id);
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        await loadEvents(); // Reload events after delete
        toast({
          title: "Success",
          description: "Event deleted successfully"
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete event"
      });
    } finally {
      setDeletingEventId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <EventList
        events={events}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingEventId={deletingEventId}
      />
    </div>
  );
}