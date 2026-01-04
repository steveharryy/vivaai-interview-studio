import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Confidence = "low" | "medium" | "high";
export type InterviewType = "hr" | "behavioral" | "technical";
export type Difficulty = "easy" | "medium" | "hard";

export interface Interview {
  id: string;
  user_id: string;
  score: number;
  confidence: Confidence;
  hesitation: boolean;
  interview_type: InterviewType;
  difficulty: Difficulty;
  answer_length: number;
  created_at: string;
}

/**
 * Fetches all interviews for the current authenticated user
 * Orders by created_at descending (most recent first)
 */
export function useInterviews() {
  return useQuery({
    queryKey: ["interviews"],
    queryFn: async (): Promise<Interview[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching interviews:", error);
        throw error;
      }

      return (data as Interview[]) || [];
    },
  });
}

/**
 * Fetches the last N interviews for the current user
 */
export function useRecentInterviews(limit: number = 5) {
  return useQuery({
    queryKey: ["interviews", "recent", limit],
    queryFn: async (): Promise<Interview[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching recent interviews:", error);
        throw error;
      }

      return (data as Interview[]) || [];
    },
  });
}
