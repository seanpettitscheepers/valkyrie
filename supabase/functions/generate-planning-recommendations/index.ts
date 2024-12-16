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
    const { objective, totalBudget, platforms, targetingObjectives } = await req.json();

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const configuration = new Configuration({ apiKey: openAiKey });
    const openai = new OpenAIApi(configuration);

    const prompt = `As an expert marketing strategist, provide recommendations for a campaign with the following details:

Objective: ${objective}
Total Budget: $${totalBudget}
Platforms: ${platforms.join(', ')}
Current Targeting Objectives: ${JSON.stringify(targetingObjectives, null, 2)}

Please provide specific recommendations in these areas:
1. Budget allocation across platforms
2. Additional targeting suggestions
3. Creative approach recommendations
4. Campaign optimization tips

Format your response as specific, actionable recommendations in these categories.`;

    console.log('Sending prompt to OpenAI:', prompt);

    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert digital advertising strategist who provides data-driven recommendations based on campaign objectives and parameters."
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

    return new Response(
      JSON.stringify({ recommendations: response }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in generate-planning-recommendations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});