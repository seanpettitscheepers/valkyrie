import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCampaignData(selectedCampaign: string) {
  const { data: performanceData } = useQuery({
    queryKey: ["campaign-metrics", selectedCampaign],
    queryFn: async () => {
      const query = supabase
        .from("campaign_metrics")
        .select(`
          *,
          campaign:campaigns(*)
        `);
      
      // Only apply the campaign filter if a specific campaign is selected
      const finalQuery = selectedCampaign === "all" 
        ? query
        : query.eq("campaign_id", selectedCampaign);
      
      const { data, error } = await finalQuery.order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: campaignKPIs } = useQuery({
    queryKey: ["campaign-kpis", selectedCampaign],
    queryFn: async () => {
      const query = supabase
        .from("campaign_kpis")
        .select(`
          *,
          campaign:campaigns(*)
        `);
      
      // Only apply the campaign filter if a specific campaign is selected
      const finalQuery = selectedCampaign === "all" 
        ? query
        : query.eq("campaign_id", selectedCampaign);
      
      const { data, error } = await finalQuery;
      if (error) throw error;
      return data;
    },
  });

  return { performanceData, campaignKPIs };
}