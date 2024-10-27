// app/api/mentor/consultations/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, ConsultationStatus } from "@prisma/client";
import { getMentorSession } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Ambil detail konsultasi spesifik
export async function GET(
 request: Request,
 { params }: { params: { id: string } }
) {
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

   // Ambil detail konsultasi dengan relasi
   const consultation = await prisma.consultation.findUnique({
     where: {
       id: params.id,
       mentorId: session.mentorId // Pastikan konsultasi milik mentor ini
     },
     include: {
       client: {
         select: {
           fullName: true,
           currentStatus: true,
           major: true,
           interests: true,
           dreamJob: true
         }
       },
       slot: true,
       messages: {
         orderBy: {
           createdAt: 'desc'
         },
         include: {}
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

// PATCH: Update konsultasi (status, notes, link)
export async function PATCH(
 request: Request,
 { params }: { params: { id: string } }
) {
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
   const { status, mentorNotes, zoomLink } = body;

   // Validasi status yang diperbolehkan
   if (status && !Object.values(ConsultationStatus).includes(status)) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Invalid status" 
       }, 
       { status: 400 }
     );
   }

   // Cek apakah konsultasi ada dan milik mentor ini
   const existingConsultation = await prisma.consultation.findUnique({
     where: {
       id: params.id,
       mentorId: session.mentorId
     }
   });

   if (!existingConsultation) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Consultation not found" 
       }, 
       { status: 404 }
     );
   }

   // Update konsultasi
   const updatedConsultation = await prisma.consultation.update({
     where: {
       id: params.id
     },
     data: {
       ...(status && { status }),
       ...(mentorNotes && { mentorNotes }),
       ...(zoomLink && { zoomLink }),
       updatedAt: new Date()
     },
     include: {
       client: {
         select: {
           fullName: true
         }
       }
     }
   });

   // Jika status berubah, kirim notifikasi ke client
   if (status && status !== existingConsultation.status) {
     // Implementasi notifikasi bisa ditambahkan di sini
   }

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

   // Cek apakah konsultasi ada dan milik mentor ini
   const consultation = await prisma.consultation.findUnique({
     where: {
       id: params.id,
       mentorId: session.mentorId
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

   // Jika konsultasi sudah aktif/selesai, tidak bisa dibatalkan
   if (consultation.status === 'COMPLETED' || consultation.status === 'ACTIVE') {
     return NextResponse.json(
       { 
         success: false, 
         error: "Cannot cancel active or completed consultation" 
       }, 
       { status: 400 }
     );
   }

   // Update status konsultasi menjadi CANCELLED
   const cancelledConsultation = await prisma.consultation.update({
     where: {
       id: params.id
     },
     data: {
       status: 'CANCELLED',
       cancelledAt: new Date()
     }
   });

   // Update slot menjadi available lagi
   if (consultation.slotId) {
     await prisma.consultationSlot.update({
       where: {
         id: consultation.slotId
       },
       data: {
         isBooked: false
       }
     });
   }

   return NextResponse.json({
     success: true,
     data: cancelledConsultation
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