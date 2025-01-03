// components/client/mentor/MentorList.tsx
import { motion } from "framer-motion";
import { MentorCard } from "./MentorCard";

type MentorListProps = {
  recommendations: Array<{
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
    };
  }>;
};

export const MentorList = ({ recommendations }: MentorListProps) => {
  return (
    <motion.div 
      className="grid gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {recommendations
        .sort((a, b) => b.matchingScore - a.matchingScore) // Sort by matching score
        .map((rec, index) => (
        <motion.div
          key={rec.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MentorCard
            key={rec.id}
            id={rec.mentor.id}
            fullName={rec.mentor.fullName}
            jobRole={rec.mentor.jobRole}
            company={rec.mentor.company}
            education={rec.mentor.education}
            expertise={rec.mentor.expertise}
            matchingScore={rec.matchingScore}
            matchingCriteria={rec.matchingCriteria}
            rank={index + 1}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};