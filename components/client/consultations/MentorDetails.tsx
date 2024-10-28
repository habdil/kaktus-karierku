// components/client/consultations/MentorDetails.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Calendar, Star, MapPin, Briefcase, GraduationCap, Clock, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface ConsultationSlot {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  isBooked: boolean;
}

interface Review {
  clientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface MentorDetails {
  id: string;
  fullName: string;
  education: string;
  company: string;
  jobRole: string;
  motivation: string | null;
  phoneNumber: string;
  maritalStatus: string | null;
  averageRating: number;
  totalRatings: number;
  availableSlots: ConsultationSlot[];
  reviews: Review[];
}

interface MentorDetailsProps {
  mentor: MentorDetails;
  onBookSlot: (slotId: string) => void;
}

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${
          rating >= star
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ))}
  </div>
);

export function MentorDetails({ mentor, onBookSlot }: MentorDetailsProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const filteredSlots = mentor.availableSlots.filter(slot => {
    const slotDate = new Date(slot.startTime);
    return (
      slotDate.getDate() === selectedDate.getDate() &&
      slotDate.getMonth() === selectedDate.getMonth() &&
      slotDate.getFullYear() === selectedDate.getFullYear() &&
      !slot.isBooked
    );
  });

  return (
    <>
      {/* Navigation Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center">
            <Link
              href="/dashboard/consultation"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Mentors
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Mentor Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">
                  {mentor.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div>
                  <CardTitle className="text-2xl">{mentor.fullName}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Briefcase className="mr-1 h-4 w-4" />
                    {mentor.jobRole} at {mentor.company}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <RatingStars rating={mentor.averageRating} />
                    <span className="ml-2 text-sm text-gray-500">
                      ({mentor.totalRatings} reviews)
                    </span>
                  </div>
                  <Badge variant="info">
                    {mentor.availableSlots.length} Available Slots
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-600">{mentor.motivation}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    <span>{mentor.education}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{mentor.company}</span>
                  </div>
                </div>
              </div>
              {/* Quick Stats or Additional Info */}
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <h3 className="font-semibold">Consultation Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Sessions</p>
                    <p className="font-medium">{mentor.totalRatings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average Rating</p>
                    <p className="font-medium">{mentor.averageRating.toFixed(1)} / 5.0</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">5+ years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Languages</p>
                    <p className="font-medium">English, Indonesia</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
                <CardDescription>
                  Select a time slot for your consultation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSlots.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => onBookSlot(slot.id)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          <div className="text-left">
                            <div className="font-medium">
                              {format(new Date(slot.startTime), 'HH:mm')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {slot.duration} minutes
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No available slots for the selected date
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mentor.reviews.map((review, index) => (
                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{review.clientName}</p>
                          <RatingStars rating={review.rating} />
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(review.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}