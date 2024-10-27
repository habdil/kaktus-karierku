// app/(mentor)/dashboard/events/page.tsx
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/mentor/events');
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

    fetchEvents();
  }, [toast]);

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
      {selectedEvent ? (
        <EventDetail 
          event={selectedEvent}
          onBack={() => setSelectedEvent(null)}
        />
      ) : (
        <MentorEventList
          events={events}
          onViewDetail={setSelectedEvent}
        />
      )}
    </div>
  );
}