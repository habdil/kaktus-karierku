// app/(client)/dashboard/consultation/[mentorId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DetailMentor from "@/components/client/consultations/DetailMentor";
import { useToast } from "@/hooks/use-toast";
import { LoadingBars } from "@/components/ui/loading-bars";
import { MentorResponse } from "@/lib/types/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { SelectSingleEventHandler } from "react-day-picker";

interface ConsultationSlot {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  isBooked: boolean;
}

interface BookingData {
  mentorId: string;
  slotId: string;
  message: string;
}

export default function MentorDetailPage({ 
  params 
}: { 
  params: { mentorId: string } 
}) {
  const [mentor, setMentor] = useState<MentorResponse | null>(null);
  const [availableSlots, setAvailableSlots] = useState<ConsultationSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchMentorDetails();
  }, [params.mentorId]);

  const fetchMentorDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/client/consultations/${params.mentorId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch mentor details');
      }

      setMentor(data);
      if (data.availableSlots) {
        setAvailableSlots(data.availableSlots);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load mentor details"
      });
      router.push('/dashboard/consultation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatClick = () => {
    // Implement chat logic here
    console.log('Opening chat with mentor:', params.mentorId);
  };

  const handleBookSlot = async (bookingData: BookingData) => {
    try {
      setIsBooking(true);
      const response = await fetch(`/api/client/consultations/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to book consultation');
      }

      toast({
        title: "Success",
        description: "Consultation booked successfully!",
      });

      setShowBookingDialog(false);
      router.push('/dashboard/consultation');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book consultation"
      });
    } finally {
      setIsBooking(false);
    }
  };

  const getAvailableSlotsForDate = (date: Date) => {
    if (!date) return [];
    
    return availableSlots.filter(slot => {
      const slotDate = new Date(slot.startTime);
      return (
        slotDate.getDate() === date.getDate() &&
        slotDate.getMonth() === date.getMonth() &&
        slotDate.getFullYear() === date.getFullYear() &&
        !slot.isBooked
      );
    });
  };

  const handleDateSelect: SelectSingleEventHandler = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const confirmBooking = () => {
    if (!selectedSlot) return;
  
    handleBookSlot({
      mentorId: params.mentorId, // tambahkan ini
      slotId: selectedSlot.id,
      message: bookingMessage.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingBars text="Memuat detail mentor..." />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-4">
        <p className="text-lg text-muted-foreground">Mentor tidak ditemukan</p>
        <Button
          className="text-primary hover:underline"
          onClick={() => router.push('/dashboard/consultation')}
        >
          Kembali ke daftar mentor
        </Button>
      </div>
    );
  }

// Kode baru - perbaikan logika
const availableDatesFilter = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Tanggal yang sudah lewat tidak bisa dipilih
  if (date < today) return true;

  // Cek apakah ada slot tersedia pada tanggal tersebut
  const hasAvailableSlot = availableSlots.some(slot => {
    const slotDate = new Date(slot.startTime);
    return (
      slotDate.getDate() === date.getDate() &&
      slotDate.getMonth() === date.getMonth() &&
      slotDate.getFullYear() === date.getFullYear() &&
      !slot.isBooked
    );
  });

  // Tanggal bisa dipilih jika ada slot tersedia
  return !hasAvailableSlot;
};

  return (
    <div className="container py-8">
      <DetailMentor
        mentor={mentor}
        availableSlots={availableSlots}
        onBookSlot={() => setShowBookingDialog(true)}
        onChatClick={handleChatClick}
      />

    <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Book Consultation with {mentor.fullName}
          </DialogTitle>
          <DialogDescription>
            Choose your preferred date and time for the consultation
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Calendar */}
          <div className="space-y-4">
            <h3 className="font-medium">Select Date</h3>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                locale={id}
                disabled={availableDatesFilter}
                className="rounded-md border"
              />
            </div>
          </div>

          {/* Time Slots */}
          <div className="space-y-4">
            <h3 className="font-medium">Available Time Slots</h3>
            {selectedDate ? (
              <div className="space-y-2">
                {getAvailableSlotsForDate(selectedDate).map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                    className="w-full justify-start "
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {format(new Date(slot.startTime), 'HH:mm')} - 
                    {format(new Date(slot.endTime), 'HH:mm')}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Please select a date first</p>
            )}

            {selectedSlot && (
              <div className="space-y-4 pt-4 border-t">
                <Button 
                  className="w-full"
                  onClick={confirmBooking}
                  disabled={isBooking}
                >
                  {isBooking ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
}
