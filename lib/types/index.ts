// types/index.ts
export interface Event {
    id: string;
    title: string;
    description: string;
    bannerUrl: string;
    location: string;
    date: string;
    admin: {
      fullName: string;
    }
  }

  // types/index.ts
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'EVENT' | 'OTHER';
    createdAt: string;
    read: boolean;
    eventId?: string;
  }