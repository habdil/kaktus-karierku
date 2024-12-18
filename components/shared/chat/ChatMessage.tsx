import React from 'react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  status?: 'SENT' | 'DELIVERED' | 'READ';
}

export default function ChatMessage({
  content,
  timestamp,
  isCurrentUser,
  status
}: ChatMessageProps) {
  return (
    <div 
      className={cn(
        "flex w-full mb-4",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "max-w-[70%]",
        isCurrentUser ? "items-end" : "items-start"
      )}>
        {/* Bubble chat dengan warna yang berbeda */}
        <div className={cn(
          "rounded-2xl px-4 py-2 text-sm",
          isCurrentUser 
            ? "bg-blue-500 text-white rounded-tr-none" 
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        )}>
          <p className="whitespace-pre-wrap break-words">{content}</p>
          
          {/* Footer bubble chat */}
          <div className={cn(
            "flex items-center gap-1 mt-1",
            isCurrentUser ? "justify-end" : "justify-start"
          )}>
            <span className={cn(
              "text-[10px]",
              isCurrentUser ? "text-blue-50" : "text-gray-500"
            )}>
              {format(new Date(timestamp), "HH:mm")}
            </span>
            
            {/* Status indikator hanya untuk pengirim */}
            {isCurrentUser && status && (
              <span className={cn(
                "text-[10px] ml-1",
                status === 'SENT' && "text-blue-50/70",
                status === 'DELIVERED' && "text-blue-50/85",
                status === 'READ' && "text-blue-50"
              )}>
                {status === 'SENT' && '✓'}
                {status === 'DELIVERED' && '✓✓'}
                {status === 'READ' && '✓✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}