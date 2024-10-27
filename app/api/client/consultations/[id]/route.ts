// app/api/client/consultations/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, ConsultationStatus } from "@prisma/client";
import { getClientSession } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Ambil detail konsultasi spesifik
export async function GET(
 request: Request,
 { params }: { params: { id: string } }
) {
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

   const consultation = await prisma.consultation.findUnique({
     where: {
       id: params.id,
       clientId: session.clientId // Pastikan konsultasi milik client ini
     },
     include: {
       mentor: {
         select: {
           fullName: true,
           education: true,
           company: true,
           jobRole: true,
           motivation: true
         }
       },
       slot: true,
       messages: {
         orderBy: {
           createdAt: 'desc'
         },
         include: {
         }
       },
       attachments: true
     }
   });

   if (!consultation) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Consultation not found" 
       }, 
       { status: 404 }
     );
   }

   return NextResponse.json({
     success: true,
     data: consultation
   });

 } catch (error) {
   console.error("Error fetching consultation:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to fetch consultation" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}

// PATCH: Update konsultasi (rating, review, etc)
export async function PATCH(
 request: Request,
 { params }: { params: { id: string } }
) {
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
   const { rating, review } = body;

   // Validasi rating
   if (rating && (rating < 1 || rating > 5)) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Rating must be between 1 and 5" 
       }, 
       { status: 400 }
     );
   }

   // Cek konsultasi
   const consultation = await prisma.consultation.findUnique({
     where: {
       id: params.id,
       clientId: session.clientId
     }
   });

   if (!consultation) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Consultation not found" 
       }, 
       { status: 404 }
     );
   }

   // Hanya bisa review konsultasi yang sudah selesai
   if (consultation.status !== 'COMPLETED' && (rating || review)) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Can only review completed consultations" 
       }, 
       { status: 400 }
     );
   }

   // Update consultation
   const updatedConsultation = await prisma.consultation.update({
     where: {
       id: params.id
     },
     data: {
       ...(rating && { rating }),
       ...(review && { review })
     },
     include: {
       mentor: {
         select: {
           fullName: true
         }
       }
     }
   });

   return NextResponse.json({
     success: true,
     data: updatedConsultation
   });

 } catch (error) {
   console.error("Error updating consultation:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to update consultation" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}

// DELETE: Batalkan konsultasi
export async function DELETE(
 request: Request,
 { params }: { params: { id: string } }
) {
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

   // Cek konsultasi dengan slot
   const consultation = await prisma.consultation.findUnique({
     where: {
       id: params.id,
       clientId: session.clientId
     },
     include: {
       slot: true
     }
   });

   if (!consultation) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Consultation not found" 
       }, 
       { status: 404 }
     );
   }

   // Validasi status
   if (consultation.status !== 'PENDING') {
     return NextResponse.json(
       { 
         success: false, 
         error: "Can only cancel pending consultations" 
       }, 
       { status: 400 }
     );
   }

   // Cek waktu cancel (misal: minimal 24 jam sebelum jadwal)
   if (consultation.slot) {
     const twentyFourHoursBeforeSlot = new Date(consultation.slot.startTime.getTime() - (24 * 60 * 60 * 1000));
     if (new Date() > twentyFourHoursBeforeSlot) {
       return NextResponse.json(
         { 
           success: false, 
           error: "Cancellation must be done at least 24 hours before the schedule" 
         }, 
         { status: 400 }
       );
     }
   }

   // Cancel consultation dalam transaction
   const result = await prisma.$transaction(async (tx) => {
     // 1. Update status konsultasi
     const cancelledConsultation = await tx.consultation.update({
       where: {
         id: params.id
       },
       data: {
         status: ConsultationStatus.CANCELLED,
         cancelledAt: new Date()
       }
     });

     // 2. Update slot menjadi available
     if (consultation.slotId) {
       await tx.consultationSlot.update({
         where: {
           id: consultation.slotId
         },
         data: {
           isBooked: false
         }
       });
     }

     return cancelledConsultation;
   });

   // Notification ke mentor bisa ditambahkan di sini

   return NextResponse.json({
     success: true,
     data: result
   });

 } catch (error) {
   console.error("Error cancelling consultation:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to cancel consultation" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}