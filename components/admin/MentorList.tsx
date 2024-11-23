// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import {
//   ArrowUpDown,
//   MoreHorizontal,
//   Pencil,
//   Trash2,
//   UserPlus,
//   UserX,
// } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/hooks/use-toast";
// import * as Dialog from '@radix-ui/react-dialog';

// interface Mentor {
//   id: string;
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   company: string;
//   jobRole: string;
//   status: "ACTIVE" | "INACTIVE";
//   createdAt: string;
// }

// interface MentorListProps {
//   initialMentors: Mentor[];
// }

// export function MentorList({ initialMentors }: MentorListProps) {
//   const [mentors, setMentors] = useState<Mentor[]>(initialMentors);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortConfig, setSortConfig] = useState<{
//     key: keyof Mentor;
//     direction: "asc" | "desc";
//   }>({ key: "createdAt", direction: "desc" });
//   const { toast } = useToast();
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

//   // Filter mentors based on search query
//   const filteredMentors = mentors.filter((mentor) =>
//     Object.values(mentor).some((value) =>
//       value.toString().toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );

//   // Sort mentors
//   const sortedMentors = [...filteredMentors].sort((a, b) => {
//     if (a[sortConfig.key] < b[sortConfig.key]) {
//       return sortConfig.direction === "asc" ? -1 : 1;
//     }
//     if (a[sortConfig.key] > b[sortConfig.key]) {
//       return sortConfig.direction === "asc" ? 1 : -1;
//     }
//     return 0;
//   });

//   // Handle sort
//   const handleSort = (key: keyof Mentor) => {
//     setSortConfig({
//       key,
//       direction:
//         sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
//     });
//   };

//   // Handle status change
//   const handleStatusChange = async (mentorId: string, newStatus: "ACTIVE" | "INACTIVE") => {
//     try {
//       const response = await fetch(`/api/admin/mentors/${mentorId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update mentor status");
//       }

//       setMentors(mentors.map((mentor) =>
//         mentor.id === mentorId ? { ...mentor, status: newStatus } : mentor
//       ));

//       toast({
//         title: "Status Updated",
//         description: `Mentor status has been updated to ${newStatus.toLowerCase()}.`,
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to update mentor status.",
//       });
//     }
//   };

//   // Handle delete
//   const confirmDelete = async () => {
//     if (!selectedMentorId) return;
//     try {
//       const response = await fetch(`/api/admin/mentors/${selectedMentorId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete mentor");
//       }

//       setMentors(mentors.filter((mentor) => mentor.id !== selectedMentorId));

//       toast({
//         title: "Mentor Deleted",
//         description: "The mentor has been successfully deleted.",
//       });
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to delete mentor.",
//       });
//     } finally {
//       setDialogOpen(false);
//       setSelectedMentorId(null);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle>Mentors</CardTitle>
//             <CardDescription>
//               Manage your platform mentors here.
//             </CardDescription>
//           </div>
//           <Button asChild>
//             <Link href="/dashboard-admin/mentors/add">
//               <UserPlus className="mr-2 h-4 w-4 text-white" />
//                 <span className="text-white">Add Mentor</span>
//             </Link>
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="mb-4">
//           <Input
//             placeholder="Search mentors..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="max-w-sm"
//           />
//         </div>

//         <div className="rounded-md border">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead onClick={() => handleSort("fullName")} className="cursor-pointer">
//                   <div className="flex items-center space-x-1">
//                     <span>Name</span>
//                     <ArrowUpDown className="h-4 w-4" />
//                   </div>
//                 </TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Phone</TableHead>
//                 <TableHead>Company</TableHead>
//                 <TableHead>Role</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {sortedMentors.map((mentor) => (
//                 <TableRow key={mentor.id}>
//                   <TableCell className="font-medium">{mentor.fullName}</TableCell>
//                   <TableCell>{mentor.email}</TableCell>
//                   <TableCell>{mentor.phoneNumber}</TableCell>
//                   <TableCell>{mentor.company}</TableCell>
//                   <TableCell>{mentor.jobRole}</TableCell>
//                   <TableCell>
//                     <Badge
//                       variant={mentor.status === "ACTIVE" ? "success" : "default"}
//                     >
//                       {mentor.status.toLowerCase()}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" className="h-8 w-8 p-0">
//                           <span className="sr-only">Open menu</span>
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuItem asChild>
//                           <Link href={`/dashboard-admin/mentors/${mentor.id}`}>
//                             <Pencil className="mr-2 h-4 w-4" />
//                             Edit
//                           </Link>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => handleStatusChange(
//                             mentor.id,
//                             mentor.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
//                           )}
//                         >
//                           {mentor.status === "ACTIVE" ? (
//                             <>
//                               <UserX className="mr-2 h-4 w-4" />
//                               Deactivate
//                             </>
//                           ) : (
//                             <>
//                               <UserPlus className="mr-2 h-4 w-4" />
//                               Activate
//                             </>
//                           )}
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem
//                           onClick={() => {
//                             setSelectedMentorId(mentor.id);
//                             setDialogOpen(true);
//                           }}
//                           className="text-red-600"
//                         >
//                           <Trash2 className="mr-2 h-4 w-4" />
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))}
//               {sortedMentors.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={7} className="text-center py-8">
//                     No mentors found.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </CardContent>

