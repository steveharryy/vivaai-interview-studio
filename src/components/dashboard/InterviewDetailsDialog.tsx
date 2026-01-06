import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Mic, 
  Video, 
  Trophy, 
  Clock, 
  Zap, 
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface InterviewDetails {
  id: number;
  type: "text" | "voice" | "video";
  role: string;
  score: number;
  date: string;
  duration?: string;
  questionsAnswered?: number;
  strengths?: string[];
  improvements?: string[];
}

interface InterviewDetailsDialogProps {
  interview: InterviewDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeConfig = {
  text: {
    icon: MessageSquare,
    label: "Text Interview",
    gradient: "from-cyan-400 to-teal-500",
    bg: "bg-cyan-500/10 text-cyan-400",
  },
  voice: {
    icon: Mic,
    label: "Voice Interview",
    gradient: "from-orange-400 to-rose-500",
    bg: "bg-orange-500/10 text-orange-400",
  },
  video: {
    icon: Video,
    label: "Video Interview",
    gradient: "from-violet-400 to-purple-500",
    bg: "bg-violet-500/10 text-violet-400",
  },
};

export function InterviewDetailsDialog({ 
  interview, 
  open, 
  onOpenChange 
}: InterviewDetailsDialogProps) {
  if (!interview) return null;

  const config = typeConfig[interview.type];
  const Icon = config.icon;

  // Calculate score color and label
  const getScoreInfo = (score: number) => {
    if (score >= 90) return { color: "text-success", bg: "bg-success/10", label: "Excellent" };
    if (score >= 80) return { color: "text-primary", bg: "bg-primary/10", label: "Great" };
    if (score >= 70) return { color: "text-warning", bg: "bg-warning/10", label: "Good" };
    return { color: "text-destructive", bg: "bg-destructive/10", label: "Needs Work" };
  };

  const scoreInfo = getScoreInfo(interview.score);

  // Calculate the ring progress
  const progressPercentage = interview.score;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border/60">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              config.bg
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-left font-display text-xl">
                {interview.role}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">{config.label} • {interview.date}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Score Display */}
          <div className="flex items-center gap-6 p-6 rounded-2xl bg-secondary/50 border border-border/50">
            {/* Score Ring */}
            <div className="relative shrink-0">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="54"
                  strokeWidth="6"
                  className="fill-none stroke-muted/30"
                />
                <motion.circle
                  cx="56"
                  cy="56"
                  r="54"
                  strokeWidth="6"
                  className={cn("fill-none", 
                    interview.score >= 90 ? "stroke-success" :
                    interview.score >= 80 ? "stroke-primary" :
                    interview.score >= 70 ? "stroke-warning" :
                    "stroke-destructive"
                  )}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  style={{ strokeDasharray: circumference }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("font-display text-3xl font-bold", scoreInfo.color)}>
                  {interview.score}%
                </span>
              </div>
            </div>

            {/* Score Details */}
            <div className="flex-1">
              <div className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium mb-2",
                scoreInfo.bg, scoreInfo.color
              )}>
                <Trophy className="w-4 h-4" />
                {scoreInfo.label}
              </div>
              <p className="text-muted-foreground text-sm">
                {interview.score >= 80 
                  ? "You demonstrated strong interview skills!" 
                  : interview.score >= 70 
                  ? "Good performance with room for improvement."
                  : "Keep practicing to improve your score!"}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-secondary/30 text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium">{interview.duration || "15 min"}</p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 text-center">
              <Zap className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium">{interview.questionsAnswered || 8}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium">+5%</p>
              <p className="text-xs text-muted-foreground">vs Average</p>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-success/5 border border-success/20">
              <h4 className="flex items-center gap-2 font-medium text-success mb-3">
                <CheckCircle2 className="w-4 h-4" />
                Strengths
              </h4>
              <ul className="space-y-2">
                {(interview.strengths || ["Clear communication", "Good examples", "Confident delivery"]).map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
              <h4 className="flex items-center gap-2 font-medium text-warning mb-3">
                <AlertCircle className="w-4 h-4" />
                To Improve
              </h4>
              <ul className="space-y-2">
                {(interview.improvements || ["Add more specifics", "Reduce filler words", "Structure answers"]).map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link to="/analytics" className="flex-1">
              <Button variant="outline" className="w-full rounded-xl">
                View Full Analytics
              </Button>
            </Link>
            <Link to={`/interview/${interview.type}`} className="flex-1">
              <Button className="w-full rounded-xl group">
                Practice Again
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
