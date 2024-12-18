// components/mentor/dashboard/MentorGreeting.tsx
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { Clock } from "lucide-react";
import { getMentorSession } from "@/lib/auth";

export async function MentorGreeting() {
  const session = await getMentorSession();
  const currentDateTime = new Date();
  const hour = currentDateTime.getHours();
  
  let greeting = "Good Morning";
  let timeOfDay = "morning";
  let message = "Start your day with inspiring others";
  
  if (hour >= 12 && hour < 15) {
    greeting = "Good Afternoon";
    timeOfDay = "afternoon";
    message = "Continue making a positive impact";
  } else if (hour >= 15 && hour < 18) {
    greeting = "Good Evening";
    timeOfDay = "evening";
    message = "Keep guiding and inspiring";
  } else if (hour >= 18) {
    greeting = "Good Night";
    timeOfDay = "night";
    message = "Reflect on today's achievements";
  }

  const mentorName = session?.fullName?.split(' ')[0] || 'Mentor';
  
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-white">
      <div className="relative z-10 space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">{greeting}, {mentorName}!</h1>
          <p className="text-primary-100 text-lg">
            A perfect {timeOfDay} to {message.toLowerCase()}.
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-primary-100">
          <Clock className="h-4 w-4" />
          <p className="text-sm">
            {formatDate(currentDateTime)}
          </p>
        </div>
      </div>
      
      {/* Decorative Pattern */}
      <div className="absolute right-0 top-0 h-full w-1/3">
        <div className="absolute inset-0 bg-gradient-to-l from-primary-800/50 to-transparent" />
        <Image
          src="/images/dashboard-pattern.svg"
          alt="Pattern"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>
    </div>
  );
}