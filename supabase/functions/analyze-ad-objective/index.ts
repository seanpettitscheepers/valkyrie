import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { objective, historicalPerformance } = await req.json();

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const configuration = new Configuration({ apiKey: openAiKey });
    const openai = new OpenAIApi(configuration);

    const prompt = `Based on the following advertising objective and historical performance data, provide specific recommendations for platforms, targeting, and creative approach:

Objective: ${objective}

Historical Performance Data:
${JSON.stringify(historicalPerformance, null, 2)}

Please provide recommendations in these three areas:
1. Which platforms would be most effective and why
2. Specific targeting strategies that would work best
3. Creative approaches and content types that would resonate with the target audience

Format your response as specific, actionable recommendations in these categories.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert digital advertising strategist who provides data-driven recommendations based on campaign objectives and historical performance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.data.choices[0]?.message?.content;
    
    // Parse the response into sections
    const sections = response?.split('\n\n') || [];
    
    return new Response(
      JSON.stringify({
        platforms: sections[0] || "No platform recommendations available.",
        targeting: sections[1] || "No targeting recommendations available.",
        creatives: sections[2] || "No creative recommendations available.",
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in analyze-ad-objective:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});