"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, ArrowRight, Target, Sparkles, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LoadingBars } from "@/components/ui/loading-bars";
import { Skeleton } from "@/components/ui/skeleton";

export function CareerCardSkeleton() {
  return (
    <Card className="w-full h-full border-2">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Skeleton */}
        <div className="rounded-lg p-4 border bg-muted/5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>

        {/* Benefits Skeleton */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </div>

        {/* Button Skeleton */}
        <Skeleton className="h-11 w-full" />

        {/* Info Text Skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-3 w-48" />
        </div>
      </CardContent>
    </Card>
  );
}

interface Assessment {
  hasAssessment: boolean;
  assessmentId: string | null;
  createdAt?: string;
}

export default function CareerRecommendation() {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAssessment = async () => {
      try {
        const response = await fetch("/api/client/career-assessment/check");
        const data = await response.json();

        setAssessment({
          hasAssessment: data.hasAssessment,
          assessmentId: data.assessmentId,
          createdAt: data.hasAssessment ? data.assessment?.createdAt : null
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check assessment status"
        });
      } finally {
        setLoading(false);
      }
    };

    checkAssessment();
  }, [toast]);

  if (loading) {
    return <CareerCardSkeleton />;
  }

  const isCompleted = assessment?.hasAssessment ?? false;
  const completedDate = assessment?.createdAt 
    ? new Date(assessment.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) 
    : null;

  return (
    <Card className="w-full h-full border-2 hover:border-primary/50 transition-all">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Career Personalization</CardTitle>
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground">
          {isCompleted 
            ? "View your personalized career insights"
            : "Discover your perfect career path"}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Indicator */}
        <div className={`rounded-lg p-4 border ${
          isCompleted 
            ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/20' 
            : 'bg-primary/5 border-primary/10'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${
              isCompleted 
                ? 'bg-green-100 dark:bg-green-900/20' 
                : 'bg-primary/10'
            }`}>
              {isCompleted 
                ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                : <Target className="h-4 w-4 text-primary" />
              }
            </div>
            <div className="flex-1">
              <div className={`text-sm font-medium ${
                isCompleted ? 'text-green-600 dark:text-green-400' : 'text-primary'
              }`}>
                Status
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {isCompleted 
                  ? `Assessment completed on ${completedDate}`
                  : "Assessment not completed"}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits or Results Summary */}
        <div className="space-y-4">
          {isCompleted ? (
            <div className="flex items-start gap-3">
              <div className="rounded-full p-2 bg-secondary/10">
                <Clock className="h-4 w-4 text-secondary-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium">View Your Results</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Check your career analysis and mentor recommendations
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="rounded-full p-2 bg-secondary/10">
                <ClipboardList className="h-4 w-4 text-secondary-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Personalized Career Path</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Get tailored recommendations based on your skills and interests
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link 
          href={isCompleted ? "/dashboard/career/results" : "/dashboard/career"} 
          className="block"
        >
          <Button 
            className={`w-full group relative text-white ${
              isCompleted ? 'bg-green-600 hover:bg-green-700' : ''
            }`}
            size="lg"
          >
            <span>{isCompleted ? "View Results" : "Start Assessment"}</span>
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>

        {/* Additional Info */}
        {!isCompleted && (
          <p className="text-xs text-center text-muted-foreground">
            Takes approximately 5-10 minutes to complete
          </p>
        )}
      </CardContent>
    </Card>
  );
}
