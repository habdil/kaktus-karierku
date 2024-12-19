import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { Badge } from "@/components/ui/badge";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs";
  import {
    Briefcase,
    GraduationCap,
    Heart,
    Book,
    Clock,
    Bell,
    MessageCircle,
  } from "lucide-react";
  import { format, formatDistanceToNow } from "date-fns";
  
  interface Client {
    id: string;
    fullName: string;
    email: string;
    image: string | null;
    major: string | null;
    currentStatus: string | null;
    dreamJob: string | null;
    mentorshipStatus: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
    interests: string[];
    hobbies: string[];
    lastConsultation?: {
      id: string;
      status: string;
      createdAt: string;
    };
    lastMessage?: {
      content: string;
      createdAt: string;
    };
    recentNotifications?: Array<{
      id: string;
      title: string;
      message: string;
      createdAt: string;
    }>;
    joinedDate: string;
  }
  
  interface ClientDetailDialogProps {
    client: Client;
    trigger?: React.ReactNode;
  }
  
  export default function ClientDetailDialog({ client, trigger }: ClientDetailDialogProps) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {trigger || <Button>View Details</Button>}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
  
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={client.image || undefined} alt={client.fullName} />
                <AvatarFallback>{client.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">{client.fullName}</h2>
                <p className="text-muted-foreground">{client.email}</p>
                <Badge variant="outline">
                  Joined {formatDistanceToNow(new Date(client.joinedDate))} ago
                </Badge>
              </div>
            </div>
  
            {/* Main Content Tabs */}
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="consultations">Consultations</TabsTrigger>
              </TabsList>
  
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {client.major && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Major</p>
                          <p className="text-sm text-muted-foreground">{client.major}</p>
                        </div>
                      </div>
                    )}
                    {client.dreamJob && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Dream Job</p>
                          <p className="text-sm text-muted-foreground">{client.dreamJob}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
  
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-4 w-4" /> Interests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {client.interests?.length > 0 ? (
                          client.interests.map((interest, index) => (
                            <Badge key={index} variant="info">
                              {interest}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No interests listed</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Book className="h-4 w-4" /> Hobbies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {client.hobbies?.length > 0 ? (
                          client.hobbies.map((hobby, index) => (
                            <Badge key={index} variant="info">
                              {hobby}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No hobbies listed</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
  
              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {client.recentNotifications && client.recentNotifications.length > 0 ? (
                      client.recentNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-start gap-3 border-b last:border-0 pb-3"
                        >
                          <Bell className="h-5 w-5 text-muted-foreground mt-1" />
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(notification.createdAt))} ago
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No recent activities</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
  
              {/* Consultations Tab */}
              <TabsContent value="consultations">
                <Card>
                  <CardHeader>
                    <CardTitle>Consultation History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {client.lastConsultation ? (
                      <div className="flex items-start gap-3 border-b pb-3">
                        <MessageCircle className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <p className="font-medium">Last Consultation</p>
                          <p className="text-sm text-muted-foreground">
                            Status: {client.lastConsultation.status}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(client.lastConsultation.createdAt), 'PPP')}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No consultation history found.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    );
  }