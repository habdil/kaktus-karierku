// lib/sseClient.ts
import prisma from "@/lib/prisma";

interface ConnectedClient {
  controller: ReadableStreamDefaultController;
  userId: string;
  userType: 'CLIENT' | 'MENTOR';
  lastPing: number;
}

// Keep track of all connected clients
const clients = new Set<ConnectedClient>();

// Add client to connected clients set
export function addClient(
  controller: ReadableStreamDefaultController,
  userId: string,
  userType: 'CLIENT' | 'MENTOR'
) {
  const client: ConnectedClient = {
    controller,
    userId,
    userType,
    lastPing: Date.now()
  };
  clients.add(client);
  return client;
}

// Remove client from connected clients set
export function removeClient(client: ConnectedClient) {
  clients.delete(client);
}

// Broadcast to specific client
export async function broadcastConsultationsUpdate(clientId: string) {
  try {
    // Fetch updated consultations
    const consultations = await prisma.consultation.findMany({
      where: { clientId },
      include: {
        mentor: {
          include: {
            expertise: true,
            user: {
              select: { image: true }
            }
          }
        },
        slot: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    // Transform data
    const data = JSON.stringify(consultations);
    const encoder = new TextEncoder();
    const payload = encoder.encode(`data: ${data}\n\n`);

    // Broadcast to all client's connections
    let activeConnections = 0;
    clients.forEach(client => {
      if (client.userType === 'CLIENT' && client.userId === clientId) {
        try {
          client.controller.enqueue(payload);
          activeConnections++;
          client.lastPing = Date.now(); // Update last ping
        } catch (error) {
          console.error('Error sending to client:', error);
          removeClient(client);
        }
      }
    });

    console.log(`Broadcasted to ${activeConnections} client connections`);
  } catch (error) {
    console.error('Error in broadcastConsultationsUpdate:', error);
  }
}

// Broadcast to specific mentor
export async function broadcastMentorConsultations(mentorId: string) {
  try {
    // Fetch updated consultations
    const consultations = await prisma.consultation.findMany({
      where: { mentorId },
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            major: true,
            currentStatus: true
          }
        },
        slot: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    // Transform data
    const data = JSON.stringify(consultations);
    const encoder = new TextEncoder();
    const payload = encoder.encode(`data: ${data}\n\n`);

    // Broadcast to all mentor's connections
    let activeConnections = 0;
    clients.forEach(client => {
      if (client.userType === 'MENTOR' && client.userId === mentorId) {
        try {
          client.controller.enqueue(payload);
          activeConnections++;
          client.lastPing = Date.now(); // Update last ping
        } catch (error) {
          console.error('Error sending to mentor:', error);
          removeClient(client);
        }
      }
    });

    console.log(`Broadcasted to ${activeConnections} mentor connections`);
  } catch (error) {
    console.error('Error in broadcastMentorConsultations:', error);
  }
}

// Clean up stale connections
setInterval(() => {
  const now = Date.now();
  clients.forEach(client => {
    if (now - client.lastPing > 30000) { // 30 seconds timeout
      console.log(`Removing stale connection for ${client.userType} ${client.userId}`);
      removeClient(client);
    }
  });
}, 10000); // Check every 10 seconds