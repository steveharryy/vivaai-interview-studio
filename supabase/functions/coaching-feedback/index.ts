import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CoachingRequest {
  lastFiveScores: number[];
  confidenceTrend: ('low' | 'medium' | 'high')[];
  hesitationFrequency: number;
  interviewType: string;
}

interface CoachingResponse {
  strength: string;
  observation: string;
  coachingInsight: string;
  actionableTip: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lastFiveScores, confidenceTrend, hesitationFrequency, interviewType }: CoachingRequest = await req.json();

    console.log('Coaching feedback request:', { lastFiveScores, confidenceTrend, hesitationFrequency, interviewType });

    if (!lastFiveScores || !confidenceTrend || hesitationFrequency === undefined || !interviewType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const avgScore = lastFiveScores.reduce((a, b) => a + b, 0) / lastFiveScores.length;
    const scoreImprovement = lastFiveScores.length >= 2 
      ? lastFiveScores[lastFiveScores.length - 1] - lastFiveScores[0]
      : 0;
    const highConfidenceCount = confidenceTrend.filter(c => c === 'high').length;
    const lowConfidenceCount = confidenceTrend.filter(c => c === 'low').length;

    const systemPrompt = `You are a professional interview coach analyzing a candidate's recent interview performance. 
Your role is to provide supportive, professional feedback that helps them improve.

CRITICAL RULES:
- Be specific and actionable, not generic
- No empty praise like "Great job!" or "You're doing well!"
- Focus on observable patterns in the data
- Provide one clear, specific tip they can practice immediately
- Keep each field to 1-2 sentences maximum
- Be encouraging but honest about areas needing work`;

    const userPrompt = `Analyze this ${interviewType} interview performance and generate coaching feedback:

Performance Data:
- Last 5 scores: ${JSON.stringify(lastFiveScores)} (scale 1-10)
- Average score: ${avgScore.toFixed(1)}
- Score trend: ${scoreImprovement > 0 ? 'improving' : scoreImprovement < 0 ? 'declining' : 'stable'} (${scoreImprovement > 0 ? '+' : ''}${scoreImprovement.toFixed(1)})
- Confidence levels: ${JSON.stringify(confidenceTrend)}
- High confidence answers: ${highConfidenceCount}/${confidenceTrend.length}
- Low confidence answers: ${lowConfidenceCount}/${confidenceTrend.length}
- Hesitation frequency: ${(hesitationFrequency * 100).toFixed(0)}% of answers showed hesitation

Return ONLY valid JSON in this exact format:
{
  "strength": "One specific strength observed from the data",
  "observation": "One key pattern or trend noticed in their performance",
  "coachingInsight": "A professional insight about what this pattern means",
  "actionableTip": "One specific, practical action they can take before their next interview"
}`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Calling Lovable AI for coaching feedback...');

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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add funds to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    console.log('AI response content:', content);

    let coachingFeedback: CoachingResponse;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      coachingFeedback = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      coachingFeedback = {
        strength: avgScore >= 7 ? "Consistent performance with strong scores" : "Showing determination and willingness to practice",
        observation: scoreImprovement > 0 ? "Scores are trending upward across sessions" : "Performance has room for growth with focused practice",
        coachingInsight: hesitationFrequency > 0.5 ? "Hesitation patterns suggest more preparation on fundamentals would help" : "Confidence levels indicate solid foundational knowledge",
        actionableTip: "Before your next session, practice answering 3 questions out loud using the STAR method"
      };
    }

    console.log('Coaching feedback generated:', coachingFeedback);

    return new Response(
      JSON.stringify(coachingFeedback),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Coaching feedback error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
