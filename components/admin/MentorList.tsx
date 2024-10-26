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
    try {
      const response = await fetch(`/api/admin/mentors/${mentorId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update mentor status");
      }

      setMentors(mentors.map((mentor) =>
        mentor.id === mentorId ? { ...mentor, status: newStatus } : mentor
      ));

      toast({
        title: "Status Updated",
        description: `Mentor status has been updated to ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update mentor status.",
      });
    }
  };

  // Handle delete
  const handleDelete = async (mentorId: string) => {
    if (!window.confirm("Are you sure you want to delete this mentor?")) return;

    try {
      const response = await fetch(`/api/admin/mentors/${mentorId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete mentor");
      }

      setMentors(mentors.filter((mentor) => mentor.id !== mentorId));

      toast({
        title: "Mentor Deleted",
        description: "The mentor has been successfully deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete mentor.",
      });
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
          <Button asChild>
            <Link href="/dashboard-admin/mentors/add">
              <UserPlus className="mr-2 h-4 w-4 text-white" />
                <span className="text-white">Add Mentor</span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="mb-4">
          <Input
            placeholder="Search mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Mentors Table */}
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
                      variant={mentor.status === "ACTIVE" ? "success" : "default"}
                    >
                      {mentor.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
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
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(
                            mentor.id,
                            mentor.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                          )}
                        >
                          {mentor.status === "ACTIVE" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(mentor.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
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
    </Card>
  );
}