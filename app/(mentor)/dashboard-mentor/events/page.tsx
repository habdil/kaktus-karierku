// app/(mentor)/dashboard-mentor/events/page.tsx
"use client";

import { useState, useEffect } from "react";
import { MentorEventList } from "@/components/mentor/EventList";
import { EventDetail } from "@/components/mentor/EventDetail";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Event } from "@/lib/types";

export default function MentorEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/mentor/events');
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
        
        // Update selectedEvent jika ada
        if (selectedEvent) {
          const updatedEvent = data.data.find(
            (event: Event) => event.id === selectedEvent.id
          );
          if (updatedEvent) {
            setSelectedEvent(updatedEvent);
          }
        }
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

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, []);

  // Polling setiap 10 detik
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEvents();
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedEvent]); // Tambahkan selectedEvent sebagai dependency

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

  // Handler untuk view detail dengan validasi
  const handleViewDetail = (event: Event) => {
    // Cek apakah event masih ada di daftar events
    const currentEvent = events.find(e => e.id === event.id);
    if (currentEvent) {
      setSelectedEvent(currentEvent);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Event not found or has been deleted"
      });
      setSelectedEvent(null);
    }
  };

  return (
    <div className="p-6">
      {selectedEvent ? (
        <EventDetail 
          event={selectedEvent}
          onBack={() => {
            setSelectedEvent(null);
            // Refresh data saat kembali ke list
            fetchEvents();
          }}
        />
      ) : (
        <MentorEventList
          events={events}
          onViewDetail={handleViewDetail}
        />
      )}
    </div>
  );
}