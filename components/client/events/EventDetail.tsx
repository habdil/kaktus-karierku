// components/client/events/EventDetail.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

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

interface EventDetailProps {
  event: Event | null;
  isLoading: boolean;
}

export function EventDetail({ event, isLoading }: EventDetailProps) {
  const router = useRouter();

  if (isLoading) {
    return (
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
    );
  }

  if (!event) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <p className="text-lg font-medium">Event not found</p>
          <Button
            variant="link"
            onClick={() => router.push('/dashboard/events')}
            className="mt-4"
          >
            Back to Events
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Button 
          variant="ghost" 
          className="w-fit mb-4"
          onClick={() => router.push('/dashboard/events')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
        <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
        <div className="flex items-center gap-2 text-muted-foreground mt-2">
          <User className="h-4 w-4" />
          <span>Posted by {event.admin.fullName}</span>
        </div>
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
  );
}