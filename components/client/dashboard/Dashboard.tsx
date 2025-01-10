"use client";

import { useState, useEffect } from "react";
import GreetingCard from "@/components/client/dashboard/GreetingCards";
import EventList from "@/components/client/dashboard/EventList";
import CareerRecommendation from "@/components/client/dashboard/CareerRecommendation";
import { useToast } from "@/hooks/use-toast";
import { LoadingBars } from "@/components/ui/loading-bars";

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

interface DashboardProps {
  clientName: string;
}

export default function ClientDashboard({ clientName }: DashboardProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/client/events');
        const data = await response.json();

        if (data.success) {
          const upcomingEvents = data.data
            .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 3);
          setEvents(upcomingEvents);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat events"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
        <LoadingBars text="Mengunduh data..." />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-1 gap-6 lg:gap-8">
          {/* Greeting Section - Full Width */}
          <section className="col-span-1">
            <GreetingCard clientName={clientName} />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Career Recommendation Section */}
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <CareerRecommendation />
            </aside>

            {/* Events Section */}
            <section className="lg:col-span-2 order-1 lg:order-2">
              <EventList events={events} />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}