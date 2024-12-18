// 2. ChatBox.tsx
import React, { useEffect, useRef } from 'react';
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  content: string;
  type: 'TEXT' | 'SYSTEM';
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: Date;
  readAt?: Date;
}

interface Participant {
  id: string;
  name: string;
  image?: string;
  status?: 'online' | 'offline';
}

interface ChatBoxProps {
  messages: Message[];
  currentUserId: string;
  participant: Participant;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  isSending?: boolean;
  userRole: 'CLIENT' | 'MENTOR';
}

export default function ChatBox({
  messages,
  currentUserId,
  participant,
  onSendMessage,
  isLoading = false,
  isSending = false,
  userRole
}: ChatBoxProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="py-3 px-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarImage src={participant.image} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {participant.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">{participant.name}</h3>
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "w-2 h-2 rounded-full",
                participant.status === 'online' ? "bg-green-500" : "bg-gray-300"
              )} />
              <span className="text-sm text-gray-600">
                {participant.status === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent 
        ref={messageContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-white"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No messages yet</p>
            </div>
          </div>
        ) : (
          <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  timestamp={message.createdAt}
                  isCurrentUser={message.senderId === currentUserId}
                />
              ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>

      <CardFooter className="border-t p-4 bg-gray-50">
        <div className="w-full">
          {isSending ? (
            <div className="text-center text-sm text-gray-500">
              Sending message...
            </div>
          ) : (
            <ChatInput 
              onSendMessage={onSendMessage}
              placeholder="Type a message..."
              disabled={isLoading}
            />
          )}
        </div>
      </CardFooter>
    </div>
  );
}