// app/(mentor)/dashboard-mentor/events/[eventId]/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Event } from "@/lib/types";

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/mentor/events/${params.eventId}`);
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
        router.push('/dashboard-mentor/events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [params.eventId, router, toast]);

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent className="space-y-8">
            <Skeleton className="h-[300px] w-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6">
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-lg font-medium">Event not found</p>
            <Button
              variant="link"
              onClick={() => router.push('/dashboard-mentor/events')}
              className="mt-4"
            >
              Back to Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <Button 
            variant="ghost" 
            className="w-fit mb-4"
            onClick={() => router.push('/dashboard-mentor/events')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Posted by {event.admin.fullName}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Banner Image */}
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <Image
              src={event.bannerUrl}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Event Info Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {event.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">About This Event</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}