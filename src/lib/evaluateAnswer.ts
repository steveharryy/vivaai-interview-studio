import { supabase } from "@/integrations/supabase/client";

export interface EvaluationRequest {
  interviewType: string;
  currentQuestion: string;
  candidateAnswer: string;
}

export interface EvaluationResponse {
  score: number;
  confidence: "low" | "medium" | "high";
  hesitation: boolean;
  summary: string;
}

export async function evaluateAnswer(request: EvaluationRequest): Promise<EvaluationResponse> {
  const { data, error } = await supabase.functions.invoke('evaluate-answer', {
    body: request,
  });

  if (error) {
    console.error('Error calling evaluate-answer function:', error);
    throw new Error(error.message || 'Failed to evaluate answer');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as EvaluationResponse;
}