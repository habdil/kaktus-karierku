// app/api/mentor/slots/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getMentorSession } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Ambil detail slot spesifik
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

   const slot = await prisma.consultationSlot.findUnique({
     where: {
       id: params.id,
       mentorId: session.mentorId
     },
     include: {
       consultations: {
         include: {
           client: {
             select: {
               fullName: true,
               currentStatus: true
             }
           }
         }
       }
     }
   });

   if (!slot) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Slot not found" 
       }, 
       { status: 404 }
     );
   }

   return NextResponse.json({
     success: true,
     data: slot
   });

 } catch (error) {
   console.error("Error fetching slot:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to fetch slot" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}

// PATCH: Update slot
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
   const { 
     startTime, 
     endTime, 
     duration,
     maxBookings,
     isRecurring,
     recurringDays 
   } = body;

   // Cek apakah slot ada dan milik mentor ini
   const existingSlot = await prisma.consultationSlot.findUnique({
     where: {
       id: params.id,
       mentorId: session.mentorId
     },
     include: {
       consultations: true
     }
   });

   if (!existingSlot) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Slot not found" 
       }, 
       { status: 404 }
     );
   }

   // Jika slot sudah dibooking, batasi field yang bisa diupdate
   if (existingSlot.isBooked) {
     if (startTime || endTime) {
       return NextResponse.json(
         { 
           success: false, 
           error: "Cannot modify time of booked slot" 
         }, 
         { status: 400 }
       );
     }
   }

   // Jika mengubah waktu, cek overlap
   if (startTime || endTime) {
     const start = startTime ? new Date(startTime) : existingSlot.startTime;
     const end = endTime ? new Date(endTime) : existingSlot.endTime;

     // Validasi waktu
     if (start >= end || start <= new Date()) {
       return NextResponse.json(
         { 
           success: false, 
           error: "Invalid time range" 
         }, 
         { status: 400 }
       );
     }

     // Cek overlap dengan slot lain
     const overlappingSlot = await prisma.consultationSlot.findFirst({
       where: {
         id: { not: params.id },
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

     if (overlappingSlot) {
       return NextResponse.json(
         { 
           success: false, 
           error: "Time slot overlaps with existing slot" 
         }, 
         { status: 400 }
       );
     }
   }

   // Update slot
   const updatedSlot = await prisma.consultationSlot.update({
     where: {
       id: params.id
     },
     data: {
       ...(startTime && { startTime: new Date(startTime) }),
       ...(endTime && { endTime: new Date(endTime) }),
       ...(duration && { duration }),
       ...(maxBookings && { maxBookings }),
       ...(isRecurring !== undefined && { isRecurring }),
       ...(recurringDays && { recurringDays }),
     },
     include: {
       consultations: {
         include: {
           client: {
             select: {
               fullName: true
             }
           }
         }
       }
     }
   });

   return NextResponse.json({
     success: true,
     data: updatedSlot
   });

 } catch (error) {
   console.error("Error updating slot:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to update slot" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}

// DELETE: Hapus slot
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

   // Cek slot dan consultations yang terkait
   const slot = await prisma.consultationSlot.findUnique({
     where: {
       id: params.id,
       mentorId: session.mentorId
     },
     include: {
       consultations: true
     }
   });

   if (!slot) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Slot not found" 
       }, 
       { status: 404 }
     );
   }

   // Jika ada konsultasi aktif, tidak bisa dihapus
   if (slot.consultations.some(c => ['ACTIVE', 'PENDING'].includes(c.status))) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Cannot delete slot with active consultations" 
       }, 
       { status: 400 }
     );
   }

   // Delete slot
   await prisma.consultationSlot.delete({
     where: {
       id: params.id
     }
   });

   return NextResponse.json({
     success: true,
     message: "Slot deleted successfully"
   });

 } catch (error) {
   console.error("Error deleting slot:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to delete slot" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}