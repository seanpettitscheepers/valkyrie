import { supabase } from "@/integrations/supabase/client";

interface AIRecommendation {
  platforms: string;
  targeting: string;
  creatives: string;
}

export async function fetchCampaignMetrics() {
  const { data, error } = await supabase
    .from('campaign_metrics')
    .select('*')
    .limit(100);

  if (error) {
    console.error('Error fetching performance data:', error);
    throw error;
  }

  return data;
}

export async function getAIRecommendations(
  objective: string,
  historicalPerformance: any[]
): Promise<AIRecommendation> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No authentication session found');
  }

  const { data, error } = await supabase.functions.invoke(
    'analyze-ad-objective',
    {
      body: {
        objective,
        historicalPerformance
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (error) {
    console.error('Edge function error:', error);
    throw error;
  }

  return data;
}