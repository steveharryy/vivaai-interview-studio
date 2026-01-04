import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, RefreshCw } from "lucide-react";
import { useInterviews } from "@/hooks/useInterviews";
import { PerformanceSnapshot } from "@/components/analytics/PerformanceSnapshot";
import { ProgressCharts } from "@/components/analytics/ProgressCharts";
import { BehavioralInsights } from "@/components/analytics/BehavioralInsights";
import { CoachingSuggestion } from "@/components/analytics/CoachingSuggestion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Analytics() {
  const { data: interviews = [], isLoading, refetch, isRefetching } = useInterviews();

  return (
    <div className="min-h-screen bg-background">
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
                <BarChart3 className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold">Analytics & Coaching</h1>
                <p className="text-xs text-muted-foreground">
                  {interviews.length} interviews analyzed
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="rounded-full"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="font-editorial text-3xl sm:text-4xl mb-2">
            Your Performance Dashboard
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Real-time insights and personalized coaching based on your interview history.
            Every suggestion is tailored to help you improve.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Main Content */}
        {!isLoading && (
          <>
            {/* Section 1: Performance Snapshot */}
            <section>
              <PerformanceSnapshot interviews={interviews} />
            </section>

            {/* Section 2: Progress Charts */}
            <section>
              <ProgressCharts interviews={interviews} />
            </section>

            {/* Section 3: Behavioral Insights */}
            <section>
              <BehavioralInsights interviews={interviews} />
            </section>

            {/* Section 4: Personalized Coaching Suggestion */}
            <section>
              <CoachingSuggestion interviews={interviews} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
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
