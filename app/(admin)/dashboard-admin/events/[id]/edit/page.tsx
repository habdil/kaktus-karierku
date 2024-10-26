"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { EventForm } from "@/components/admin/EventForm";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Event {
 id: string;
 title: string;
 description: string;
 bannerUrl: string;
 location: string;
 date: string;
}

export default function EditEventPage({ params }: { params: { id: string } }) {
 const router = useRouter();
 const { toast } = useToast();
 const [event, setEvent] = useState<Event | null>(null);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
   // Fetch event data
   const fetchEvent = async () => {
     try {
       const response = await fetch(`/api/admin/events/${params.id}`);
       const data = await response.json();
       
       if (data.success) {
         setEvent(data.data);
       } else {
         throw new Error(data.error);
       }
     } catch (error) {
       toast({
         variant: "destructive",
         title: "Error",
         description: "Failed to fetch event"
       });
       router.push('/dashboard-admin/events');
     } finally {
       setIsLoading(false);
     }
   };

   fetchEvent();
 }, [params.id, router, toast]);

 const handleSubmit = async (formData: Omit<Event, 'id'>) => {
   try {
     setIsLoading(true);
     const response = await fetch(`/api/admin/events/${params.id}`, {
       method: 'PATCH',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(formData)
     });

     const data = await response.json();

     if (!data.success) {
       throw new Error(data.error);
     }

     toast({
       title: "Success",
       description: "Event updated successfully"
     });

     router.push('/dashboard-admin/events');
     router.refresh();

   } catch (error) {
     toast({
       variant: "destructive",
       title: "Error",
       description: "Failed to update event"
     });
     throw error;
   } finally {
     setIsLoading(false);
   }
 };

 const handleClose = () => {
   router.push('/dashboard-admin/events');
 };

 if (isLoading) {
   return (
     <div className="flex items-center justify-center min-h-screen">
       <div className="flex flex-col items-center gap-2">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
         <p className="text-sm text-muted-foreground">
           {event ? 'Updating event...' : 'Loading event...'}
         </p>
       </div>
     </div>
   );
 }

 if (!event && !isLoading) {
   return (
     <div className="flex items-center justify-center min-h-screen">
       <div className="text-center">
         <p className="text-lg font-medium">Event not found</p>
         <button 
           onClick={() => router.push('/dashboard-admin/events')}
           className="mt-4 text-sm text-primary hover:underline"
         >
           Back to events
         </button>
       </div>
     </div>
   );
 }

 return (
   <div className="p-6">
     <EventForm 
       initialData={event || {}}
       onClose={handleClose}
       onSubmit={handleSubmit}
       isSubmitting={isLoading}
     />
   </div>
 );
}