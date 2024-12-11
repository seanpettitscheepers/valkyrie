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
    const { performanceData, audienceData, sentimentData } = await req.json();

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const configuration = new Configuration({ apiKey: openAiKey });
    const openai = new OpenAIApi(configuration);

    const prompt = `Based on the following campaign data, provide comprehensive insights and recommendations:

Performance Metrics:
${JSON.stringify(performanceData, null, 2)}

Audience Data:
${JSON.stringify(audienceData, null, 2)}

Brand Sentiment:
${JSON.stringify(sentimentData, null, 2)}

Please provide insights in the following format:
1. Key Performance Insights
2. Audience Behavior Analysis
3. Brand Perception Analysis
4. Optimization Recommendations
5. Future Campaign Planning Suggestions

Focus on actionable insights and specific recommendations.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a marketing analytics expert who provides detailed campaign insights and recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const insights = completion.data.choices[0]?.message?.content;

    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-report-insights:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});