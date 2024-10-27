// lib/notification.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createEventNotification(eventId: string, eventTitle: string) {
  try {
    // Ambil semua mentor
    const mentors = await prisma.mentor.findMany({
      where: {
        status: 'ACTIVE' // Hanya mentor yang aktif
      },
      select: { id: true }
    });

    // Buat notifikasi untuk setiap mentor
    if (mentors.length > 0) {
      await prisma.notification.createMany({
        data: mentors.map(mentor => ({
          title: "New Event Available!",
          message: `Admin just posted a new event: "${eventTitle}"`,
          type: "EVENT",
          mentorId: mentor.id,
          eventId: eventId
        }))
      });
    }
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
}