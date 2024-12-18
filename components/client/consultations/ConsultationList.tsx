// components/client/consultations/ConsultationList.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Video, ExternalLink, MessageCircle } from 'lucide-react';
import { ConsultationDetails, MentorExpertise } from '@/lib/types/consultations';
import { Button } from '@/components/ui/button';
import { ConsultationDialog } from './ConsultationDialog';
import ChatDialog from '@/components/shared/chat/ChatDialog';
import { useSession } from "next-auth/react";

interface ConsultationListProps {
  consultations: ConsultationDetails[];
}

export default function ConsultationList({ consultations }: ConsultationListProps) {
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);
  const { data: session } = useSession();

    // Add cleanup effect when consultations change
    useEffect(() => {
      if (selectedConsultationId) {
        // Check if the selected consultation still exists
        const exists = consultations.some(c => c.id === selectedConsultationId);
        if (!exists) {
          setSelectedConsultationId(null);
        }
      }
    }, [consultations, selectedConsultationId]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-700 bg-green-100 hover:bg-green-200 border-green-200';
      case 'PENDING':
        return 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 border-yellow-200';
      case 'COMPLETED':
        return 'text-blue-700 bg-blue-100 hover:bg-blue-200 border-blue-200';
      case 'CANCELLED':
        return 'text-red-700 bg-red-100 hover:bg-red-200 border-red-200';
      default:
        return 'text-gray-700 bg-gray-100 hover:bg-gray-200 border-gray-200';
    }
  };

  const formatDateTime = (date: string | Date) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      time: d.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

    // Tambahkan handler untuk chat
    const handleChatMessage = async (content: string, consultationId: string) => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            consultationId,
            content,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.error('Chat error:', error);
      }
    };

    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {consultations.map((consultation) => (
            <Card 
              key={consultation.id}
              className="hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-4 bg-gray-50 border-b p-4">
                <Avatar className="h-12 w-12 ring-2 ring-white">
                  <AvatarImage src={consultation.mentor.image || undefined} />
                  <AvatarFallback className="bg-primary-100 text-primary-700">
                    {consultation.mentor.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {consultation.mentor.fullName}
                  </h3>
                  {consultation.mentor.expertise && consultation.mentor.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {consultation.mentor.expertise.map((exp: MentorExpertise) => (
                        <Badge 
                          key={exp.id} 
                          variant="outline"
                          className="text-xs bg-white"
                        >
                          {exp.area}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Badge className={`${getStatusBadgeVariant(consultation.status)} ml-auto`}>
                  {consultation.status}
                </Badge>
              </CardHeader>
            <CardContent className="space-y-6 p-4">
              {consultation.slot && (
                <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDateTime(consultation.slot.startTime).date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>
                      {formatDateTime(consultation.slot.startTime).time} - 
                      {formatDateTime(consultation.slot.endTime).time}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                {consultation.status === 'ACTIVE' && (
                  <>
                    {consultation.zoomLink && (
                      <Button 
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                        onClick={() => consultation.zoomLink && window.open(consultation.zoomLink, '_blank')}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Meeting
                      </Button>
                    )}
                    <ChatDialog
                      currentUserId={session?.user?.id || ''}
                      participant={{
                        id: consultation.mentor.id,
                        name: consultation.mentor.fullName,
                        image: consultation.mentor.image || undefined,
                        status: 'online'
                      }}
                      consultationId={consultation.id}
                      consultationStatus={consultation.status}
                      triggerClassName="flex-1"
                      userRole="CLIENT" // Tambahkan ini
                    />
                  </>
                )}
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedConsultationId(consultation.id)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConsultationDialog
        consultationId={selectedConsultationId}
        isOpen={!!selectedConsultationId}
        onClose={() => setSelectedConsultationId(null)}
      />
    </>
  );
}