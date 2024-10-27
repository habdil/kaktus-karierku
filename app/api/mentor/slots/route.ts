// app/api/mentor/slots/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getMentorSession } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Ambil semua slot mentor
export async function GET(request: Request) {
 try {
   const session = await getMentorSession();
   
   if (!session?.mentorId) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Unauthorized" 
       }, 
       { status: 401 }
     );
   }

   // Ambil query parameters
   const { searchParams } = new URL(request.url);
   const date = searchParams.get('date');
   const isBooked = searchParams.get('isBooked');
   const isRecurring = searchParams.get('isRecurring');

   // Buat query filter
   const where = {
     mentorId: session.mentorId,
     ...(date && {
       startTime: {
         gte: new Date(date),
         lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
       },
     }),
     ...(isBooked !== null && { isBooked: isBooked === 'true' }),
     ...(isRecurring !== null && { isRecurring: isRecurring === 'true' }),
     // Hanya tampilkan slot yang belum lewat
     startTime: {
       gte: new Date()
     }
   };

   // Ambil slots dengan consultations
   const slots = await prisma.consultationSlot.findMany({
     where,
     include: {
       consultations: {
         select: {
           id: true,
           status: true,
           client: {
             select: {
               fullName: true
             }
           }
         }
       }
     },
     orderBy: {
       startTime: 'asc'
     }
   });

   return NextResponse.json({
     success: true,
     data: slots
   });

 } catch (error) {
   console.error("Error fetching slots:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to fetch slots" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}

// POST: Buat slot baru
export async function POST(request: Request) {
 try {
   const session = await getMentorSession();
   
   if (!session?.mentorId) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Unauthorized" 
       }, 
       { status: 401 }
     );
   }

   const body = await request.json();
   const { 
     startTime, 
     endTime, 
     duration,
     maxBookings = 1,
     isRecurring = false,
     recurringDays = [],
     recurringUntil
   } = body;

   // Validasi input
   if (!startTime || !endTime || !duration) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Required fields missing" 
       }, 
       { status: 400 }
     );
   }

   const start = new Date(startTime);
   const end = new Date(endTime);

   // Validasi waktu
   if (start <= new Date() || start >= end) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Invalid time range" 
       }, 
       { status: 400 }
     );
   }

   // Cek overlap untuk non-recurring slots
   const existingSlot = await prisma.consultationSlot.findFirst({
     where: {
       mentorId: session.mentorId,
       OR: [
         {
           AND: [
             { startTime: { lte: start } },
             { endTime: { gt: start } }
           ]
         },
         {
           AND: [
             { startTime: { lt: end } },
             { endTime: { gte: end } }
           ]
         }
       ]
     }
   });

   if (existingSlot) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Time slot overlaps with existing slot" 
       }, 
       { status: 400 }
     );
   }

   // Buat array untuk bulk create jika recurring
   const slotsToCreate = [];

   // Base slot
   slotsToCreate.push({
     mentorId: session.mentorId,
     startTime: start,
     endTime: end,
     duration,
     maxBookings,
     isRecurring,
     recurringDays: isRecurring ? recurringDays : []
   });

   // Generate recurring slots jika diperlukan
   if (isRecurring && recurringUntil && recurringDays.length > 0) {
     const until = new Date(recurringUntil);
     let currentDate = new Date(start);
     
     while (currentDate <= until) {
       currentDate.setDate(currentDate.getDate() + 1);
       const dayOfWeek = currentDate.getDay();

       if (recurringDays.includes(dayOfWeek)) {
         const slotStart = new Date(currentDate);
         slotStart.setHours(start.getHours(), start.getMinutes());

         const slotEnd = new Date(currentDate);
         slotEnd.setHours(end.getHours(), end.getMinutes());

         slotsToCreate.push({
           mentorId: session.mentorId,
           startTime: slotStart,
           endTime: slotEnd,
           duration,
           maxBookings,
           isRecurring,
           recurringDays
         });
       }
     }
   }

   // Bulk create slots
   const createdSlots = await prisma.consultationSlot.createMany({
     data: slotsToCreate
   });

   return NextResponse.json({
     success: true,
     data: {
       count: createdSlots.count,
       message: `Created ${createdSlots.count} slot(s)`
     }
   });

 } catch (error) {
   console.error("Error creating slots:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to create slots",
       details: error instanceof Error ? error.message : "Unknown error"
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}