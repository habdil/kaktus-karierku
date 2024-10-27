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
import { useDebounce } from "@/hooks/useDebounce" // Assume this hook exists

interface PublicEventListProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

interface PaginationMetadata {
  currentPage: number
  totalPages: number
  pageSize: number
  totalEvents: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export function PublicEventList({ searchQuery, onSearchChange }: PublicEventListProps) {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedSearch = useDebounce(searchQuery, 500)

  const fetchEvents = async (page: number, search?: string) => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams({
        page: String(page),
        pageSize: "9", // Matches grid layout
        ...(search && { search }),
        showPast: "false" // Only show upcoming events
      })

      const response = await fetch(`/api/public/events?${queryParams}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch events")
      }

      if (data.success) {
        setEvents(data.data)
        setPagination(data.pagination)
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch events when page or search changes
  useEffect(() => {
    fetchEvents(currentPage, debouncedSearch)
  }, [currentPage, debouncedSearch])

  if (loading && !events.length) {
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

        {error && (
          <div className="text-center py-4 text-red-500">
            {error}
          </div>
        )}

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

        {/* Pagination */}
        {pagination && (
          <div className="mt-6 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={!pagination.hasPreviousPage}
            >
              Previous
            </Button>
            <span className="py-2 px-4">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </Button>
          </div>
        )}

        {events.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-lg font-medium text-muted-foreground">
              No events found
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery 
                ? "Try adjusting your search criteria"
                : "Check back later for new events"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}