import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { audienceData } = await req.json();

    if (!audienceData) {
      return new Response(
        JSON.stringify({ error: 'No audience data provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize OpenAI
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const configuration = new Configuration({ apiKey: openAiKey });
    const openai = new OpenAIApi(configuration);

    // Prepare the prompt
    const prompt = `Based on the following audience data, provide 3 targeting recommendations:
    ${JSON.stringify(audienceData, null, 2)}
    
    Format your response as a JSON array with exactly 3 objects, each containing:
    - type: either "demographic", "behavioral", or "interest"
    - recommendation: a clear, actionable targeting suggestion
    - reasoning: explanation for the recommendation
    - potentialImpact: either "high", "medium", or "low"
    
    Focus on actionable insights that can improve campaign performance.`;

    // Call OpenAI API
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a marketing analytics expert who provides targeting recommendations based on audience data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Parse and validate the response
    const responseText = completion.data.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    let recommendations;
    try {
      recommendations = JSON.parse(responseText);
      if (!Array.isArray(recommendations) || recommendations.length !== 3) {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate valid recommendations' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Return the recommendations
    return new Response(
      JSON.stringify({ recommendations }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});