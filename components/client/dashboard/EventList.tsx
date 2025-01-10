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
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 sm:px-6 py-4 border-b">
        <CardTitle className="text-lg sm:text-xl font-semibold text-blue-500">
          Upcoming Events
        </CardTitle>
        <Link href="/dashboard/events">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-blue-500 hover:text-blue-600 hover:bg-transparent px-2 sm:px-4"
          >
            <span className="hidden sm:inline">View All Events</span>
            <span className="sm:hidden">View All</span>
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {events.length > 0 ? (
            events.map((event) => (
              <Link 
                key={event.id} 
                href={`/dashboard/events/${event.id}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <article className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Image container */}
                    <div className="relative w-full sm:w-48 h-48 sm:h-32 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={event.bannerUrl}
                        alt={event.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 192px"
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {event.title}
                      </h3>
                      
                      {/* Date and Location */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <time dateTime={event.date} className="whitespace-normal">
                            {formatEventDate(event.date)}
                          </time>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="break-words">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <p className="text-gray-500 mb-4">
                No upcoming events available at the moment
              </p>
              <Link href="/dashboard/events">
                <Button variant="outline" size="sm">
                  Browse All Events
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}