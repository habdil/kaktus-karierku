"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, formatDistanceToNow } from "date-fns";
import {
  CalendarDays,
  MessageSquare,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface ConsultationHistoryDialogProps {
  trigger?: React.ReactNode;
}

interface Consultation {
  id: string;
  mentorId: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  rating?: number | null;
  review?: string | null;
  cancelReason?: string | null;
  mentor: {
    fullName: string;
    jobRole: string;
    company: string;
    image?: string | null;
  };
  messages: {
    id: string;
    content: string;
    createdAt: string;
  }[];
}

export function ConsultationHistoryDialog({ trigger }: ConsultationHistoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/client/consultations/history");
        const data = await response.json();
        
        if (response.ok) {
          setConsultations(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch consultations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchConsultations();
    }
  }, [isOpen]);

  const getStatusBadgeProps = (status: Consultation['status']) => {
    const statusConfig = {
      PENDING: { variant: "warning" as const, icon: Clock },
      ACTIVE: { variant: "info" as const, icon: MessageSquare },
      COMPLETED: { variant: "success" as const, icon: CheckCircle2 },
      CANCELLED: { variant: "destructive" as const, icon: XCircle },
    };

    return statusConfig[status];
  };

  const renderStars = (rating: number | null | undefined) => {
    if (!rating) return null;
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Consultation History</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="mt-2 text-sm text-muted-foreground">Loading consultations...</p>
            </div>
          ) : consultations.length > 0 ? (
            consultations.map((consultation) => {
              const statusProps = getStatusBadgeProps(consultation.status);
              const StatusIcon = statusProps.icon;

              return (
                <Card key={consultation.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={consultation.mentor.image || undefined} />
                          <AvatarFallback>
                            {consultation.mentor.fullName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {consultation.mentor.fullName}
                          </CardTitle>
                          <CardDescription>
                            {consultation.mentor.jobRole} at {consultation.mentor.company}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={statusProps.variant} className="flex items-center gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {consultation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {format(new Date(consultation.createdAt), 'PPP')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDistanceToNow(new Date(consultation.createdAt), { addSuffix: true })}
                      </div>
                    </div>

                    {consultation.status === 'COMPLETED' && (
                      <div className="space-y-2 pt-2 border-t">
                        {consultation.rating && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {renderStars(consultation.rating)}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              ({consultation.rating}/5)
                            </span>
                          </div>
                        )}
                        {consultation.review && (
                          <p className="text-sm italic">"{consultation.review}"</p>
                        )}
                      </div>
                    )}

                    {consultation.status === 'CANCELLED' && consultation.cancelReason && (
                      <div className="pt-2 border-t">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertCircle className="h-4 w-4 mt-0.5" />
                          <p>Cancelled: {consultation.cancelReason}</p>
                        </div>
                      </div>
                    )}

                    {consultation.messages.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground mb-2">
                          Last message:
                        </p>
                        <p className="text-sm">
                          {consultation.messages[consultation.messages.length - 1].content}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-2 text-sm font-semibold">No consultations yet</h3>
              <p className="text-sm text-muted-foreground">
                Your consultation history will appear here once you start mentoring sessions.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}