// app/(client)/dashboard/events/page.tsx
"use client";

import { useState, useEffect } from "react";
import { EventList } from "@/components/client/events/EventList";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  location: string;
  date: string;
  admin: {
    fullName: string;
  };
}

export default function EventsClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/client/events');
        const data = await response.json();

        if (data.success) {
          setEvents(data.data);
          setFilteredEvents(data.data);
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  return (
    <div className="p-6">
      <EventList
        events={filteredEvents}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
      />
    </div>
  );
}