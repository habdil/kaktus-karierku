import { AlertTriangle, Clock, Settings, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeatureMaintenanceProps {
  title: string;
  description: string;
  eta?: string;
}

export function FeatureMaintenance({ title, description, eta }: FeatureMaintenanceProps) {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden relative border border-blue-300 dark:border-blue-800 rounded-lg animate-pulse-border">
      <CardHeader className="bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-900 dark:to-orange-900 pb-10 relative">
        {/* Title with subtle glow */}
        <CardTitle className="text-2xl font-bold flex items-center gap-2 text-blue-700 dark:text-blue-200">
          <Settings className="w-6 h-6 text-orange-500" />
          {title}
        </CardTitle>
        
        <CardDescription className="text-blue-600 dark:text-blue-300 mt-2">
          We're working on something awesome!
        </CardDescription>

        {/* Floating wrench icon */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 animate-float">
          <div className="bg-white dark:bg-blue-800 rounded-full p-4 shadow-md">
            <Wrench className="w-8 h-8 text-orange-500 animate-glow" />
          </div>
        </div>
      </CardHeader>

      {/* Divider line */}
      <div className="h-1 bg-gradient-to-r from-blue-300 via-orange-500 to-blue-300"></div>

      <CardContent className="pt-10 pb-6 px-6">
        <p className="text-center text-muted-foreground mb-4">{description}</p>
        
        <div className="flex justify-center items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium">Feature Unavailable</span>
        </div>
        
        {eta && (
          <div className="mt-4 flex justify-center items-center">
            <Badge variant="outline" className="flex items-center gap-1 border-blue-500 text-blue-600 dark:border-blue-300 dark:text-blue-200">
              <Clock className="w-3 h-3 text-orange-500" />
              Estimated completion: {eta}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
