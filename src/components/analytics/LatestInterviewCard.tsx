import { motion } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, Minus, Clock, Zap, Target } from "lucide-react";
import type { Interview, Confidence, Difficulty } from "@/hooks/useInterviews";

interface LatestInterviewCardProps {
  interview: Interview;
  isHighlighted?: boolean;
  totalInterviews: number;
  averageScore: number;
}

const confidenceLabels: Record<Confidence, { label: string; color: string }> = {
  high: { label: "High Confidence", color: "text-success" },
  medium: { label: "Medium Confidence", color: "text-warning" },
  low: { label: "Building Confidence", color: "text-muted-foreground" },
};

const difficultyLabels: Record<Difficulty, { label: string; color: string }> = {
  easy: { label: "Easy", color: "bg-success/10 text-success" },
  medium: { label: "Medium", color: "bg-warning/10 text-warning" },
  hard: { label: "Hard", color: "bg-destructive/10 text-destructive" },
};

const typeLabels: Record<string, string> = {
  hr: "HR Interview",
  behavioral: "Behavioral Interview",
  technical: "Technical Interview",
};

export function LatestInterviewCard({ 
  interview, 
  isHighlighted = false,
  totalInterviews,
  averageScore
}: LatestInterviewCardProps) {
  const scoreDiff = interview.score - averageScore;
  const isAboveAverage = scoreDiff > 0.5;
  const isBelowAverage = scoreDiff < -0.5;

  // Calculate the ring progress (score out of 10)
  const progressPercentage = (interview.score / 10) * 100;
  const circumference = 2 * Math.PI * 58; // radius = 58
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  // Determine score color based on performance
  const getScoreColor = () => {
    if (interview.score >= 8) return "text-success";
    if (interview.score >= 6) return "text-primary";
    if (interview.score >= 4) return "text-warning";
    return "text-destructive";
  };

  const getRingColor = () => {
    if (interview.score >= 8) return "stroke-success";
    if (interview.score >= 6) return "stroke-primary";
    if (interview.score >= 4) return "stroke-warning";
    return "stroke-destructive";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`card-elevated overflow-hidden ${isHighlighted ? "border-primary/30 glow-primary" : ""}`}
    >
      <div className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Score Ring */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, damping: 15 }}
            className="relative shrink-0"
          >
            <svg className="w-36 h-36 transform -rotate-90">
              {/* Background ring */}
              <circle
                cx="72"
                cy="72"
                r="58"
                strokeWidth="8"
                className="fill-none stroke-muted/30"
              />
              {/* Progress ring */}
              <motion.circle
                cx="72"
                cy="72"
                r="58"
                strokeWidth="8"
                className={`fill-none ${getRingColor()}`}
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className={`font-editorial text-4xl ${getScoreColor()}`}
              >
                {interview.score}
              </motion.span>
              <span className="text-sm text-muted-foreground">/10</span>
            </div>
          </motion.div>

          {/* Interview Details */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyLabels[interview.difficulty].color}`}>
                  {difficultyLabels[interview.difficulty].label}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                  {typeLabels[interview.interview_type] || interview.interview_type}
                </span>
              </div>
              
              <h3 className="font-editorial text-2xl mb-1">Latest Interview Score</h3>
              
              <p className={`text-sm flex items-center justify-center lg:justify-start gap-1 ${confidenceLabels[interview.confidence].color}`}>
                <Zap className="w-4 h-4" />
                {confidenceLabels[interview.confidence].label}
                {interview.hesitation && " • Some hesitation detected"}
              </p>
            </motion.div>

            {/* Comparison Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              <div className="p-3 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  {isAboveAverage ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : isBelowAverage ? (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  ) : (
                    <Minus className="w-4 h-4" />
                  )}
                  <span className="text-xs">vs Average</span>
                </div>
                <p className={`font-medium ${
                  isAboveAverage ? "text-success" : 
                  isBelowAverage ? "text-destructive" : 
                  "text-foreground"
                }`}>
                  {scoreDiff >= 0 ? "+" : ""}{scoreDiff.toFixed(1)} pts
                </p>
              </div>
              
              <div className="p-3 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-xs">Your Average</span>
                </div>
                <p className="font-medium">{averageScore.toFixed(1)}/10</p>
              </div>
              
              <div className="p-3 rounded-xl bg-secondary/50 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Trophy className="w-4 h-4 text-warning" />
                  <span className="text-xs">Interview #</span>
                </div>
                <p className="font-medium">{totalInterviews}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
