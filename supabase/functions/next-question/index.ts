import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnswerEvaluation {
  score: number;
  confidence: "low" | "medium" | "high";
  hesitation: boolean;
}

interface AdaptiveRequest {
  interviewType: string;
  currentDifficulty: "easy" | "medium" | "hard";
  answerEvaluation: AnswerEvaluation;
}

interface AdaptiveResponse {
  nextDifficulty: "easy" | "medium" | "hard";
  interviewerTone: "supportive" | "neutral" | "challenging";
  nextQuestion: string;
}

// Rule-based difficulty adjustment
function calculateNextDifficulty(
  currentDifficulty: "easy" | "medium" | "hard",
  evaluation: AnswerEvaluation
): "easy" | "medium" | "hard" {
  const { score, confidence, hesitation } = evaluation;

  // Rule: Reduce difficulty if hesitation is true or score ≤ 4
  if (hesitation || score <= 4) {
    if (currentDifficulty === "hard") return "medium";
    if (currentDifficulty === "medium") return "easy";
    return "easy";
  }

  // Rule: Increase difficulty only if confidence is high AND score ≥ 7
  if (confidence === "high" && score >= 7) {
    if (currentDifficulty === "easy") return "medium";
    if (currentDifficulty === "medium") return "hard";
    return "hard";
  }

  // Otherwise, maintain current difficulty
  return currentDifficulty;
}

// Rule-based tone adjustment
function calculateInterviewerTone(
  nextDifficulty: "easy" | "medium" | "hard",
  evaluation: AnswerEvaluation
): "supportive" | "neutral" | "challenging" {
  const { score, confidence, hesitation } = evaluation;

  // Supportive tone for struggling candidates
  if (hesitation || score <= 4 || confidence === "low") {
    return "supportive";
  }

  // Challenging tone for high performers on hard difficulty
  if (nextDifficulty === "hard" && confidence === "high" && score >= 8) {
    return "challenging";
  }

  // Neutral for everyone else
  return "neutral";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { interviewType, currentDifficulty, answerEvaluation }: AdaptiveRequest = await req.json();

    // Validate input
    if (!interviewType || !currentDifficulty || !answerEvaluation) {
      console.error('Missing required fields:', { interviewType, currentDifficulty, answerEvaluation });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: interviewType, currentDifficulty, answerEvaluation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Adaptive question request:', { interviewType, currentDifficulty, answerEvaluation });

    // Apply rule-based logic
    const nextDifficulty = calculateNextDifficulty(currentDifficulty, answerEvaluation);
    const interviewerTone = calculateInterviewerTone(nextDifficulty, answerEvaluation);

    console.log('Calculated adaptations:', { nextDifficulty, interviewerTone });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Generate the next question using AI
    const systemPrompt = `You are an expert interviewer conducting a ${interviewType}.

YOUR TASK: Generate exactly ONE interview question.

DIFFICULTY LEVEL: ${nextDifficulty}
- easy: Basic questions about fundamentals, simple scenarios, straightforward expectations
- medium: Situational questions requiring specific examples, moderate complexity
- hard: Complex behavioral questions, pressure scenarios, deep technical or strategic thinking

INTERVIEWER TONE: ${interviewerTone}
- supportive: Warm, encouraging phrasing that puts candidate at ease
- neutral: Professional, direct questioning without emotional coloring
- challenging: Probing, pushing for deeper answers, slightly demanding

RULES:
1. Ask ONLY ONE question
2. Do NOT include any preamble, explanation, or follow-up
3. Do NOT number the question
4. Match the difficulty and tone exactly
5. Make the question relevant to ${interviewType}
6. The question should be different from common basic questions like "tell me about yourself"

Respond with ONLY the question text, nothing else.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate the next ${nextDifficulty} difficulty question with a ${interviewerTone} tone for a ${interviewType}.` }
        ],
        temperature: 0.7, // Higher temperature for variety in questions
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received:', data);

    let nextQuestion = data.choices?.[0]?.message?.content?.trim();
    
    if (!nextQuestion) {
      console.error('No question in AI response:', data);
      // Fallback questions based on difficulty
      const fallbackQuestions = {
        easy: "What motivates you in your work?",
        medium: "Describe a time when you had to adapt to a significant change at work.",
        hard: "Tell me about a situation where you had to make a critical decision with incomplete information and significant consequences."
      };
      nextQuestion = fallbackQuestions[nextDifficulty];
    }

    // Clean up the question (remove quotes if wrapped)
    nextQuestion = nextQuestion.replace(/^["']|["']$/g, '').trim();

    const result: AdaptiveResponse = {
      nextDifficulty,
      interviewerTone,
      nextQuestion
    };

    console.log('Adaptive response:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in next-question function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
