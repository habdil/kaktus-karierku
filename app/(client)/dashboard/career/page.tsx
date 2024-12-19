"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CareerPersonalizationForm from "@/components/client/personalisasi/Personalisasi";
import { LoadingBars } from "@/components/ui/loading-bars";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

export default function CareerPersonalizationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasAssessment, setHasAssessment] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkExistingAssessment = async () => {
      try {
        const response = await fetch("/api/client/career-assessment/check", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.hasAssessment) {
            setHasAssessment(true);
            router.push("/dashboard/career/results");
            return;
          }
          setShowWarning(true);
        }
      } catch (error) {
        console.error("Error checking assessment:", error);
      } finally {
        setLoading(false);
      }
    };
    checkExistingAssessment();
  }, [router]);

  const handleWarningClose = () => {
    setShowWarning(false);
  };

  if (loading || hasAssessment) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingBars text="Loading data..." />
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingBars text="Processing your career personalization..." />
      </div>
    );
  }

  return (
    <>
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-[500px] p-4 sm:p-6 overflow-y-auto max-h-[90vh] sm:max-h-[85vh]">
          <AlertDialogHeader className="space-y-3">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <AlertDialogTitle className="text-base sm:text-lg">
                Important Notice
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-4 text-sm sm:text-base">
              <p className="text-foreground/80">
                Please read carefully before proceeding with the career assessment form:
              </p>
              <ul className="list-disc pl-4 sm:pl-6 space-y-2 text-foreground/80">
                <li>
                  This assessment can only be taken{" "}
                  <span className="font-medium text-foreground">once per account</span>
                </li>
                <li>
                  Take your time to provide thoughtful and honest answers for the most accurate recommendations
                </li>
                <li>
                  The AI analysis will be based solely on your responses, so accuracy is crucial
                </li>
              </ul>
              <p className="pt-2 font-medium text-primary">
                Are you ready to proceed with the assessment?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 sm:mt-6">
            <AlertDialogAction 
              onClick={handleWarningClose}
              className="w-full sm:w-auto text-white bg-primary hover:bg-primary/90"
            >
              Yes, I understand and want to proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!showWarning && (
        <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <div className="text-center space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-900">
                Career Personalization
              </h1>
              <p className="text-sm sm:text-lg text-muted-foreground">
                Fill out the following form to get career recommendations tailored to your profile
              </p>
            </div>
            <CareerPersonalizationForm setSubmitting={setSubmitting} />
          </div>
        </div>
      )}
    </>
  );
}