import type { Interview, Confidence, InterviewType, Difficulty } from "@/hooks/useInterviews";

// ============================================
// AGGREGATION FUNCTIONS
// ============================================

/**
 * Calculates average score from interviews
 */
export function calculateAverageScore(interviews: Interview[]): number {
  if (interviews.length === 0) return 0;
  const sum = interviews.reduce((acc, i) => acc + i.score, 0);
  return Math.round((sum / interviews.length) * 10) / 10;
}

/**
 * Determines overall confidence level based on frequency
 */
export function calculateOverallConfidence(interviews: Interview[]): Confidence {
  if (interviews.length === 0) return "medium";
  
  const counts = { low: 0, medium: 0, high: 0 };
  interviews.forEach((i) => counts[i.confidence]++);
  
  if (counts.high >= counts.medium && counts.high >= counts.low) return "high";
  if (counts.low >= counts.medium && counts.low >= counts.high) return "low";
  return "medium";
}

/**
 * Determines current difficulty level (mode of recent interviews)
 */
export function calculateCurrentDifficulty(interviews: Interview[]): Difficulty {
  if (interviews.length === 0) return "easy";
  
  // Look at last 5 interviews
  const recent = interviews.slice(0, 5);
  const counts = { easy: 0, medium: 0, hard: 0 };
  recent.forEach((i) => counts[i.difficulty]++);
  
  if (counts.hard >= counts.medium && counts.hard >= counts.easy) return "hard";
  if (counts.medium >= counts.easy) return "medium";
  return "easy";
}

/**
 * Calculates hesitation rate as percentage
 */
export function calculateHesitationRate(interviews: Interview[]): number {
  if (interviews.length === 0) return 0;
  const hesitationCount = interviews.filter((i) => i.hesitation).length;
  return Math.round((hesitationCount / interviews.length) * 100);
}

/**
 * Groups interviews by date for trend charts
 */
