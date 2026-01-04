import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EvaluationRequest {
  interviewType: string;
  currentQuestion: string;
  candidateAnswer: string;
}

interface EvaluationResponse {
  score: number;
  confidence: "low" | "medium" | "high";
  hesitation: boolean;
  summary: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { interviewType, currentQuestion, candidateAnswer }: EvaluationRequest = await req.json();

    // Validate input
    if (!interviewType || !currentQuestion || !candidateAnswer) {
      console.error('Missing required fields:', { interviewType, currentQuestion, candidateAnswer });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: interviewType, currentQuestion, candidateAnswer' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Evaluating answer:', { interviewType, currentQuestion, answerLength: candidateAnswer.length });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert interview evaluator. Your job is to assess candidate responses with precision and critical analysis.

STRICT RULES:
1. DO NOT give generic praise like "great answer" or "well done"
2. DO NOT ask follow-up questions
3. Focus ONLY on: relevance to the question, clarity of expression, and confidence indicators
4. Be critical but fair - identify specific weaknesses
5. Detect hesitation markers: filler words (um, uh, like), vague language, circular reasoning, or lack of specifics

SCORING CRITERIA (1-10):
- 1-3: Poor - Off-topic, unclear, or fundamentally wrong
- 4-5: Below Average - Partially relevant but lacks depth or clarity
- 6-7: Average - Addresses the question adequately with minor issues
- 8-9: Good - Clear, relevant, and demonstrates competence
- 10: Excellent - Exceptional clarity, depth, and confidence

CONFIDENCE ASSESSMENT:
- "low": Answer shows uncertainty, vagueness, or lack of conviction
- "medium": Reasonably confident but could be stronger
- "high": Demonstrates clear conviction and authority

HESITATION DETECTION:
- true: Contains filler words, vague statements, or signs of uncertainty
- false: Direct, clear, and confident delivery

You must respond with ONLY valid JSON matching this exact schema:
{
  "score": <number 1-10>,
  "confidence": "<low|medium|high>",
  "hesitation": <true|false>,
  "summary": "<one sentence explanation of the score, max 100 characters>"
}`;

    const userPrompt = `Interview Type: ${interviewType}
Question: ${currentQuestion}
Candidate Answer: ${candidateAnswer}

Evaluate this response and return ONLY the JSON object.`;

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent evaluation
        max_tokens: 200,
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

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error('No content in AI response:', data);
      throw new Error('No content in AI response');
    }

    // Parse the JSON response from AI
    let evaluation: EvaluationResponse;
    try {
      // Clean the response in case there's markdown code blocks
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      evaluation = JSON.parse(cleanedContent);
      
      // Validate the response structure
      if (typeof evaluation.score !== 'number' || evaluation.score < 1 || evaluation.score > 10) {
        throw new Error('Invalid score value');
      }
      if (!['low', 'medium', 'high'].includes(evaluation.confidence)) {
        throw new Error('Invalid confidence value');
      }
      if (typeof evaluation.hesitation !== 'boolean') {
        throw new Error('Invalid hesitation value');
      }
      if (typeof evaluation.summary !== 'string' || evaluation.summary.length === 0) {
        throw new Error('Invalid summary value');
      }
      
      console.log('Evaluation result:', evaluation);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content, parseError);
      // Return a fallback evaluation if parsing fails
      evaluation = {
        score: 5,
        confidence: 'medium',
        hesitation: false,
        summary: 'Unable to fully evaluate response. Please try again.'
      };
    }

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in evaluate-answer function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});