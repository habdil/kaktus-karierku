// app/api/client/consultations/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, ConsultationStatus } from "@prisma/client";
import { getClientSession } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Ambil semua konsultasi client
export async function GET(request: Request) {
 try {
   const session = await getClientSession();
   
   if (!session?.clientId) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Unauthorized" 
       }, 
       { status: 401 }
     );
   }

   // Ambil query parameters untuk filter
   const { searchParams } = new URL(request.url);
   const status = searchParams.get('status') as ConsultationStatus | undefined;
   const mentorId = searchParams.get('mentorId');

   // Buat base query
   const where = {
     clientId: session.clientId,
     ...(status && { status }),
     ...(mentorId && { mentorId })
   };

   // Ambil konsultasi dengan relasi
   const consultations = await prisma.consultation.findMany({
     where,
     include: {
       mentor: {
         select: {
           fullName: true,
           education: true,
           company: true,
           jobRole: true
         }
       },
       slot: true,
       messages: {
         orderBy: {
           createdAt: 'desc'
         },
         take: 1 // Ambil pesan terakhir saja
       },
       _count: {
         select: {
           messages: true
         }
       }
     },
     orderBy: [
       {
         status: 'asc' // PENDING & ACTIVE first
       },
       {
         slot: {
           startTime: 'desc'
         }
       }
     ]
   });

   return NextResponse.json({
     success: true,
     data: consultations
   });

 } catch (error) {
   console.error("Error fetching consultations:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to fetch consultations" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}

// POST: Buat konsultasi baru (booking)
export async function POST(request: Request) {
 try {
   const session = await getClientSession();
   
   if (!session?.clientId) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Unauthorized" 
       }, 
       { status: 401 }
     );
   }

   const body = await request.json();
   const { mentorId, slotId } = body;

   // Validasi input
   if (!mentorId || !slotId) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Missing required fields" 
       }, 
       { status: 400 }
     );
   }

   // Cek slot tersedia
   const slot = await prisma.consultationSlot.findUnique({
     where: {
       id: slotId,
       mentorId: mentorId,
       isBooked: false,
       startTime: {
         gt: new Date() // Pastikan slot belum lewat
       }
     }
   });

   if (!slot) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Slot not available" 
       }, 
       { status: 400 }
     );
   }

   // Cek apakah client sudah memiliki konsultasi aktif dengan mentor yang sama
   const existingConsultation = await prisma.consultation.findFirst({
     where: {
       clientId: session.clientId,
       mentorId: mentorId,
       status: {
         in: ['PENDING', 'ACTIVE']
       }
     }
   });

   if (existingConsultation) {
     return NextResponse.json(
       { 
         success: false, 
         error: "You already have an active consultation with this mentor" 
       }, 
       { status: 400 }
     );
   }

   // Create consultation dalam transaction
   const result = await prisma.$transaction(async (tx) => {
     // 1. Create consultation
     const consultation = await tx.consultation.create({
       data: {
         clientId: session.clientId,
         mentorId: mentorId,
         slotId: slotId,
         status: ConsultationStatus.PENDING
       },
       include: {
         mentor: {
           select: {
             fullName: true,
             // email: true
           }
         },
         slot: true
       }
     });

     // 2. Update slot status
     await tx.consultationSlot.update({
       where: {
         id: slotId
       },
       data: {
         isBooked: true
       }
     });

     return consultation;
   });

   // Notification bisa ditambahkan di sini
   // await sendNotificationToMentor(result.mentor.email, {
   //   type: 'NEW_CONSULTATION',
   //   consultationId: result.id,
   //   clientName: session.user.name
   // });

   return NextResponse.json({
     success: true,
     data: result
   });

 } catch (error) {
   console.error("Error creating consultation:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to create consultation",
       details: error instanceof Error ? error.message : "Unknown error"
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}