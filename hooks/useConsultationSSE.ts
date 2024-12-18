// hooks/useConsultationSSE.ts
import { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ConsultationDetails } from '@/lib/types/consultations';

interface UseConsultationSSEProps {
  endpoint: string;
  userType: 'CLIENT' | 'MENTOR';
  setConsultations: (consultations: ConsultationDetails[]) => void;
  fetchConsultations: () => Promise<void>;
}

export function useConsultationSSE({ 
  endpoint, 
  userType, 
  setConsultations, 
  fetchConsultations 
}: UseConsultationSSEProps) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Setup SSE connection
    const eventSource = new EventSource(`${endpoint}/sse`);
    eventSourceRef.current = eventSource;
    
    // Handle incoming SSE messages
    eventSource.onmessage = (event) => {
      try {
        const updatedConsultations = JSON.parse(event.data);
        setConsultations(updatedConsultations);

        // Notifikasi khusus untuk mentor
        if (userType === 'MENTOR') {
          const newPending = updatedConsultations.filter(
            (c: ConsultationDetails) => c.status === "PENDING"
          );
          if (newPending.length > 0) {
            toast({
              title: "New Consultation Request",
              description: `You have ${newPending.length} new consultation request(s)`,
            });
          }
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    // Handle SSE connection errors
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        fetchConsultations();
      }, 3000);
    };

    // Cleanup on component unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [endpoint, userType]);
}