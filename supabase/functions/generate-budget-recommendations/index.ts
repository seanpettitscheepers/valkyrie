import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { objective, platforms, totalBudget, audienceInsightsId, previousCampaignId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Generating budget recommendations for:', {
      objective,
      platforms,
      totalBudget,
      audienceInsightsId,
      previousCampaignId
    });

    // Fetch previous campaign performance if available
    let previousPerformance = null;
    if (previousCampaignId) {
      const { data: metrics, error } = await supabaseClient
        .from('campaign_metrics')
        .select('*')
        .eq('campaign_id', previousCampaignId);

      if (error) throw error;
      previousPerformance = metrics;
    }

    // Simple budget allocation logic (can be enhanced with more sophisticated algorithms)
    const budgetAllocation = {};
    const platformCount = platforms.length;

    // Basic allocation strategies based on objective
    switch (objective) {
      case 'awareness':
        // Prioritize reach-focused platforms
        platforms.forEach(platform => {
          if (platform === 'facebook' || platform === 'instagram') {
            budgetAllocation[platform] = totalBudget * 0.3;
          } else if (platform === 'tiktok') {
            budgetAllocation[platform] = totalBudget * 0.25;
          } else {
            budgetAllocation[platform] = totalBudget * 0.15;
          }
        });
        break;

      case 'consideration':
        // Balance between reach and engagement
        platforms.forEach(platform => {
          if (platform === 'instagram' || platform === 'tiktok') {
            budgetAllocation[platform] = totalBudget * 0.35;
          } else {
            budgetAllocation[platform] = totalBudget * 0.3;
          }
        });
        break;

      case 'conversion':
        // Prioritize conversion-focused platforms
        platforms.forEach(platform => {
          if (platform === 'facebook') {
            budgetAllocation[platform] = totalBudget * 0.4;
          } else if (platform === 'instagram') {
            budgetAllocation[platform] = totalBudget * 0.35;
          } else {
            budgetAllocation[platform] = totalBudget * 0.25;
          }
        });
        break;
    }

    // Normalize allocations to ensure total equals budget
    let totalAllocated = Object.values(budgetAllocation).reduce((sum: number, value: number) => sum + value, 0);
    const scaleFactor = totalBudget / totalAllocated;
    
    for (const platform in budgetAllocation) {
      budgetAllocation[platform] = Math.round((budgetAllocation[platform] * scaleFactor) * 100) / 100;
    }

    console.log('Generated budget allocation:', budgetAllocation);

    return new Response(
      JSON.stringify({ budgetAllocation }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error generating budget recommendations:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});