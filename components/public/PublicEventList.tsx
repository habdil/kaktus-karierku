'use client'

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, MapPin, ArrowUpRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Event } from "@/lib/types"
import { useEffect, useState } from "react"
import { EventListSkeleton } from "./event-list-skeleton"

interface PublicEventListProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function PublicEventList({ searchQuery, onSearchChange }: PublicEventListProps) {
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
    return <EventListSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Events</CardTitle>
        <CardDescription>Discover events open to everyone</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search events by title or location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card 
              key={event.id} 
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => router.push(`/events/${event.id}`)}
            >
              <div className="aspect-video relative">
                <Image
                  src={event.bannerUrl}
                  alt={event.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg truncate group-hover:text-primary-600 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>By {event.admin.fullName}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full mt-4 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors"
                >
                  View Details
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg font-medium text-muted-foreground">
              No events found
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or check back later for new events
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}