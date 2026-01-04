import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Lightbulb, Sparkles } from "lucide-react";
import type { Interview } from "@/hooks/useInterviews";
import { generateBehavioralInsights, type BehavioralInsight } from "@/lib/analyticsUtils";

interface BehavioralInsightsProps {
  interviews: Interview[];
}

const insightIcons = {
  success: CheckCircle2,
  warning: AlertCircle,
  info: Lightbulb,
};

const insightStyles = {
  success: "bg-success/10 border-success/20",
  warning: "bg-warning/10 border-warning/20",
  info: "bg-primary/10 border-primary/20",
};

const iconStyles = {
  success: "text-success",
  warning: "text-warning",
  info: "text-primary",
};

export function BehavioralInsights({ interviews }: BehavioralInsightsProps) {
  const insights = generateBehavioralInsights(interviews);

  if (interviews.length === 0) {
    return null;
  }

  if (insights.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="card-elevated p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-medium">Behavioral Pattern Insights</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          Complete more interviews to unlock pattern analysis and personalized insights.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="card-elevated p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <div>
          <h3 className="font-medium">Behavioral Pattern Insights</h3>
          <p className="text-sm text-muted-foreground">Patterns detected from your interview history</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insightIcons[insight.type];
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`flex items-start gap-4 p-4 rounded-xl border ${insightStyles[insight.type]}`}
            >
              <div className={`shrink-0 mt-0.5 ${iconStyles[insight.type]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
