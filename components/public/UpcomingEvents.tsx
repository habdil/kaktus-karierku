'use client'

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { formatDate } from "@/lib/utils"
import { Event } from "@/lib/types"
import { useEffect, useState } from "react"
import { UpcomingEventSkeleton } from "./upcoming-event-skeleton"

export function UpcomingEvents() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      const response = await fetch("/api/public/events")
      const data = await response.json()
      if (data.success) {
        setEvents(data.data)
      }
      setLoading(false)
    }
    fetchEvents()
  }, [])

  if (loading) {
    return <UpcomingEventSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Event Mendatang</h2>
          <p className="text-muted-foreground">Jangan lewatkan event-event menarik dari kami</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/events')}>
          Lihat Semua
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {events.map((event) => (
            <CarouselItem key={event.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card 
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/events/${event.id}`)}
              >
                <div className="aspect-[16/9] relative">
                  <Image
                    src={event.bannerUrl}
                    alt={event.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-semibold text-lg truncate group-hover:text-primary-400 transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}