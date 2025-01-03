"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MentorList } from "@/components/client/mentor/MentorList";
import { Rocket, Trophy, Star, Brain, Target, Sparkles } from "lucide-react";
import Background from "@/components/client/career/Background";

type Assessment = {
  id: string;
  answers: any;
  geminiResponse: string;
  createdAt: string;
};

type MentorRecommendation = {
  id: string;
  mentor: {
    id: string;
    fullName: string;
    jobRole: string;
    company: string;
    education: string;
    expertise: Array<{
      area: string;
      tags: string[];
    }>;
  };
  matchingScore: number;
  matchingCriteria: {
    expertiseMatch: Array<{
      area: string;
      matchingTags: string[];
    }>;
    workEnvironmentMatch: boolean;
    skillsMatch: string[];
  };
};

// Custom Loading Animation Component
const GameLoading = ({ text }: { text: string }) => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 bg-white rounded-lg p-8 shadow-lg">
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-16 h-16 text-blue-500"
        >
          <Brain className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-4 bg-blue-200 rounded-full blur-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-lg font-medium text-blue-600"
        >
          {text}
        </motion.span>
        <span className="w-6 text-blue-600">
          {".".repeat(dots)}
        </span>
      </div>
    </div>
  );
};

export default function CareerAssessmentResults() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [recommendations, setRecommendations] = useState<MentorRecommendation[]>([]);
  const [showCelebration, setShowCelebration] = useState(true);
  const [activeTab, setActiveTab] = useState("analysis");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch latest assessment
        const assessmentRes = await fetch("/api/client/career-assessment/latest");
        const assessmentData = await assessmentRes.json();

        if (!assessmentData) {
          router.push("/client/dashboard/career");
          return;
        }

        setAssessment(assessmentData);

        // Fetch recommendations
        const recsRes = await fetch(`/api/client/career-assessment/${assessmentData.id}/recomendations`);
        const recsData = await recsRes.json();
        setRecommendations(recsData);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [router]);

  // Background pattern
  const BackgroundPattern = () => (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_50%)] bg-[length:50%_50%]"
        initial={false}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Background />
        <GameLoading text="Menyiapkan hasil analisis karir Anda" />
      </div>
    );
  }

  return (
    <>
      <Background />
      
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white p-8 rounded-xl shadow-xl text-center space-y-6 max-w-md mx-4"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-20 h-20 mx-auto text-yellow-500"
              >
                <Trophy className="w-full h-full" />
              </motion.div>
              <h2 className="text-2xl font-bold text-blue-600">Selamat! 🎉</h2>
              <p className="text-gray-600">
                Analisis karir Anda telah selesai! Mari kita jelajahi potensi karir yang sesuai dengan profil Anda.
              </p>
              <button
                onClick={() => setShowCelebration(false)}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Lihat Hasil
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto py-8 space-y-8">
        <Tabs 
          defaultValue="analysis" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="relative"
        >
          <div className="mb-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-blue-600 mb-2"
            >
              Perjalanan Karir Anda
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600"
            >
              Temukan potensi dan rekomendasi karir yang sesuai dengan profil Anda
            </motion.p>
          </div>

          <TabsList className="grid w-full grid-cols-2 p-1 bg-white shadow-lg rounded-lg">
            <TabsTrigger 
              value="analysis"
              className={`flex items-center gap-2 transition-all duration-300 ${
                activeTab === "analysis" ? "text-blue-600" : ""
              }`}
            >
              <Target className="w-4 h-4" />
              Analisis Karir
            </TabsTrigger>
            <TabsTrigger 
              value="recommendations"
              className={`flex items-center gap-2 transition-all duration-300 ${
                activeTab === "recommendations" ? "text-blue-600" : ""
              }`}
            >
              <Star className="w-4 h-4" />
              Rekomendasi Mentor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-blue-100">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-blue-500" />
                    <CardTitle>Hasil Analisis Karir</CardTitle>
                  </div>
                  <CardDescription>
                    Berdasarkan jawaban Anda, berikut adalah analisis karir yang sesuai
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-blue max-w-none">
                    {assessment?.geminiResponse
                      .split("\n")
                      .map(paragraph => paragraph.replace(/\*/g, '').trim())
                      .filter(paragraph => paragraph.length > 0)
                      .map((paragraph, idx) => (
                        <motion.p
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`${
                            paragraph.match(/^\d\./)
                              ? 'flex items-center gap-2 text-lg font-semibold text-blue-900 mt-6 first:mt-0'
                              : 'text-muted-foreground mt-2 ml-6'
                          }`}
                        >
                          {paragraph.match(/^\d\./) && (
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-blue-500" />
                            </span>
                          )}
                          {paragraph}
                        </motion.p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MentorList recommendations={recommendations} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}