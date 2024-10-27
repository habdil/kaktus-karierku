'use client'

import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Event } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { EventDetailSkeleton } from "./event-detail-skeleton"

interface PublicEventDetailProps {
  eventId: string
}

export function PublicEventDetail({ eventId }: PublicEventDetailProps) {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true)
      const response = await fetch(`/api/public/events/${eventId}`)
      const data = await response.json()
      if (data.success) {
        setEvent(data.data)
      }
      setLoading(false)
    }
    fetchEvent()
  }, [eventId])

  if (loading) {
    return <EventDetailSkeleton />
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium text-muted-foreground">
          Event not found
        </p>
      </div>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <Button 
          variant="ghost" 
          className="w-fit mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
        <CardTitle className="text-2xl">{event.title}</CardTitle>
        <CardDescription>
          Posted by {event.admin.fullName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Banner Image */}
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <Image
            src={event.bannerUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Event Info */}
        <div className="grid gap-4">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Date & Time</h3>
            <p className="text-lg">{formatDate(event.date)}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Location</h3>
            <p className="text-lg">{event.location}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Description</h3>
            <p className="text-lg whitespace-pre-wrap">{event.description}</p>
          </div>
        </div>

        {/* Additional Info or Actions */}
        <div className="pt-6 border-t">
          <p className="text-sm text-muted-foreground">
            * For any inquiries about this event, please contact the event organizer.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}