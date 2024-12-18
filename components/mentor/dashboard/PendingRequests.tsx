// components/mentor/dashboard/PendingRequests.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, InboxIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type RequestData = {
  id: string;
  client: {
    fullName: string;
    major: string | null;
    user: {
      id: string;
      name: string | null;
    };
  };
};

interface PendingRequestsProps {
  requests: RequestData[];
}

export function PendingRequests({ requests }: PendingRequestsProps) {
  const router = useRouter();

  const handlePendingClick = () => {
    router.push('/dashboard-mentor/consultation');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Consultation Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between space-x-4 rounded-lg border p-4"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{request.client.fullName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {request.client.major || 'Major not specified'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="text-white bg-orange-500 hover:bg-orange-600"
                    onClick={handlePendingClick}
                  >
                    <UserCheck className="h-4 w-4 mr-1 text-white" />
                    Pending
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <InboxIcon className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-lg font-medium text-muted-foreground">No pending requests found</p>
              <p className="text-sm text-muted-foreground mt-1">
                You currently have no pending consultation requests
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}