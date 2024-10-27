// app/api/messages/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getClientSession } from "@/lib/auth";
import { getMentorSession } from "@/lib/auth";

const prisma = new PrismaClient();

// GET: Ambil pesan untuk konsultasi spesifik
export async function GET(request: Request) {
 try {
   // Ambil session client atau mentor
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

   // Ambil consultationId dari query
   const { searchParams } = new URL(request.url);
   const consultationId = searchParams.get('consultationId');

   if (!consultationId) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Consultation ID is required" 
       }, 
       { status: 400 }
     );
   }

   // Validasi akses ke konsultasi
   const consultation = await prisma.consultation.findUnique({
     where: {
       id: consultationId,
       OR: [
         { clientId: clientSession?.clientId },
         { mentorId: mentorSession?.mentorId }
       ]
     }
   });

   if (!consultation) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Consultation not found or access denied" 
       }, 
       { status: 404 }
     );
   }

   // Ambil pesan dengan pagination
   const page = parseInt(searchParams.get('page') || '1');
   const limit = parseInt(searchParams.get('limit') || '50');
   const skip = (page - 1) * limit;

   const messages = await prisma.message.findMany({
     where: {
       consultationId
     },
     include: {},
     orderBy: {
       createdAt: 'desc'
     },
     skip,
     take: limit
   });

   // Update status read untuk pesan yang belum dibaca
   const userId = clientSession?.clientId || mentorSession?.mentorId;
   if (userId) {
     await prisma.message.updateMany({
       where: {
         consultationId,
         senderId: { not: userId },
         readAt: null
       },
       data: {
         readAt: new Date()
       }
     });
   }

   // Hitung total messages untuk pagination
   const totalMessages = await prisma.message.count({
     where: {
       consultationId
     }
   });

   return NextResponse.json({
     success: true,
     data: messages,
     pagination: {
       page,
       limit,
       totalPages: Math.ceil(totalMessages / limit),
       totalMessages
     }
   });

 } catch (error) {
   console.error("Error fetching messages:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to fetch messages" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}

// POST: Kirim pesan baru
export async function POST(request: Request) {
 try {
   // Ambil session client atau mentor
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
   const { consultationId, content, type = 'TEXT' } = body;

   if (!consultationId || !content) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Required fields missing" 
       }, 
       { status: 400 }
     );
   }

   // Validasi konsultasi dan akses
   const consultation = await prisma.consultation.findUnique({
     where: {
       id: consultationId,
       OR: [
         { clientId: clientSession?.clientId },
         { mentorId: mentorSession?.mentorId }
       ],
       status: {
         in: ['PENDING', 'ACTIVE']
       }
     }
   });

   if (!consultation) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Consultation not found or inactive" 
       }, 
       { status: 404 }
     );
   }

   // Create message
   const message = await prisma.message.create({
     data: {
       consultationId,
       content,
       type,
       senderId: clientSession?.clientId || mentorSession?.mentorId || '',
     },
     include: {}
   });

   // Update lastMessageAt di consultation
   await prisma.consultation.update({
     where: {
       id: consultationId
     },
     data: {
       lastMessageAt: new Date()
     }
   });

   // Notification bisa ditambahkan di sini
   // if (clientSession) {
   //   // Notify mentor
   // } else {
   //   // Notify client
   // }

   return NextResponse.json({
     success: true,
     data: message
   });

 } catch (error) {
   console.error("Error sending message:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to send message" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}