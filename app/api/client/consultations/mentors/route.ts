// app/api/client/consultations/mentors/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getClientSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getClientSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const specialty = searchParams.get('specialty') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build filters
    const whereClause: any = {
      status: 'ACTIVE',
      // Add search functionality
      OR: search ? [
        { fullName: { contains: search, mode: 'insensitive' } },
        { jobRole: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ] : undefined,
      // Add specialty filter if provided
      ...(specialty !== 'all' && specialty && { 
        jobRole: { contains: specialty, mode: 'insensitive' } 
      }),
    };

    // Get mentors with pagination
    const [mentors, total] = await Promise.all([
      prisma.mentor.findMany({
        where: whereClause,
        select: {
          id: true,
          fullName: true,
          education: true,
          company: true,
          jobRole: true,
          motivation: true,
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
            },
          },
          consultations: {
            select: {
              rating: true,
            },
            where: {
              rating: {
                not: null,
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.mentor.count({ where: whereClause }),
    ]);

    // Calculate average rating and available slots for each mentor
    const mentorsWithStats = mentors.map(mentor => {
      const ratings = mentor.consultations.map(c => c.rating as number);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : null;
      
      return {
        ...mentor,
        averageRating,
        totalRatings: ratings.length,
        availableSlotsCount: mentor.availableSlots.length,
        consultations: undefined, // Remove raw consultations data
      };
    });

    return NextResponse.json({
      mentors: mentorsWithStats,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error('[MENTORS_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}