import { supabase } from "@/integrations/supabase/client";

export interface CoachingInput {
  lastFiveScores: number[];
  confidenceTrend: ('low' | 'medium' | 'high')[];
  hesitationFrequency: number;
  interviewType: string;
}

export interface CoachingFeedback {
  strength: string;
  observation: string;
  coachingInsight: string;
  actionableTip: string;
}

export async function getCoachingFeedback(input: CoachingInput): Promise<CoachingFeedback> {
  const { data, error } = await supabase.functions.invoke('coaching-feedback', {
    body: input
  });

  if (error) {
    console.error('Coaching feedback error:', error);
    throw new Error(error.message || 'Failed to generate coaching feedback');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as CoachingFeedback;
}
