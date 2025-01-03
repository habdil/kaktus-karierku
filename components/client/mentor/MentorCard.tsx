"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Brain, 
  Target, 
  Medal,
  Coffee,
  Sparkles,
  Rocket,
  Lightbulb,
  Users,
  Crown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type MentorExpertise = {
  area: string;
  tags: string[];
};

type MentorCardProps = {
  id: string;
  fullName: string;
  jobRole: string;
  company: string;
  education: string;
  expertise: MentorExpertise[];
  matchingScore: number;
  matchingCriteria: {
    expertiseMatch: Array<{
      area: string;
      matchingTags: string[];
    }>;
  };
  rank: number;
};

type Achievement = {
  icon: JSX.Element;
  label: string;
  color: string;
  bgColor: string;
};

export const MentorCard = ({
  id,
  fullName,
  jobRole,
  company,
  education,
  expertise,
  matchingScore,
  matchingCriteria,
  rank,
}: MentorCardProps) => {
  const router = useRouter();
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const getAchievements = (): Achievement[] => {
    const achievements: Achievement[] = [];

    // Achievement berdasarkan rank
    if (rank === 1) {
      achievements.push({
        icon: <Crown className="w-4 h-4" />,
        label: "Mentor Terbaik",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
      });
    }

    // Achievement berdasarkan matching score
    if (matchingScore >= 85) {
      achievements.push({
        icon: <Target className="w-4 h-4" />,
        label: "Sangat Cocok",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      });
    }

    // Cek expertise untuk achievement khusus
    const allExpertise = expertise.map(e => e.area.toLowerCase()).join(" ");
    const allTags = matchingCriteria.expertiseMatch
      .flatMap(m => m.matchingTags)
      .join(" ")
      .toLowerCase();

    // Achievement berdasarkan kombinasi expertise dan tags
    if (allExpertise.includes("tech") || allTags.includes("programming")) {
      achievements.push({
        icon: <Brain className="w-4 h-4" />,
        label: "Tech Expert",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
      });
    }

    if (allExpertise.includes("lead") || allTags.includes("leadership")) {
      achievements.push({
        icon: <Users className="w-4 h-4" />,
        label: "Leadership",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
      });
    }

    if (matchingScore >= 80 && (allTags.includes("mentor") || allTags.includes("teaching"))) {
      achievements.push({
        icon: <Heart className="w-4 h-4" />,
        label: "Mentor Penyabar",
        color: "text-rose-600",
        bgColor: "bg-rose-50",
      });
    }

    if (allTags.includes("innov") || allTags.includes("creative")) {
      achievements.push({
        icon: <Lightbulb className="w-4 h-4" />,
        label: "Inovatif",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      });
    }

    if (matchingScore >= 75) {
      achievements.push({
        icon: <Rocket className="w-4 h-4" />,
        label: "Motivator",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      });
    }

    return achievements.slice(0, 4); // Batasi 4 achievement
  };

  const achievements = getAchievements();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Avatar className="w-16 h-16 border-2 border-blue-100">
                <AvatarImage src={`/api/client/avatar/${id}`} />
                <AvatarFallback className="bg-blue-50 text-blue-500">{initials}</AvatarFallback>
              </Avatar>
            </motion.div>

            <div>
              <CardTitle className="flex items-center gap-2">
                {fullName}
                {rank === 1 && (
                  <motion.div
                    animate={{ rotate: [-10, 10] }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                  >
                    <Medal className="h-5 w-5 text-amber-500" />
                  </motion.div>
                )}
              </CardTitle>
              <CardDescription>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  <span>{jobRole} at {company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  <span>{education}</span>
                </div>
              </CardDescription>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {achievements.map((achievement, idx) => (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Badge 
                variant="secondary"
                className={`flex items-center gap-1 px-2 py-1 ${achievement.bgColor} ${achievement.color} border-none`}
              >
                {achievement.icon}
                <span>{achievement.label}</span>
              </Badge>
            </motion.div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-500" />
              Bidang Keahlian
            </h4>
            <div className="flex flex-wrap gap-2">
              {expertise.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Badge variant="default" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                    {exp.area}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              Area Kecocokan
            </h4>
            <div className="space-y-2">
              {matchingCriteria.expertiseMatch.map((match, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="text-sm text-muted-foreground mb-1">
                    {match.area}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {match.matchingTags.map((tag, tagIdx) => (
                      <Badge 
                        key={tagIdx} 
                        variant="outline"
                        className="border-blue-200 text-blue-600"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white group-hover:shadow-md transition-all duration-300"
          onClick={() => router.push(`/dashboard/consultation/${id}`)}
        >
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Coffee className="w-4 h-4" />
            Mulai Konsultasi
          </motion.div>
        </Button>
      </CardFooter>
    </Card>
  );
};