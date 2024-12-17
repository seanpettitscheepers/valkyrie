import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCampaignData(selectedCampaign: string) {
  const { data: performanceData } = useQuery({
    queryKey: ["campaign-metrics", selectedCampaign],
    queryFn: async () => {
      let query = supabase
        .from("campaign_metrics")
        .select("*")
        .order("date", { ascending: true });
      
      if (selectedCampaign !== "all") {
        query = query.eq("campaign_id", selectedCampaign);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: campaignKPIs } = useQuery({
    queryKey: ["campaign-kpis", selectedCampaign],
    queryFn: async () => {
      let query = supabase
        .from("campaign_kpis")
        .select("*");
      
      if (selectedCampaign !== "all") {
        query = query.eq("campaign_id", selectedCampaign);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return { performanceData, campaignKPIs };
}