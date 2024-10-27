// app/(client)/dashboard/events/[eventId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { EventDetail } from "@/components/client/events/EventDetail";
import { useToast } from "@/hooks/use-toast";

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/client/events/${params.eventId}`);
        const data = await response.json();

        if (data.success) {
          setEvent(data.data);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event details"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [params.eventId, toast]);

  return (
    <div className="p-6">
      <EventDetail 
        event={event}
        isLoading={isLoading}
      />
    </div>
  );
}