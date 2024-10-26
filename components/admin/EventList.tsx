"use client";

import { Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
 Card,
 CardContent,
 CardDescription,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Event {
 id: string;
 title: string;
 description: string;
 bannerUrl: string;
 location: string;
 date: string;
}

interface EventListProps {
 events: Event[];
 onAddNew: () => void;
 onEdit: (event: Event) => void;
 onDelete: (id: string) => void;
 deletingEventId: string | null;
}

export function EventList({ events = [], onAddNew, onEdit, onDelete, deletingEventId }: EventListProps) {
 const [searchQuery, setSearchQuery] = useState("");
 const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
 const [eventToDelete, setEventToDelete] = useState<string | null>(null);
 const { toast } = useToast();

 // Make sure events is always an array
 const eventArray = Array.isArray(events) ? events : [];

 const filteredEvents = eventArray.filter((event) =>
   event.title.toLowerCase().includes(searchQuery.toLowerCase())
 );

 const handleDelete = async (id: string) => {
   setEventToDelete(id);
   setIsDeleteDialogOpen(true);
 };

 const confirmDelete = async () => {
   if (!eventToDelete) return;
   
   try {
     await onDelete(eventToDelete);
   } catch (error) {
     toast({
       variant: "destructive",
       title: "Error",
       description: "Failed to delete event",
     });
   } finally {
     setIsDeleteDialogOpen(false);
     setEventToDelete(null);
   }
 };

 return (
   <>
     <Card>
       <CardHeader>
         <div className="flex items-center justify-between">
           <div>
             <CardTitle>Event Overview</CardTitle>
             <CardDescription>
               Total Event: {eventArray.length}
             </CardDescription>
           </div>
           <Button onClick={onAddNew} className="text-white bg-blue-500 hover:bg-blue-600">
             <Plus className="text-white h-4 w-4 mr-2" />
             New Event
           </Button>
         </div>
       </CardHeader>
       <CardContent>
         {/* Search */}
         <div className="mb-6">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
             <Input
               placeholder="Search events..."
               className="pl-10"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
         </div>

         {/* Events Grid */}
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           {filteredEvents.map((event) => (
             <Card key={event.id} className="overflow-hidden">
               <div className="aspect-video relative">
                 <Image
                   src={event.bannerUrl}
                   alt={event.title}
                   fill
                   className="object-cover"
                 />
               </div>
               <CardContent className="p-4">
                 <h3 className="font-semibold truncate">{event.title}</h3>
                 <p className="text-sm text-muted-foreground mt-1">
                   {formatDate(event.date)}
                 </p>
                 <p className="text-sm text-muted-foreground">
                   {event.location}
                 </p>
                 <div className="flex gap-2 mt-4">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => onEdit(event)}
                   >
                     <Pencil className="h-4 w-4 mr-1" />
                     Edit
                   </Button>
                   <Button
                     variant="destructive"
                     size="sm"
                     onClick={() => handleDelete(event.id)}
                     disabled={deletingEventId === event.id}
                   >
                     {deletingEventId === event.id ? (
                       <>
                         <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                         Deleting...
                       </>
                     ) : (
                       <>
                         <Trash2 className="h-4 w-4 mr-1" />
                         Delete
                       </>
                     )}
                   </Button>
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>

         {filteredEvents.length === 0 && (
           <div className="text-center py-8 text-muted-foreground">
             No events found.
           </div>
         )}
       </CardContent>
     </Card>

     <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
       <AlertDialogContent>
         <AlertDialogHeader>
           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
           <AlertDialogDescription>
             This action cannot be undone. This will permanently delete the event.
           </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
           <AlertDialogCancel>Cancel</AlertDialogCancel>
           <AlertDialogAction 
             onClick={confirmDelete}
             className="text-white bg-red-600 hover:bg-red-700"
             disabled={deletingEventId === eventToDelete}
           >
             {deletingEventId === eventToDelete ? (
               <>
                 <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                 Deleting...
               </>
             ) : (
               'Delete'
             )}
           </AlertDialogAction>
         </AlertDialogFooter>
       </AlertDialogContent>
     </AlertDialog>
   </>
 );
}