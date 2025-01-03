"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CareerPersonalizationForm from "@/components/client/personalisasi/Personalisasi";
import { motion, AnimatePresence } from "framer-motion";
import Background from "@/components/client/career/Background";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Trophy, Rocket, Brain, Star, Sparkles, Map, Compass } from "lucide-react";

const GameLoading = ({ text, icon: Icon = Rocket }: { text: string; icon?: any }) => {
  const [dots, setDots] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    "Setiap jawaban membawa Anda lebih dekat ke karir impian! ✨",
    "Jelajahi berbagai kemungkinan karir Anda! 🌟",
    "Perjalanan seribu mil dimulai dari langkah pertama! 🚀",
    "Temukan potensi tersembunyi Anda! 💫"
  ];

  useEffect(() => {
    const dotsInterval = setInterval(() => setDots(prev => (prev + 1) % 4), 500);
    const tipsInterval = setInterval(() => setCurrentTip(prev => (prev + 1) % tips.length), 3000);
    return () => {
      clearInterval(dotsInterval);
      clearInterval(tipsInterval);
    };
  }, [tips.length]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-blue-100 max-w-md">
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
          className="w-20 h-20 text-blue-500"
        >
          <Icon className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-6 bg-blue-200/50 rounded-full blur-lg"
        />
      </div>
      
      <div className="space-y-4 text-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xl font-medium text-blue-600"
        >
          {text}
          <span className="inline-block w-8 text-blue-400">
            {".".repeat(dots)}
          </span>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-sm text-gray-600 italic"
          >
            {tips[currentTip]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const QuestCard = ({ icon: Icon, title, description }: any) => (
  <motion.li
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-start gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-blue-100"
  >
    <div className="mt-1">
      <Icon className="h-5 w-5 text-blue-500" />
    </div>
    <div>
      <h3 className="font-medium text-blue-700">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </motion.li>
);

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
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Background />
        <GameLoading text="Mempersiapkan petualangan karir Anda" icon={Map} />
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-8">
        <Background />
        <GameLoading text="Menganalisis perjalanan karir Anda" icon={Compass} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-md text-center px-4"
        >
          <p className="text-blue-600/80 text-sm">
            Menggunakan AI untuk menemukan jalur karir terbaik untuk Anda...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Background />
      
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[90vw] sm:w-[500px] p-6 overflow-y-auto max-h-[85vh] bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/20">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent -z-10 rounded-lg"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <AlertDialogHeader className="space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center"
            >
              <Trophy className="h-8 w-8 text-blue-500" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 text-center"
            >
              <AlertDialogTitle className="text-xl sm:text-2xl text-blue-600">
                Mulai Petualangan Karir Anda! 🚀
              </AlertDialogTitle>
              
              <AlertDialogDescription className="space-y-6">
                <p className="text-gray-600">
                  Bersiaplah untuk memulai perjalanan menemukan karir impian Anda!
                </p>
                
                <Card className="bg-white/80 backdrop-blur-sm border-blue-100 p-4">
                  <ul className="space-y-4">
                    {[
                      {
                        icon: Star,
                        title: "Kesempatan Spesial",
                        description: "Petualangan unik yang hanya bisa diambil satu kali per akun"
                      },
                      {
                        icon: Brain,
                        title: "Analisis AI",
                        description: "AI canggih akan menganalisis setiap jawaban Anda dengan cermat"
                      },
                      {
                        icon: Sparkles,
                        title: "Personalisasi Penuh",
                        description: "Temukan rekomendasi yang benar-benar sesuai dengan Anda"
                      }
                    ].map((quest, index) => (
                      <QuestCard 
                        key={index} 
                        icon={quest.icon} 
                        title={quest.title} 
                        description={quest.description}
                      />
                    ))}
                  </ul>
                </Card>
              </AlertDialogDescription>
            </motion.div>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="mt-6 flex justify-center">
            <AlertDialogAction 
              onClick={handleWarningClose}
              className="w-full sm:w-auto text-white bg-blue-500 hover:bg-blue-600 transition-colors px-8 py-2 rounded-full"
            >
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket className="h-5 w-5" />
                Mulai Petualangan!
              </motion.div>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!showWarning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto py-4 sm:py-8 px-4 sm:px-6"
        >
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center space-y-3 sm:space-y-4"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
                Petualangan Karir Anda
              </h1>
              <p className="text-sm sm:text-lg text-gray-600">
                Mari temukan jalur karir yang sempurna untuk Anda
              </p>
            </motion.div>
            
            <CareerPersonalizationForm setSubmitting={setSubmitting} />
          </div>
        </motion.div>
      )}
    </>
  );
}