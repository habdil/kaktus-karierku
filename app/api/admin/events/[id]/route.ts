// app/api/admin/events/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAdminSession } from "@/lib/auth";

const prisma = new PrismaClient();

// GET specific event
export async function GET(
 request: Request,
 { params }: { params: { id: string } }
) {
 try {
   const event = await prisma.event.findUnique({
     where: {
       id: params.id
     },
     include: {
       admin: {
         select: {
           fullName: true
         }
       }
     }
   });

   if (!event) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Event not found" 
       }, 
       { status: 404 }
     );
   }

   return NextResponse.json({
     success: true,
     data: event
   });

 } catch (error) {
   console.error("Error fetching event:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to fetch event" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}

// UPDATE event
export async function PATCH(
 request: Request,
 { params }: { params: { id: string } }
) {
 try {
   const session = await getAdminSession();
   
   if (!session) {
     return NextResponse.json(
       { 
         success: false, 
         error: "Unauthorized" 
       }, 
       { status: 401 }
     );
   }

   const body = await request.json();
   const { title, description, bannerUrl, location, date } = body;

   // Validation
   if (!title && !description && !bannerUrl && !location && !date) {
     return NextResponse.json(
       { 
         success: false, 
         error: "No fields to update" 
       }, 
       { status: 400 }
     );
   }

   const updatedEvent = await prisma.event.update({
     where: {
       id: params.id
     },
     data: {
       title: title || undefined,
       description: description || undefined,
       bannerUrl: bannerUrl || undefined,
       location: location || undefined,
       date: date ? new Date(date) : undefined,
     },
     include: {
       admin: {
         select: {
           fullName: true
         }
       }
     }
   });

   return NextResponse.json({
     success: true,
     data: updatedEvent
   });

 } catch (error) {
   console.error("Error updating event:", error);
   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to update event" 
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}

// DELETE event
export async function DELETE(
 request: Request,
 { params }: { params: { id: string } }
) {
 try {
   console.log('Attempting to delete event:', params.id);
   
   const session = await getAdminSession();
   console.log('Session:', session);

   if (!session) {
     console.log('No session found');
     return NextResponse.json(
       { 
         success: false, 
         error: "Unauthorized - No session" 
       }, 
       { status: 401 }
     );
   }

   // Get admin details
   const admin = await prisma.admin.findUnique({
     where: {
       userId: session.id
     }
   });

   console.log('Admin:', admin);

   if (!admin) {
     console.log('Admin not found');
     return NextResponse.json(
       { 
         success: false, 
         error: "Unauthorized - Admin not found" 
       }, 
       { status: 401 }
     );
   }

   // Check if event exists
   const event = await prisma.event.findUnique({
     where: {
       id: params.id,
     }
   });

   console.log('Event:', event);

   if (!event) {
     console.log('Event not found');
     return NextResponse.json(
       { 
         success: false, 
         error: "Event not found" 
       }, 
       { status: 404 }
     );
   }

   // Delete event
   const deletedEvent = await prisma.event.delete({
     where: {
       id: params.id,
     }
   });

   console.log('Event deleted:', deletedEvent);

   return NextResponse.json({
     success: true,
     message: "Event deleted successfully"
   });

 } catch (error) {
   console.error("Error deleting event:", error);
   
   if ((error as any).code === 'P2025') {
     return NextResponse.json(
       { 
         success: false, 
         error: "Event not found" 
       }, 
       { status: 404 }
     );
   }

   return NextResponse.json(
     { 
       success: false, 
       error: "Failed to delete event",
       details: (error as Error).message
     }, 
     { status: 500 }
   );
 } finally {
   await prisma.$disconnect();
 }
}