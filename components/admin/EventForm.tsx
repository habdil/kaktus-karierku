"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { StorageBucket } from "@/lib/storage/supabase-storage";

const eventSchema = z.object({
 title: z.string().min(1, "Title is required"),
 description: z.string().min(1, "Description is required"),
 location: z.string().min(1, "Location is required"),
 date: z.string().min(1, "Date is required"),
 bannerUrl: z.string().min(1, "Banner image is required"),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
 onClose: () => void;
 initialData?: Partial<EventFormData>;
 onSubmit: (data: EventFormData) => Promise<void>;
 isSubmitting?: boolean;
}

export function EventForm({ onClose, initialData, onSubmit, isSubmitting = false }: EventFormProps) {
 const { toast } = useToast();

 const form = useForm<EventFormData>({
   resolver: zodResolver(eventSchema),
   defaultValues: {
     title: initialData?.title || "",
     description: initialData?.description || "",
     location: initialData?.location || "",
     date: initialData?.date || "",
     bannerUrl: initialData?.bannerUrl || "",
   },
 });

 const handleSubmit = async (values: EventFormData) => {
   try {
     await onSubmit(values);
     toast({
       title: "Success",
       description: `Event ${initialData ? "updated" : "created"} successfully`,
     });
     onClose();
   } catch (error) {
     toast({
       variant: "destructive",
       title: "Error",
       description: `Failed to ${initialData ? "update" : "create"} event`,
     });
   }
 };

 return (
   <Card className="max-w-2xl mx-auto">
     <CardHeader>
       <CardTitle>
         {initialData ? "Edit Event" : "Create New Event"}
       </CardTitle>
     </CardHeader>

     <CardContent>
       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
         <div className="space-y-4">
           <div>
             <label className="text-sm font-medium">Banner Image</label>
             <ImageUpload
               onUploadComplete={(url) => form.setValue("bannerUrl", url)}
               defaultImage={initialData?.bannerUrl}
               bucket={StorageBucket.EVENT_BANNER}
               path={`events/${Date.now()}`}
             />
             {form.formState.errors.bannerUrl && (
               <p className="text-sm text-red-500">
                 {form.formState.errors.bannerUrl.message}
               </p>
             )}
           </div>

           <div>
             <label className="text-sm font-medium">Title</label>
             <Input {...form.register("title")} disabled={isSubmitting} />
             {form.formState.errors.title && (
               <p className="text-sm text-red-500">
                 {form.formState.errors.title.message}
               </p>
             )}
           </div>

           <div>
             <label className="text-sm font-medium">Description</label>
             <Textarea {...form.register("description")} disabled={isSubmitting} />
             {form.formState.errors.description && (
               <p className="text-sm text-red-500">
                 {form.formState.errors.description.message}
               </p>
             )}
           </div>

           <div>
             <label className="text-sm font-medium">Location</label>
             <Input {...form.register("location")} disabled={isSubmitting} />
             {form.formState.errors.location && (
               <p className="text-sm text-red-500">
                 {form.formState.errors.location.message}
               </p>
             )}
           </div>

           <div>
             <label className="text-sm font-medium">Date</label>
             <Input type="datetime-local" {...form.register("date")} disabled={isSubmitting} />
             {form.formState.errors.date && (
               <p className="text-sm text-red-500">
                 {form.formState.errors.date.message}
               </p>
             )}
           </div>
         </div>

         <div className="flex justify-end gap-4">
           <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
             Cancel
           </Button>
           <Button 
             className="text-white bg-blue-500 hover:bg-blue-600" 
             type="submit" 
             disabled={isSubmitting}
           >
             {isSubmitting ? (
               <>
                 <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                 {initialData ? "Saving..." : "Creating..."}
               </>
             ) : (
               initialData ? "Save Changes" : "Create Event"
             )}
           </Button>
         </div>
       </form>
     </CardContent>
   </Card>
 );
}