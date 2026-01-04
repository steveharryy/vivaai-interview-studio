import { supabase } from "@/integrations/supabase/client";
import type { EvaluationResponse } from "./evaluateAnswer";

export interface AdaptiveRequest {
  interviewType: string;
  currentDifficulty: "easy" | "medium" | "hard";
  answerEvaluation: EvaluationResponse;
}

export interface AdaptiveResponse {
  nextDifficulty: "easy" | "medium" | "hard";
  interviewerTone: "supportive" | "neutral" | "challenging";
  nextQuestion: string;
}

export async function getNextQuestion(request: AdaptiveRequest): Promise<AdaptiveResponse> {
  const { data, error } = await supabase.functions.invoke('next-question', {
    body: request,
  });

  if (error) {
    console.error('Error calling next-question function:', error);
    throw new Error(error.message || 'Failed to get next question');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as AdaptiveResponse;
}