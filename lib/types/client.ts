// lib/types/client.ts
export interface Client {
    id: string;
    fullName: string;
    email: string;
    image: string | null;
    major: string | null;
    currentStatus: string | null;
    dreamJob: string | null;
    interests: string[];
    hobbies: string[];
    mentorshipStatus: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
    lastConsultation?: {
      id: string;
      status: string;
      createdAt: string;
    };
    lastMessage?: {
      content: string;
      createdAt: string;
    };
    careerAssessment?: {
      id: string;
      answers: any;
      geminiResponse: string;
    };
    recentNotifications: Array<{
      id: string;
      title: string;
      message: string;
      createdAt: string;
    }>;
    joinedDate: string;
    relationCreatedAt: string;
  }