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