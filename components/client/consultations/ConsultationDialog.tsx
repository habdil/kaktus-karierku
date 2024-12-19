import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingBars } from "@/components/ui/loading-bars";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Video, Briefcase, Building, GraduationCap } from "lucide-react";
import ChatBox from "@/components/shared/chat/ChatBox";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

interface MentorExpertise {
  area: string;
  level: number;
  tags: string[];
}

interface ConsultationDetails {
  id: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  mentor: {
    id: string;
    fullName: string;
    image?: string;
    jobRole: string;
    company: string;
    education: string;
    motivation?: string;
    expertise: MentorExpertise[];
  };
  startTime?: string;
  endTime?: string;
  zoomLink?: string;
  messages: Message[];
}

interface ConsultationDialogProps {
  consultationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultationDialog({ consultationId, isOpen, onClose }: ConsultationDialogProps) {
  const [consultation, setConsultation] = useState<ConsultationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (consultationId && isOpen) {
      fetchConsultation();
      
      const interval = setInterval(() => {
        if (consultation?.status === 'ACTIVE') {
          fetchConsultation();
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [consultationId, isOpen]);

  const fetchConsultation = async () => {
    try {
      setLoading(true);
      const [consultationRes, sessionRes] = await Promise.all([
        fetch(`/api/client/consultations/consul/${consultationId}`),
        fetch('/api/auth/session')
      ]);

      const [consultationData, sessionData] = await Promise.all([
        consultationRes.json(),
        sessionRes.json()
      ]);

      if (!consultationRes.ok) throw new Error(consultationData.error);

      setConsultation(consultationData);
      setUserId(sessionData.id);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load consultation",
        variant: "destructive",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultationId,
          content,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      fetchConsultation();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-700 bg-green-100';
      case 'PENDING':
        return 'text-yellow-700 bg-yellow-100';
      case 'COMPLETED':
        return 'text-blue-700 bg-blue-100';
      case 'CANCELLED':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <LoadingBars />
          </div>
        ) : consultation ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 ring-2 ring-primary/10">
                  <AvatarImage src={consultation.mentor.image} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {consultation.mentor.fullName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    Consultation with{' '}
                    <span className="block sm:inline">{consultation.mentor.fullName}</span>
                  </h2>
                  <Badge className={`mt-2 ${getStatusColor(consultation.status)}`}>
                    {consultation.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Mentor Details Card */}
            <Card>
              <CardContent className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
                <h3 className="text-base sm:text-lg font-semibold border-b pb-2">
                  Mentor Profile
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-1" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">Current Role</p>
                      <p className="text-sm sm:text-base font-medium">{consultation.mentor.jobRole}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-1" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">Company</p>
                      <p className="text-sm sm:text-base font-medium">{consultation.mentor.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 sm:gap-3">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-1" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">Education</p>
                      <p className="text-sm sm:text-base font-medium">{consultation.mentor.education}</p>
                    </div>
                  </div>
                </div>

                {consultation.mentor.motivation && (
                  <div className="pt-3 sm:pt-4 border-t">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Motivation</p>
                    <p className="text-xs sm:text-sm italic bg-muted p-3 sm:p-4 rounded-lg">
                      "{consultation.mentor.motivation}"
                    </p>
                  </div>
                )}

                <div className="pt-3 sm:pt-4 border-t">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">Areas of Expertise</p>
                  <div className="space-y-3 sm:space-y-4">
                    {consultation.mentor.expertise.map((exp, idx) => (
                      <div key={idx} className="bg-muted p-3 sm:p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm sm:text-base font-medium">{exp.area}</span>
                          <Badge variant="outline" className="text-xs">Level {exp.level}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {exp.tags.map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              className="text-xs bg-background px-2 py-0.5 rounded-full border"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consultation Details Card */}
            <Card>
              <CardContent className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
                <h3 className="text-base sm:text-lg font-semibold border-b pb-2">
                  Consultation Details
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                  {consultation.startTime && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm sm:text-base">{new Date(consultation.startTime).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  )}
                  {consultation.startTime && consultation.endTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm sm:text-base">
                        {new Date(consultation.startTime).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(consultation.endTime).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {consultation.zoomLink && (
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Video className="h-5 w-5 text-primary" />
                    <a
                      href={consultation.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex-1"
                    >
                      Join Zoom Meeting
                    </a>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(consultation.zoomLink, '_blank')}
                    >
                      Open
                    </Button>
                  </div>
                )}

                {consultation.status === 'ACTIVE' && userId && (
                  <div className="pt-4">
                    <ChatBox
                      messages={consultation.messages.map((msg) => ({
                        id: msg.id,
                        senderId: msg.senderId,
                        senderName: msg.senderId === userId ? "You" : consultation.mentor.fullName,
                        senderImage: msg.senderId === userId ? undefined : consultation.mentor.image,
                        content: msg.content,
                        type: "TEXT",
                        status: "SENT",
                        createdAt: msg.createdAt,
                      }))}
                      currentUserId={userId}
                      participant={{
                        id: consultation.mentor.id,
                        name: consultation.mentor.fullName,
                        image: consultation.mentor.image,
                        status: 'online'
                      }}
                      onSendMessage={handleSendMessage}
                      userRole="CLIENT"
                    />
                  </div>
                )}

                {consultation.status === 'PENDING' && (
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <p className="text-muted-foreground">
                      Waiting for mentor to start the consultation...
                    </p>
                  </div>
                )}
                
                {consultation.status === 'COMPLETED' && (
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <p className="text-muted-foreground">
                      This consultation has been completed.
                    </p>
                  </div>
                )}
                
                {consultation.status === 'CANCELLED' && (
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <p className="text-muted-foreground">
                      This consultation has been cancelled.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <p className="text-sm sm:text-base text-muted-foreground">Consultation not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}