// app/client/dashboard/consultation/[mentorId]/page.tsx
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getClientSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { MentorDetails } from '@/components/client/consultations/MentorDetails';

interface PageProps {
  params: {
    mentorId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const mentor = await prisma.mentor.findUnique({
    where: { id: params.mentorId },
    select: { fullName: true },
  });

  return {
    title: mentor ? `Book Consultation with ${mentor.fullName}` : 'Mentor Not Found',
  };
}

export default async function MentorDetailsPage({ params }: PageProps) {
  const session = await getClientSession();
  
  if (!session) {
    redirect('/login');
  }

  const mentor = await prisma.mentor.findUnique({
    where: { id: params.mentorId },
    select: {
      id: true,
      fullName: true,
      education: true,
      company: true,
      jobRole: true,
      motivation: true,
      phoneNumber: true,
      maritalStatus: true,
      availableSlots: {
        where: {
          isBooked: false,
          startTime: {
            gte: new Date(),
          },
        },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          duration: true,
          isBooked: true,
        },
        orderBy: {
          startTime: 'asc',
        },
      },
      consultations: {
        where: {
          status: 'COMPLETED',
          rating: { not: null },
          review: { not: null },
        },
        select: {
          rating: true,
          review: true,
          client: {
            select: {
              fullName: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      },
    },
  });

  if (!mentor) {
    redirect('/dashboard/consultation');
  }

  // Calculate average rating
  const ratings = mentor.consultations.map(c => c.rating as number);
  const averageRating = ratings.length > 0 
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
    : 0;

  // Format reviews
  const reviews = mentor.consultations.map(consultation => ({
    clientName: consultation.client.fullName,
    rating: consultation.rating as number,
    comment: consultation.review as string,
    createdAt: consultation.createdAt.toISOString(),
  }));

  const mentorData = {
    ...mentor,
    averageRating,
    totalRatings: ratings.length,
    reviews,
    availableSlots: mentor.availableSlots.map(slot => ({
      ...slot,
      startTime: slot.startTime.toISOString(),
      endTime: slot.endTime.toISOString(),
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <MentorDetails 
        mentor={mentorData}
        onBookSlot={async (slotId: string) => {
          'use server';
          // Handle booking logic here
          console.log('Booking slot:', slotId);
        }}
      />
    </div>
  );
}