export function groupByDate(interviews: Interview[]): { date: string; score: number; count: number }[] {
  const grouped: Record<string, { scores: number[]; count: number }> = {};
  
  interviews.forEach((interview) => {
    const date = new Date(interview.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    
    if (!grouped[date]) {
      grouped[date] = { scores: [], count: 0 };
    }
    grouped[date].scores.push(interview.score);
    grouped[date].count++;
  });
  
  return Object.entries(grouped)
    .map(([date, data]) => ({
      date,
      score: Math.round((data.scores.reduce((a, b) => a + b, 0) / data.scores.length) * 10) / 10,
      count: data.count,
    }))
    .reverse(); // Chronological order
}

/**
 * Groups confidence trend over time
 */
export function groupConfidenceByDate(interviews: Interview[]): { date: string; low: number; medium: number; high: number }[] {
  const grouped: Record<string, { low: number; medium: number; high: number }> = {};
  
  interviews.forEach((interview) => {
    const date = new Date(interview.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    
    if (!grouped[date]) {
      grouped[date] = { low: 0, medium: 0, high: 0 };
    }
    grouped[date][interview.confidence]++;
  });
  
  return Object.entries(grouped)
    .map(([date, counts]) => ({ date, ...counts }))
    .reverse();
}

/**
 * Calculates performance by interview type
 */
export function getPerformanceByType(interviews: Interview[]): { type: InterviewType; avgScore: number; count: number }[] {
  const grouped: Record<InterviewType, { scores: number[] }> = {
    hr: { scores: [] },
    behavioral: { scores: [] },
    technical: { scores: [] },
  };
  
  interviews.forEach((i) => {
    grouped[i.interview_type].scores.push(i.score);
  });
  
  return (Object.entries(grouped) as [InterviewType, { scores: number[] }][])
    .map(([type, data]) => ({
      type,
      avgScore: data.scores.length > 0
        ? Math.round((data.scores.reduce((a, b) => a + b, 0) / data.scores.length) * 10) / 10
        : 0,
      count: data.scores.length,
    }))
    .filter((d) => d.count > 0);
}

/**
 * Determines average answer length category
 */
export function getAnswerLengthCategory(interviews: Interview[]): "too_short" | "ideal" | "too_long" {
  if (interviews.length === 0) return "ideal";
  
  const avgLength = interviews.reduce((acc, i) => acc + i.answer_length, 0) / interviews.length;
  
  // These thresholds can be adjusted based on interview type expectations
  if (avgLength < 50) return "too_short";
  if (avgLength > 300) return "too_long";
  return "ideal";
}

// ============================================
// BEHAVIORAL PATTERN INSIGHTS
// ============================================

export interface BehavioralInsight {
  type: "success" | "warning" | "info";
  title: string;
  message: string;
}

/**
 * Generates behavioral insights from interview data
 * Returns 2-3 data-driven insights
 */
export function generateBehavioralInsights(interviews: Interview[]): BehavioralInsight[] {
  if (interviews.length === 0) return [];
  
  const insights: BehavioralInsight[] = [];
  
  // 1. Hesitation frequency analysis
  const hesitationRate = calculateHesitationRate(interviews);
  const recentInterviews = interviews.slice(0, 5);
  const recentHesitationRate = calculateHesitationRate(recentInterviews);
  const olderInterviews = interviews.slice(5);
  const olderHesitationRate = olderInterviews.length > 0 ? calculateHesitationRate(olderInterviews) : hesitationRate;
  
  if (recentHesitationRate < olderHesitationRate - 10) {
    insights.push({
      type: "success",
      title: "Hesitation Improving",
      message: `Your hesitation dropped from ${olderHesitationRate}% to ${recentHesitationRate}% in recent sessions. Your answers are becoming more confident.`,
    });
  } else if (hesitationRate > 50) {
    insights.push({
      type: "warning",
      title: "High Hesitation Rate",
      message: `You hesitated in ${hesitationRate}% of responses. Consider practicing common questions to build confidence.`,
    });
  } else if (hesitationRate < 20) {
    insights.push({
      type: "success",
      title: "Strong Delivery",
      message: `Only ${hesitationRate}% hesitation rate shows confident, well-prepared responses.`,
    });
  }
  
  // 2. Answer length pattern
  const answerCategory = getAnswerLengthCategory(interviews);
  if (answerCategory === "too_short") {
    insights.push({
      type: "warning",
      title: "Answers May Be Too Brief",
      message: "Your average answer length is below recommended. Try adding more context and examples to strengthen your responses.",
    });
  } else if (answerCategory === "too_long") {
    insights.push({
      type: "info",
      title: "Consider Conciseness",
      message: "Your answers tend to be lengthy. Practice summarizing key points to keep responses focused and impactful.",
    });
  } else {
    insights.push({
      type: "success",
      title: "Ideal Answer Length",
      message: "Your responses have appropriate depth without being too verbose. Keep maintaining this balance.",
    });
  }
  
  // 3. Strongest vs weakest interview type
  const performanceByType = getPerformanceByType(interviews);
  if (performanceByType.length >= 2) {
    const sorted = [...performanceByType].sort((a, b) => b.avgScore - a.avgScore);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];
    
    if (strongest.avgScore - weakest.avgScore >= 1.5) {
      const typeLabels: Record<InterviewType, string> = {
        hr: "HR",
        behavioral: "Behavioral",
        technical: "Technical",
      };
      
      insights.push({
        type: "info",
        title: "Performance Gap Detected",
        message: `You excel in ${typeLabels[strongest.type]} interviews (${strongest.avgScore}/10) but struggle with ${typeLabels[weakest.type]} (${weakest.avgScore}/10). Focus on ${typeLabels[weakest.type]} practice.`,
      });
    }
  }
  
  return insights.slice(0, 3);
}

// ============================================
// PERSONALIZED SUGGESTIONS
// ============================================

export interface PersonalizedSuggestion {
  improvementArea: string;
  actionableTip: string;
  nextBestAction: {
    label: string;
    interviewType: InterviewType;
    difficulty: Difficulty;
  };
}

/**
 * Generates personalized coaching suggestion based on performance data
 * Returns ONE specific, actionable recommendation
 */
export function generatePersonalizedSuggestion(interviews: Interview[]): PersonalizedSuggestion | null {
  if (interviews.length === 0) return null;
  
  const avgScore = calculateAverageScore(interviews);
  const hesitationRate = calculateHesitationRate(interviews);
  const currentDifficulty = calculateCurrentDifficulty(interviews);
  const performanceByType = getPerformanceByType(interviews);
  const overallConfidence = calculateOverallConfidence(interviews);
  
  // Recent performance trend
  const recentAvg = calculateAverageScore(interviews.slice(0, 3));
  const olderAvg = interviews.length > 3 ? calculateAverageScore(interviews.slice(3, 6)) : avgScore;
  const isImproving = recentAvg > olderAvg;
  
  // Find weakest interview type
  const weakestType = performanceByType.length > 0
    ? [...performanceByType].sort((a, b) => a.avgScore - b.avgScore)[0]
    : null;
  
  // Decision logic for improvement area
  let improvementArea: string;
  let actionableTip: string;
  let nextBestAction: PersonalizedSuggestion["nextBestAction"];
  
  // Priority 1: High hesitation rate
  if (hesitationRate > 40) {
    improvementArea = "Response Confidence";
    actionableTip = "Practice the STAR method (Situation, Task, Action, Result) before answering. Take a 2-second pause to structure your thoughts instead of rushing into answers.";
    nextBestAction = {
      label: `Practice ${currentDifficulty === "easy" ? "Easy" : "Medium"} Behavioral`,
      interviewType: "behavioral",
      difficulty: currentDifficulty === "hard" ? "medium" : currentDifficulty,
    };
  }
  // Priority 2: Low confidence consistently
  else if (overallConfidence === "low") {
    improvementArea = "Building Confidence";
    actionableTip = "Record yourself answering questions and review them. Focus on maintaining steady pace and avoiding filler words like 'um' or 'like'.";
    nextBestAction = {
      label: "Start with Easy HR Interview",
      interviewType: "hr",
      difficulty: "easy",
    };
  }
  // Priority 3: Score trending down
  else if (!isImproving && avgScore < 6) {
    improvementArea = "Foundational Skills";
    actionableTip = "Go back to basics: practice common questions in your weakest area. Quality repetition builds muscle memory for strong answers.";
    nextBestAction = {
      label: weakestType ? `Retry ${weakestType.type.charAt(0).toUpperCase() + weakestType.type.slice(1)} Interview` : "Start Easy Interview",
      interviewType: weakestType?.type || "hr",
      difficulty: "easy",
    };
  }
  // Priority 4: Ready to level up
  else if (isImproving && avgScore >= 7 && hesitationRate < 30) {
    const nextDifficulty: Difficulty = currentDifficulty === "easy" ? "medium" : "hard";
    improvementArea = "Advancing Difficulty";
    actionableTip = "You're showing consistent improvement. Challenge yourself with harder questions to prepare for real-world pressure.";
    nextBestAction = {
      label: `Move to ${nextDifficulty.charAt(0).toUpperCase() + nextDifficulty.slice(1)} Difficulty`,
      interviewType: weakestType?.type || "technical",
      difficulty: nextDifficulty,
    };
  }
  // Priority 5: Focus on weak area
  else if (weakestType && weakestType.avgScore < avgScore - 1) {
    const typeLabels: Record<InterviewType, string> = {
      hr: "HR",
      behavioral: "Behavioral", 
      technical: "Technical",
    };
    improvementArea = `${typeLabels[weakestType.type]} Interview Skills`;
    actionableTip = `Your ${typeLabels[weakestType.type].toLowerCase()} interview score (${weakestType.avgScore}/10) is below your average. Practice this type specifically to close the gap.`;
    nextBestAction = {
      label: `Practice ${typeLabels[weakestType.type]} Interview`,
      interviewType: weakestType.type,
      difficulty: currentDifficulty,
    };
  }
  // Default: maintain momentum
  else {
    improvementArea = "Consistent Practice";
    actionableTip = "You're on track. Keep practicing regularly to maintain your edge. Try mixing different interview types to stay adaptable.";
    nextBestAction = {
      label: "Continue Current Practice",
      interviewType: "behavioral",
      difficulty: currentDifficulty,
    };
  }
  
  return { improvementArea, actionableTip, nextBestAction };
}

// ============================================
// CHART DATA HELPERS
// ============================================

/**
 * Formats interview type distribution for pie chart
 */
export function getTypeDistribution(interviews: Interview[]): { name: string; value: number; color: string }[] {
  const counts = { hr: 0, behavioral: 0, technical: 0 };
  interviews.forEach((i) => counts[i.interview_type]++);
  
  return [
    { name: "HR", value: counts.hr, color: "hsl(var(--primary))" },
    { name: "Behavioral", value: counts.behavioral, color: "hsl(var(--accent))" },
    { name: "Technical", value: counts.technical, color: "hsl(var(--warning))" },
  ].filter((d) => d.value > 0);
}

/**
 * Formats difficulty distribution for visualization
 */
export function getDifficultyDistribution(interviews: Interview[]): { difficulty: string; count: number }[] {
  const counts = { easy: 0, medium: 0, hard: 0 };
  interviews.forEach((i) => counts[i.difficulty]++);
  
  return [
    { difficulty: "Easy", count: counts.easy },
    { difficulty: "Medium", count: counts.medium },
    { difficulty: "Hard", count: counts.hard },
  ].filter((d) => d.count > 0);
}
