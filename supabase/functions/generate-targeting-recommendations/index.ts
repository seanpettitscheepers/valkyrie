import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    // Parse the request body
    let requestData;
    try {
      requestData = await req.json();
      console.log('Received request data:', requestData);
    } catch (error) {
      console.error('Error parsing request JSON:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: error.message 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { audienceData } = requestData;

    if (!audienceData) {
      console.error('No audience data provided');
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
      console.error('OpenAI API key not configured');
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

    console.log('Sending prompt to OpenAI:', prompt);

    // Call OpenAI API
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a marketing analytics expert who provides targeting recommendations based on audience data. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = completion.data.choices[0]?.message?.content;
    console.log('OpenAI response:', responseText);

    if (!responseText) {
      console.error('No response from OpenAI');
      return new Response(
        JSON.stringify({ error: 'No response from OpenAI' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse and validate the response
    let recommendations;
    try {
      recommendations = JSON.parse(responseText.trim());
      
      if (!Array.isArray(recommendations) || recommendations.length !== 3) {
        throw new Error('Invalid response format - expected array of 3 recommendations');
      }

      // Validate each recommendation object
      recommendations.forEach((rec, index) => {
        if (!rec.type || !rec.recommendation || !rec.reasoning || !rec.potentialImpact) {
          throw new Error(`Missing required fields in recommendation ${index + 1}`);
        }
        if (!['demographic', 'behavioral', 'interest'].includes(rec.type)) {
          throw new Error(`Invalid type in recommendation ${index + 1}`);
        }
        if (!['high', 'medium', 'low'].includes(rec.potentialImpact)) {
          throw new Error(`Invalid potentialImpact in recommendation ${index + 1}`);
        }
      });

    } catch (error) {
      console.error('Error parsing OpenAI response:', error, 'Response text:', responseText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate valid recommendations',
          details: error.message,
          responseText 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Return the validated recommendations
    return new Response(
      JSON.stringify({ recommendations }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});