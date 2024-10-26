// app/(admin)/dashboard-admin/events/add/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { useToast } from "@/hooks/use-toast";

interface EventFormData {
 title: string;
 description: string;
 bannerUrl: string;
 location: string;
 date: string;
}

export default function AddEventPage() {
 const router = useRouter();
 const { toast } = useToast();

 const handleSubmit = async (formData: EventFormData) => {
   try {
     const response = await fetch('/api/admin/events', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(formData)
     });

     const data = await response.json();

     if (!data.success) {
       throw new Error(data.error);
     }

     router.push('/dashboard-admin/events');
     router.refresh();

   } catch (error) {
     throw error; // EventForm akan menangani error
   }
 };

 const handleClose = () => {
   router.push('/dashboard-admin/events');
 };

 return (
   <div className="p-6">
     <EventForm 
       onClose={handleClose}
       onSubmit={handleSubmit}
     />
   </div>
 );
}