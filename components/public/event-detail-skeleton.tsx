import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function EventDetailSkeleton() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <Skeleton className="h-10 w-[100px] mb-4" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="aspect-video w-full" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          ))}
        </div>
        <div className="pt-6 border-t">
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}