import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Target, ArrowRight, Compass, Lightbulb, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Interview } from "@/hooks/useInterviews";
import { generatePersonalizedSuggestion } from "@/lib/analyticsUtils";

interface CoachingSuggestionProps {
  interviews: Interview[];
}

export function CoachingSuggestion({ interviews }: CoachingSuggestionProps) {
  const suggestion = generatePersonalizedSuggestion(interviews);

  if (!suggestion || interviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="card-elevated p-8 text-center"
      >
        <Compass className="w-12 h-12 mx-auto mb-4 text-primary/50" />
        <h3 className="text-lg font-medium mb-2">Your Coaching Awaits</h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
          Complete a few interviews to receive personalized coaching suggestions based on your unique performance patterns.
        </p>
        <Link to="/practice">
          <Button size="lg" className="rounded-full">
            Start Your First Interview
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden"
    >
      {/* Main coaching card */}
      <div className="card-elevated p-6 lg:p-8 border-primary/20">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <span className="tag mb-2">Your Focus Area</span>
            <h3 className="font-editorial text-2xl lg:text-3xl mt-2">{suggestion.improvementArea}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Actionable Tip */}
          <div className="p-5 rounded-xl bg-secondary/50 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium">Actionable Tip</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {suggestion.actionableTip}
            </p>
          </div>

          {/* Next Best Action */}
          <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Rocket className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Recommended Next Step</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your performance, we recommend practicing a{" "}
              <span className="font-medium text-foreground">
                {suggestion.nextBestAction.difficulty} {suggestion.nextBestAction.interviewType}
              </span>{" "}
              interview next.
            </p>
            <Link
              to={`/interview/${suggestion.nextBestAction.interviewType}?difficulty=${suggestion.nextBestAction.difficulty}`}
            >
              <Button className="w-full rounded-full group" size="lg">
                {suggestion.nextBestAction.label}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-3">
          <Link to="/practice">
            <Button variant="outline" size="sm" className="rounded-full">
              Browse All Practice Types
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
