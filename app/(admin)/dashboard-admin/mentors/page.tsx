import { Metadata } from "next";
import { MentorList } from "@/components/admin/MentorList";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Manage Mentors - Admin Dashboard",
  description: "Manage all mentors in the platform",
};

async function getMentors() {
  const mentors = await prisma.mentor.findMany({
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return mentors.map(mentor => ({
    id: mentor.id,
    fullName: mentor.fullName,
    email: mentor.user.email,
    phoneNumber: mentor.phoneNumber,
    company: mentor.company,
    jobRole: mentor.jobRole,
    status: mentor.status,
    createdAt: mentor.createdAt.toISOString(),
  }));
}

export default async function MentorsPage() {
  const mentors = await getMentors();

  return (
    <div className="container py-6">
      <MentorList initialMentors={mentors} />
    </div>
  );
}