import prisma from "@/lib/prisma";
import { getMentorSession } from "@/lib/auth";

export async function getConsultationStats() {
  const session = await getMentorSession();
  if (!session) return null;

  const stats = await prisma.consultation.groupBy({
    by: ['status'],
    where: {
      mentorId: session.mentorId
    },
    _count: {
      status: true
    }
  });

  return {
    completed: stats.find(s => s.status === 'COMPLETED')?._count.status ?? 0,
    pending: stats.find(s => s.status === 'PENDING')?._count.status ?? 0,
    cancelled: stats.find(s => s.status === 'CANCELLED')?._count.status ?? 0
  };
}

export async function getRecentActivity() {
  const session = await getMentorSession();
  if (!session) return [];

  return await prisma.consultation.findMany({
    where: {
      mentorId: session.mentorId
    },
    include: {
      client: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  });
}

export async function getPendingRequests() {
  const session = await getMentorSession();
  if (!session) return [];

  return await prisma.consultation.findMany({
    where: {
      mentorId: session.mentorId,
      status: 'PENDING'
    },
    include: {
      client: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}