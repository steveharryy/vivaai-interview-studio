import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  BarChart3, 
  RefreshCw, 
  Trophy, 
  Sparkles,
  ArrowRight,
  Share2,
  Home
} from "lucide-react";
import { useInterviews } from "@/hooks/useInterviews";
import { PerformanceSnapshot } from "@/components/analytics/PerformanceSnapshot";
import { ProgressCharts } from "@/components/analytics/ProgressCharts";
import { BehavioralInsights } from "@/components/analytics/BehavioralInsights";
import { CoachingSuggestion } from "@/components/analytics/CoachingSuggestion";
import { LatestInterviewCard } from "@/components/analytics/LatestInterviewCard";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateAverageScore } from "@/lib/analyticsUtils";

export default function Analytics() {
  const { data: interviews = [], isLoading, refetch, isRefetching } = useInterviews();
  const [searchParams] = useSearchParams();
  const isPostInterview = searchParams.get("from") === "interview";
  const latestInterview = interviews[0];
  const avgScore = calculateAverageScore(interviews);

  // Determine celebration level based on latest score
  const getCelebrationLevel = () => {
    if (!latestInterview) return "neutral";
    if (latestInterview.score >= 8) return "excellent";
    if (latestInterview.score >= 6) return "good";
    if (latestInterview.score >= 4) return "okay";
    return "needs-work";
  };

  const celebrationLevel = getCelebrationLevel();

  const celebrationMessages = {
    excellent: { title: "Outstanding Performance! 🎉", subtitle: "You're crushing it! Keep up this momentum." },
    good: { title: "Great Job! 👏", subtitle: "You're making solid progress. A few more sessions to excellence." },
    okay: { title: "Nice Effort! 💪", subtitle: "Every practice makes you stronger. Let's keep improving." },
    "needs-work": { title: "Keep Going! 🚀", subtitle: "Practice is the path to mastery. Your next one will be better." },
    neutral: { title: "Your Performance Dashboard", subtitle: "Track progress, identify patterns, and unlock your potential." },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background gradient for post-interview celebration */}
      {isPostInterview && celebrationLevel !== "neutral" && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-3xl ${
              celebrationLevel === "excellent" ? "bg-success/10" :
              celebrationLevel === "good" ? "bg-primary/10" :
              celebrationLevel === "okay" ? "bg-warning/10" :
              "bg-accent/10"
            }`}
          />
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                {isPostInterview ? (
                  <Trophy className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <BarChart3 className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
              <div>
                <h1 className="font-semibold">
                  {isPostInterview ? "Interview Complete" : "Analytics & Coaching"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {interviews.length} interview{interviews.length !== 1 ? "s" : ""} analyzed
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="rounded-full"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline ml-2">Refresh</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 relative">
        {/* Hero Section - Different for post-interview vs normal visit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-2xl mx-auto"
        >
          {isPostInterview && celebrationLevel !== "neutral" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Interview Completed</span>
            </motion.div>
          )}
          
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl mb-3">
            {celebrationMessages[celebrationLevel].title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {celebrationMessages[celebrationLevel].subtitle}
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Main Content */}
        {!isLoading && (
          <>
            {/* Latest Interview Score Highlight (only if post-interview or has interviews) */}
            {latestInterview && (
              <section>
                <LatestInterviewCard 
                  interview={latestInterview} 
                  isHighlighted={isPostInterview}
                  totalInterviews={interviews.length}
                  averageScore={avgScore}
                />
              </section>
            )}

            {/* Section 1: Performance Snapshot */}
            <section>
              <SectionHeader 
                title="Performance Overview" 
                description="Your key metrics at a glance"
              />
              <PerformanceSnapshot interviews={interviews} />
            </section>

            {/* Section 2: Progress Charts */}
            <section>
              <SectionHeader 
                title="Progress Over Time" 
                description="Visualize your improvement journey"
              />
              <ProgressCharts interviews={interviews} />
            </section>

            {/* Section 3: Behavioral Insights */}
            <section>
              <SectionHeader 
                title="Behavioral Patterns" 
                description="AI-detected patterns from your interviews"
              />
              <BehavioralInsights interviews={interviews} />
            </section>

            {/* Section 4: Personalized Coaching Suggestion */}
            <section>
              <SectionHeader 
                title="Your Personal Coach" 
                description="Tailored recommendations based on your performance"
              />
              <CoachingSuggestion interviews={interviews} />
            </section>

            {/* Quick Actions Footer */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-border/50"
            >
              <Link to="/practice">
                <Button size="lg" className="rounded-full group">
                  Start Another Interview
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="rounded-full">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </motion.section>
          </>
        )}
      </main>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mb-4"
    >
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Latest interview skeleton */}
      <div className="card-elevated p-8">
        <div className="flex flex-col items-center">
          <Skeleton className="w-32 h-32 rounded-full mb-4" />
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card-elevated p-5">
            <Skeleton className="w-10 h-10 rounded-xl mb-3" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-elevated p-6">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-6" />
          <Skeleton className="h-[280px] w-full rounded-xl" />
        </div>
        <div className="card-elevated p-6">
          <Skeleton className="h-6 w-36 mb-2" />
          <Skeleton className="h-4 w-28 mb-4" />
          <Skeleton className="h-[180px] w-full rounded-full mx-auto" />
        </div>
      </div>

      {/* Insights skeleton */}
      <div className="card-elevated p-6">
        <Skeleton className="h-6 w-52 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
