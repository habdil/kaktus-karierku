import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function EventListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Events</CardTitle>
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-[300px] mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-4 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}