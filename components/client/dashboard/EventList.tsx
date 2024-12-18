// src/components/client/dashboard/EventList.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

interface EventListProps {
  events: Event[];
}

export default function EventList({ events }: EventListProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg sm:text-xl">Upcoming Events</CardTitle>
        <Link href="/dashboard/events">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            View All
          </Button>
          <Button variant="ghost" size="sm" className="sm:hidden">
            All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="grid gap-4">
        {events.length > 0 ? (
          events.map((event) => (
            <Link 
              key={event.id} 
              href={`/dashboard/events/${event.id}`}
              className="group"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-lg border bg-card transition-colors hover:bg-accent">
                <div className="relative w-full sm:w-36 h-48 sm:h-24 rounded-md overflow-hidden">
                  <Image
                    src={event.bannerUrl}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 144px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                  <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h4>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {new Date(event.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-2">No upcoming events</p>
            <Link href="/dashboard/events">
              <Button variant="outline" size="sm">
                Browse All Events
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}