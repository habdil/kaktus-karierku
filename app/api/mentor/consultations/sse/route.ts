// app/api/mentor/consultations/sse/route.ts
import { NextRequest } from "next/server";
import { getMentorSession } from "@/lib/auth";
import { addClient, removeClient } from "@/lib/sseClient";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Validate mentor session
    const session = await getMentorSession();
    if (!session?.mentorId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        console.log(`SSE: New mentor connection established - ${session.mentorId}`);
        
        // Add mentor to connected clients
        const client = addClient(controller, session.mentorId, 'MENTOR');

        // Send initial ping
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(': ping\n\n'));

        // Setup keep-alive ping
        const keepAlive = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(': ping\n\n'));
          } catch (error) {
            console.error('Keep-alive failed for mentor:', error);
            clearInterval(keepAlive);
            removeClient(client);
          }
        }, 15000); // Send ping every 15 seconds

        // Handle connection close
        req.signal.addEventListener("abort", () => {
          console.log(`SSE: Mentor connection closed - ${session.mentorId}`);
          clearInterval(keepAlive);
          removeClient(client);
        });
      }
    });

    // 3. Return SSE response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no" // Prevents proxy buffering
      }
    });
    
  } catch (error) {
    console.error("SSE Connection Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}