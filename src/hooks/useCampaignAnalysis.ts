import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Campaign } from "@/types/campaign";

interface CampaignAnalysis {
  performance: {
    total_spend: number;
    total_impressions: number;
    total_clicks: number;
    total_conversions: number;
    ctr: number;
    cpc: number;
    conversion_rate: number;
  };
  trends: {
    date: string;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
  }[];
  insights: {
    type: "success" | "warning" | "info";
    message: string;
    metric?: string;
    recommendation?: string;
  }[];
}

export function useCampaignAnalysis(campaignId: string) {
  return useQuery({
    queryKey: ["campaign-analysis", campaignId],
    queryFn: async (): Promise<CampaignAnalysis> => {
      // Fetch campaign metrics
      const { data: metrics, error: metricsError } = await supabase
        .from("campaign_metrics")
        .select("*")
        .eq("campaign_id", campaignId)
        .order("date", { ascending: true });

      if (metricsError) throw metricsError;

      // Calculate performance metrics
      const performance = metrics.reduce(
        (acc, metric) => ({
          total_spend: acc.total_spend + (metric.spend || 0),
          total_impressions: acc.total_impressions + (metric.impressions || 0),
          total_clicks: acc.total_clicks + (metric.clicks || 0),
          total_conversions: acc.total_conversions + (metric.conversions || 0),
          ctr: acc.total_impressions > 0 ? (acc.total_clicks / acc.total_impressions) * 100 : 0,
          cpc: acc.total_clicks > 0 ? acc.total_spend / acc.total_clicks : 0,
          conversion_rate: acc.total_clicks > 0 ? (acc.total_conversions / acc.total_clicks) * 100 : 0,
        }),
        {
          total_spend: 0,
          total_impressions: 0,
          total_clicks: 0,
          total_conversions: 0,
          ctr: 0,
          cpc: 0,
          conversion_rate: 0,
        }
      );

      // Format trend data
      const trends = metrics.map(metric => ({
        date: new Date(metric.date).toLocaleDateString(),
        spend: metric.spend || 0,
        impressions: metric.impressions || 0,
        clicks: metric.clicks || 0,
        conversions: metric.conversions || 0,
      }));

      // Generate insights based on performance
      const insights = [
        {
          type: "success" as const,
          message: "Campaign Performance Overview",
          metric: `Total Spend: $${performance.total_spend.toLocaleString()}`,
          recommendation: performance.ctr > 2 
            ? "Strong CTR performance, consider scaling budget"
            : "Consider optimizing ad creatives to improve CTR",
        },
        {
          type: "info" as const,
          message: "Conversion Analysis",
          metric: `Conversion Rate: ${performance.conversion_rate.toFixed(2)}%`,
          recommendation: performance.conversion_rate > 5
            ? "Excellent conversion rate, maintain current targeting"
            : "Review landing page and conversion funnel for optimization opportunities",
        },
        {
          type: "warning" as const,
          message: "Cost Analysis",
          metric: `CPC: $${performance.cpc.toFixed(2)}`,
          recommendation: performance.cpc > 2
            ? "High CPC detected, review targeting and bid strategy"
            : "Cost per click is within acceptable range",
        },
      ];

      return {
        performance,
        trends,
        insights,
      };
    },
    enabled: !!campaignId,
  });
}