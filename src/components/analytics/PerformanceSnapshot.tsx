import { motion } from "framer-motion";
import { Target, Clock, TrendingUp, Zap, Award, AlertTriangle } from "lucide-react";
import type { Interview, Confidence, Difficulty } from "@/hooks/useInterviews";
import {
  calculateAverageScore,
  calculateOverallConfidence,
  calculateCurrentDifficulty,
  calculateHesitationRate,
} from "@/lib/analyticsUtils";

interface PerformanceSnapshotProps {
  interviews: Interview[];
}

const confidenceLabels: Record<Confidence, { label: string; color: string }> = {
  high: { label: "High", color: "text-success" },
  medium: { label: "Medium", color: "text-warning" },
  low: { label: "Low", color: "text-destructive" },
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function PerformanceSnapshot({ interviews }: PerformanceSnapshotProps) {
  const totalInterviews = interviews.length;
  const avgScore = calculateAverageScore(interviews);
  const confidence = calculateOverallConfidence(interviews);
  const difficulty = calculateCurrentDifficulty(interviews);
  const hesitationRate = calculateHesitationRate(interviews);

  // Calculate recent trend
  const recent = interviews.slice(0, 5);
  const older = interviews.slice(5, 10);
  const recentAvg = recent.length > 0 ? calculateAverageScore(recent) : 0;
  const olderAvg = older.length > 0 ? calculateAverageScore(older) : recentAvg;
  const trend = recentAvg - olderAvg;
  const trendLabel = trend >= 0 ? `+${trend.toFixed(1)}` : trend.toFixed(1);

  const stats = [
    {
      icon: Target,
      label: "Total Interviews",
      value: totalInterviews.toString(),
      subtext: "completed",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Award,
      label: "Average Score",
      value: avgScore.toFixed(1),
      subtext: `${trendLabel} vs previous`,
      color: "bg-accent/10 text-accent",
      trend: trend >= 0,
    },
    {
      icon: Zap,
      label: "Confidence Level",
      value: confidenceLabels[confidence].label,
      subtext: `${100 - hesitationRate}% delivery rate`,
      color: `bg-success/10 ${confidenceLabels[confidence].color}`,
    },
    {
      icon: TrendingUp,
      label: "Current Difficulty",
      value: difficultyLabels[difficulty],
      subtext: "most practiced",
      color: "bg-warning/10 text-warning",
    },
  ];

  if (totalInterviews === 0) {
    return (
      <div className="card-elevated p-8 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium mb-2">No Interview Data Yet</h3>
        <p className="text-muted-foreground text-sm">
          Complete your first interview to see performance analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="card-elevated p-5 group hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            {stat.trend !== undefined && (
              <span className={`text-xs font-medium ${stat.trend ? "text-success" : "text-destructive"}`}>
                {stat.trend ? "↑" : "↓"} {trendLabel}
              </span>
            )}
          </div>
          
          <div className="font-editorial text-3xl mb-1">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
          <div className="text-xs text-muted-foreground/70 mt-1">{stat.subtext}</div>
        </motion.div>
      ))}
    </div>
  );
}
