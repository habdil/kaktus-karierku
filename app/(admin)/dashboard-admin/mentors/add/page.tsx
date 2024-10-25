import { Metadata } from "next";
import { AddMentorForm } from "@/components/admin/AddMentorForm";

export const metadata: Metadata = {
  title: "Add New Mentor - Admin Dashboard",
  description: "Add a new mentor to the platform",
};

export default function AddMentorPage() {
  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add New Mentor</h1>
        <p className="text-muted-foreground">
          Add a new mentor to the platform by filling out the form below.
        </p>
      </div>
      
      <AddMentorForm />
    </div>
  );
}