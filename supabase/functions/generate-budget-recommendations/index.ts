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
    const {
      objective,
      platforms,
      totalBudget,
      budgetCaps,
      audienceInsightsId,
      previousCampaignId,
      targetingObjectives,
      geographicalTargeting,
      adFormats,
    } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Generating budget recommendations for:', {
      objective,
      platforms,
      totalBudget,
      budgetCaps,
      targetingObjectives,
      geographicalTargeting,
      adFormats,
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

    // Initialize budget allocation
    const budgetAllocation = {};
    
    // Apply budget caps first
    let remainingBudget = totalBudget;
    if (budgetCaps?.length) {
      budgetCaps.forEach(cap => {
        if (platforms.includes(cap.platform)) {
          const cappedAmount = Math.min(cap.amount, totalBudget);
          budgetAllocation[cap.platform] = cappedAmount;
          remainingBudget -= cappedAmount;
        }
      });
    }

    // Calculate weights for remaining platforms
    const uncappedPlatforms = platforms.filter(
      platform => !budgetCaps?.find(cap => cap.platform === platform)
    );

    if (uncappedPlatforms.length > 0) {
      const baseWeight = remainingBudget / uncappedPlatforms.length;
      
      // Adjust weights based on objective
      switch (objective) {
        case 'awareness':
          uncappedPlatforms.forEach(platform => {
            if (platform === 'facebook' || platform === 'instagram') {
              budgetAllocation[platform] = baseWeight * 1.2;
            } else if (platform === 'tiktok') {
              budgetAllocation[platform] = baseWeight * 1.1;
            } else {
              budgetAllocation[platform] = baseWeight * 0.8;
            }
          });
          break;

        case 'consideration':
          uncappedPlatforms.forEach(platform => {
            if (platform === 'instagram' || platform === 'tiktok') {
              budgetAllocation[platform] = baseWeight * 1.3;
            } else {
              budgetAllocation[platform] = baseWeight * 0.9;
            }
          });
          break;

        case 'conversion':
          uncappedPlatforms.forEach(platform => {
            if (platform === 'facebook') {
              budgetAllocation[platform] = baseWeight * 1.4;
            } else if (platform === 'google_ads') {
              budgetAllocation[platform] = baseWeight * 1.3;
            } else {
              budgetAllocation[platform] = baseWeight * 0.8;
            }
          });
          break;
      }
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