// components/mentor/consultations/ConsultationList.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MessageCircle, Video, Settings } from 'lucide-react';
import { ConsultationDetails } from '@/lib/types/consultations';
import ChatDialog from '@/components/shared/chat/ChatDialog';
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ConsultationListProps {
  consultations: ConsultationDetails[];
  onStatusChange: (id: string, status: string) => void;
  onAddZoomLink: (id: string, link: string) => void;
}

export default function ConsultationList({ 
  consultations,
  onStatusChange,
  onAddZoomLink
}: ConsultationListProps) {
  const router = useRouter();
  const [zoomLink, setZoomLink] = React.useState('');
  const [selectedConsultation, setSelectedConsultation] = React.useState<string | null>(null);
  const { data: session } = useSession();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'COMPLETED': return 'bg-blue-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await onStatusChange(id, status);
      // Reset zoom dialog if needed
      if (selectedConsultation === id) {
        setSelectedConsultation(null);
      }
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  const handleZoomSubmit = async (consultationId: string) => {
    if (zoomLink.trim()) {
      try {
        await onAddZoomLink(consultationId, zoomLink.trim());
        setZoomLink('');
        setSelectedConsultation(null);
      } catch (error) {
        console.error('Error adding zoom link:', error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {consultations.map((consultation) => (
        <Card key={consultation.id}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={consultation.client.image || undefined} />
              <AvatarFallback>
                {consultation.client.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{consultation.client.fullName}</h3>
              <Badge 
                className={getStatusColor(consultation.status)}
              >
                {consultation.status}
              </Badge>
            </div>
            
            {consultation.status === 'PENDING' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onStatusChange(consultation.id, 'ACTIVE')}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onStatusChange(consultation.id, 'CANCELLED')}
                >
                  Decline
                </Button>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2">
              {consultation.startTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(consultation.startTime).toLocaleDateString()}
                  </span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>
                    {new Date(consultation.startTime).toLocaleTimeString()}
                  </span>
                </div>
              )}
              {consultation.lastMessageAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span>Last message: {
                    new Date(consultation.lastMessageAt).toLocaleString()
                  }</span>
                </div>
              )}
              {consultation.zoomLink && (
                <div className="mt-2">
                  <a 
                    href={consultation.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm flex items-center gap-2"
                  >
                    <Video className="h-4 w-4" />
                    Join Zoom Meeting
                  </a>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            {/* Tambahkan tombol Chat sebelum tombol Manage */}
            {consultation.status === 'ACTIVE' && (
              <ChatDialog
                currentUserId={session?.user?.id || ''}
                participant={{
                  id: consultation.client.id,
                  name: consultation.client.fullName,
                  image: consultation.client.image || undefined,
                  status: 'online'
                }}
                consultationId={consultation.id}
                consultationStatus={consultation.status}
                userRole="MENTOR" // Tambahkan ini
                triggerClassName="flex items-center gap-2"
              />
            )}
            <Button
              variant="default"
              onClick={() => router.push(`/dashboard-mentor/consultation/${consultation.id}`)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Manage
            </Button>

            {consultation.status === 'ACTIVE' && (
              <Dialog open={selectedConsultation === consultation.id} 
                onOpenChange={(open) => setSelectedConsultation(open ? consultation.id : null)}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    {consultation.zoomLink ? 'Update Zoom' : 'Add Zoom'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {consultation.zoomLink ? 'Update Zoom Link' : 'Add Zoom Link'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input
                      placeholder="Enter Zoom meeting link"
                      value={zoomLink}
                      onChange={(e) => setZoomLink(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button 
                        onClick={() => handleZoomSubmit(consultation.id)}
                        disabled={!zoomLink.trim()}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {consultation.status === 'ACTIVE' && (
              <Button
                variant="outline"
                onClick={() => onStatusChange(consultation.id, 'COMPLETED')}
              >
                Complete
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}