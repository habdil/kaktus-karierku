// app/api/client/consultations/sse/route.ts
import { NextRequest } from "next/server";
import { getClientSession } from "@/lib/auth";
import { addClient, removeClient } from "@/lib/sseClient";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getClientSession();
  if (!session?.clientId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const stream = new ReadableStream({
    start(controller) {
      console.log(`SSE: New client connection - ${session.clientId}`);
      const client = addClient(controller, session.clientId, 'CLIENT');

      // Send initial ping
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(': ping\n\n'));

      // Setup keep-alive
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': ping\n\n'));
        } catch (error) {
          console.error('Keep-alive failed:', error);
          clearInterval(keepAlive);
          removeClient(client);
        }
      }, 15000); // Send ping every 15 seconds

      // Handle connection close
      req.signal.addEventListener("abort", () => {
        console.log(`SSE: Client connection closed - ${session.clientId}`);
        clearInterval(keepAlive);
        removeClient(client);
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    }
  });
}