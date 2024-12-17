import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const configuration = new Configuration({ apiKey: openAiKey });
    const openai = new OpenAIApi(configuration);

    let prompt = '';
    switch (action) {
      case 'generate-targeting':
        prompt = `Based on the following audience data, provide 3 targeting recommendations:
        ${JSON.stringify(data.audienceData, null, 2)}
        
        Format your response as a JSON array with exactly 3 objects, each containing:
        - type: either "demographic", "behavioral", or "interest"
        - recommendation: a clear, actionable targeting suggestion
        - reasoning: explanation for the recommendation
        - potentialImpact: either "high", "medium", or "low"`;
        break;

      case 'analyze-objective':
        prompt = `Based on the following advertising objective and historical performance data, provide specific recommendations:
        
        Objective: ${data.objective}
        Historical Performance: ${JSON.stringify(data.historicalPerformance, null, 2)}
        
        Please provide recommendations for:
        1. Which platforms would be most effective and why
        2. Specific targeting strategies that would work best
        3. Creative approaches that would resonate with the target audience`;
        break;

      default:
        throw new Error('Invalid action specified');
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert digital advertising strategist who provides data-driven recommendations."
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
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse and format the response based on the action
    let formattedResponse;
    if (action === 'generate-targeting') {
      formattedResponse = { recommendations: JSON.parse(response.trim()) };
    } else {
      const sections = response.split('\n\n');
      formattedResponse = {
        platforms: sections[0] || "No platform recommendations available.",
        targeting: sections[1] || "No targeting recommendations available.",
        creatives: sections[2] || "No creative recommendations available.",
      };
    }

    return new Response(
      JSON.stringify(formattedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-service:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});