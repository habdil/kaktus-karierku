// components/mentor/EventList.tsx
"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Event } from "@/lib/types/index";

interface EventListProps {
    events: Event[];
    onViewDetail: (event: Event) => void;
  }

interface EventListProps {
  events: Event[];
  onViewDetail: (event: Event) => void;
}

export function MentorEventList({ events = [], onViewDetail }: EventListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Make sure events is always an array
  const eventArray = Array.isArray(events) ? events : [];

  const filteredEvents = eventArray.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Available Events</CardTitle>
            <CardDescription>
              Total Events: {eventArray.length}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={event.bannerUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{event.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(event.date)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {event.location}
                </p>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onViewDetail(event)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No events found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}