//       {/* Radix UI Dialog */}
//       <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
//         <Dialog.Portal>
//           <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
//           <Dialog.Content className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-md max-w-md w-full">
//             <Dialog.Title className="text-lg font-semibold">Confirm Delete</Dialog.Title>
//             <Dialog.Description className="text-gray-600 mt-2">
//               Are you sure you want to delete this mentor? This action cannot be undone.
//             </Dialog.Description>
//             <div className="mt-4 flex justify-end space-x-2">
//               <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
//               <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
//             </div>
//           </Dialog.Content>
//         </Dialog.Portal>
//       </Dialog.Root>
//     </Card>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
  UserX,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import * as Dialog from '@radix-ui/react-dialog';

interface Mentor {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  company: string;
  jobRole: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

interface MentorListProps {
  initialMentors: Mentor[];
}

export function MentorList({ initialMentors }: MentorListProps) {
  const [mentors, setMentors] = useState<Mentor[]>(initialMentors);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Mentor;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  // Filter mentors based on search query
  const filteredMentors = mentors.filter((mentor) =>
    Object.values(mentor).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sort mentors
  const sortedMentors = [...filteredMentors].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Handle sort
  const handleSort = (key: keyof Mentor) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  // Handle status change
  const handleStatusChange = async (mentorId: string, newStatus: "ACTIVE" | "INACTIVE") => {
    // Prevent duplicate requests
    if (isLoading[mentorId]) return;

    try {
      setIsLoading(prev => ({ ...prev, [mentorId]: true }));

      // Optimistic update
      const previousMentors = [...mentors];
      setMentors(prev =>
        prev.map(mentor =>
          mentor.id === mentorId ? { ...mentor, status: newStatus } : mentor
        )
      );

      const response = await fetch(`/api/mentor/${mentorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        // Revert changes if request fails
        setMentors(previousMentors);
        const error = await response.json();
        throw new Error(error.error || "Failed to update mentor status");
      }

      toast({
        description: `Mentor status has been updated to ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      console.error("Error updating mentor status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update mentor status.",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, [mentorId]: false }));
    }
  };

  // Handle delete
  const confirmDelete = async () => {
    if (!selectedMentorId) return;

    try {
      setIsLoading(prev => ({ ...prev, [selectedMentorId]: true }));

      const response = await fetch(`/api/mentor/${selectedMentorId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete mentor");
      }

      // Update mentors state safely
      setMentors(prevMentors => 
        prevMentors.filter(mentor => mentor.id !== selectedMentorId)
      );

      toast({
        description: "Mentor has been successfully deleted.",
      });

    } catch (error) {
      console.error("Error deleting mentor:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete mentor.",
      });
    } finally {
      // Pastikan semua state di-reset dengan benar
      setIsLoading(prev => {
        const newLoading = { ...prev };
        delete newLoading[selectedMentorId];
        return newLoading;
      });
      setSelectedMentorId(null);
      setDialogOpen(false); // Pindahkan penutupan dialog ke finally
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mentors</CardTitle>
            <CardDescription>
              Manage your platform mentors here.
            </CardDescription>
          </div>
          <Button asChild className="text-white">
            <Link href="/dashboard-admin/mentors/add">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Mentor
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("fullName")} className="cursor-pointer">
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMentors.map((mentor) => (
                <TableRow key={mentor.id}>
                  <TableCell className="font-medium">{mentor.fullName}</TableCell>
                  <TableCell>{mentor.email}</TableCell>
                  <TableCell>{mentor.phoneNumber}</TableCell>
                  <TableCell>{mentor.company}</TableCell>
                  <TableCell>{mentor.jobRole}</TableCell>
                  <TableCell>
                    <Badge
                      variant={mentor.status === "ACTIVE" ? "success" : "error"}
                    >
                      {mentor.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"
                          disabled={isLoading[mentor.id]}>
                          <span className="sr-only">Open menu</span>
                          {isLoading[mentor.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard-admin/mentors/${mentor.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {sortedMentors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No mentors found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <Dialog.Title className="text-lg font-semibold">
              Confirm Delete
            </Dialog.Title>
            <Dialog.Description className="text-muted-foreground mt-2">
              Are you sure you want to delete this mentor? This action cannot be undone.
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isLoading[selectedMentorId || ""]}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isLoading[selectedMentorId || ""]}
              >
                {isLoading[selectedMentorId || ""] ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Card>
  );
}