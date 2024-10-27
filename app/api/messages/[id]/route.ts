// app/api/messages/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getClientSession } from "@/lib/auth";
import { getMentorSession } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Ambil detail pesan spesifik
export async function GET(
 request: Request,
 { params }: { params: { id: string } }
) {
 try {
   const clientSession = await getClientSession();
   const mentorSession = await getMentorSession();

   if (!clientSession?.clientId && !mentorSession?.mentorId) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Unauthorized" 
       }, 
       { status: 401 }
     );
   }

   // Ambil pesan dengan validasi akses
   const message = await prisma.message.findFirst({
     where: {
       id: params.id,
       consultation: {
         OR: [
           { clientId: clientSession?.clientId },
           { mentorId: mentorSession?.mentorId }
         ]
       }
     },
     include: {
       consultation: {
         select: {
           status: true
         }
       }
     }
   });

   if (!message) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Message not found or access denied" 
       }, 
       { status: 404 }
     );
   }

   // Update readAt jika belum dibaca
   const userId = clientSession?.clientId || mentorSession?.mentorId;
   if (userId && message.senderId !== userId && !message.readAt) {
     await prisma.message.update({
       where: { id: params.id },
       data: { readAt: new Date() }
     });
   }

   return NextResponse.json({
     success: true,
     data: message
   });

 } catch (error) {
   console.error("Error fetching message:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to fetch message" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}

// PATCH: Update pesan (edit content, mark as read)
export async function PATCH(
 request: Request,
 { params }: { params: { id: string } }
) {
 try {
   const clientSession = await getClientSession();
   const mentorSession = await getMentorSession();

   if (!clientSession?.clientId && !mentorSession?.mentorId) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Unauthorized" 
       }, 
       { status: 401 }
     );
   }

   const body = await request.json();
   const { content, markAsRead } = body;
   const userId = clientSession?.clientId || mentorSession?.mentorId;

   // Ambil pesan dengan validasi
   const message = await prisma.message.findFirst({
     where: {
       id: params.id,
       consultation: {
         OR: [
           { clientId: clientSession?.clientId },
           { mentorId: mentorSession?.mentorId }
         ]
       }
     },
     include: {
       consultation: {
         select: {
           status: true
         }
       }
     }
   });

   if (!message) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Message not found or access denied" 
       }, 
       { status: 404 }
     );
   }

   // Jika mengubah content, validasi kepemilikan dan waktu
   if (content) {
     if (message.senderId !== userId) {
       return NextResponse.json(
         { 
           success: false, 
           error: "Can only edit your own messages" 
         }, 
         { status: 403 }
       );
     }

     // Validasi waktu edit (misal: hanya dalam 5 menit)
     const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
     if (message.createdAt < fiveMinutesAgo) {
       return NextResponse.json(
         { 
           success: false, 
           error: "Can only edit messages within 5 minutes" 
         }, 
         { status: 400 }
       );
     }
   }

   // Update pesan
   const updatedMessage = await prisma.message.update({
     where: {
       id: params.id
     },
     data: {
       ...(content && { 
         content,
         editedAt: new Date()
       }),
       ...(markAsRead && message.senderId !== userId && {
         readAt: new Date()
       })
     },
     // No additional includes needed
   });

   return NextResponse.json({
     success: true,
     data: updatedMessage
   });

 } catch (error) {
   console.error("Error updating message:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to update message" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}

// DELETE: Hapus pesan
export async function DELETE(
 request: Request,
 { params }: { params: { id: string } }
) {
 try {
   const clientSession = await getClientSession();
   const mentorSession = await getMentorSession();

   if (!clientSession?.clientId && !mentorSession?.mentorId) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Unauthorized" 
       }, 
       { status: 401 }
     );
   }

   const userId = clientSession?.clientId || mentorSession?.mentorId;

   // Validasi pesan dan kepemilikan
   const message = await prisma.message.findFirst({
     where: {
       id: params.id,
       senderId: userId, // Hanya bisa hapus pesan sendiri
       consultation: {
         OR: [
           { clientId: clientSession?.clientId },
           { mentorId: mentorSession?.mentorId }
         ]
       }
     }
   });

   if (!message) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Message not found or unauthorized" 
       }, 
       { status: 404 }
     );
   }

   // Validasi waktu delete (misal: hanya dalam 5 menit)
   const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
   if (message.createdAt < fiveMinutesAgo) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Can only delete messages within 5 minutes" 
       }, 
       { status: 400 }
     );
   }

   // Soft delete atau update content
const deletedMessage = await prisma.message.update({
  where: {
     id: params.id
  },
  data: {
     content: "This message has been deleted"
  }
});

   return NextResponse.json({
     success: true,
     data: deletedMessage
   });

 } catch (error) {
   console.error("Error deleting message:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to delete message" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}