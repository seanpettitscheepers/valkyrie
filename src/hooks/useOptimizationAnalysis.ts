import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Campaign } from "@/types/campaign";

interface PerformanceMetrics {
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface CampaignAnalysis {
  metrics: PerformanceMetrics;
  kpis: {
    ctr: number;
    cpc: number;
    cpa: number;
    conversionRate: number;
  };
  insights: {
    type: 'positive' | 'negative' | 'neutral';
    message: string;
    metric: string;
    value: number;
    recommendation?: string;
  }[];
}

export function useOptimizationAnalysis(campaignId?: string) {
  return useQuery({
    queryKey: ['campaign-analysis', campaignId],
    queryFn: async (): Promise<CampaignAnalysis> => {
      // Fetch campaign metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('campaign_metrics')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('date', { ascending: false })
        .limit(30);

      if (metricsError) throw metricsError;

      // Aggregate metrics
      const aggregatedMetrics = metrics.reduce((acc, metric) => ({
        spend: acc.spend + (metric.spend || 0),
        impressions: acc.impressions + (metric.impressions || 0),
        clicks: acc.clicks + (metric.clicks || 0),
        conversions: acc.conversions + (metric.conversions || 0),
      }), {
        spend: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
      });

      // Calculate KPIs
      const kpis = {
        ctr: (aggregatedMetrics.clicks / aggregatedMetrics.impressions) * 100,
        cpc: aggregatedMetrics.spend / aggregatedMetrics.clicks,
        cpa: aggregatedMetrics.spend / aggregatedMetrics.conversions,
        conversionRate: (aggregatedMetrics.conversions / aggregatedMetrics.clicks) * 100,
      };

      // Generate insights
      const insights = [];

      // CTR Analysis
      if (kpis.ctr < 1) {
        insights.push({
          type: 'negative',
          message: 'Click-through rate is below industry average',
          metric: 'CTR',
          value: kpis.ctr,
          recommendation: 'Consider reviewing ad creative and targeting settings',
        });
      } else if (kpis.ctr > 2) {
        insights.push({
          type: 'positive',
          message: 'Strong click-through rate performance',
          metric: 'CTR',
          value: kpis.ctr,
        });
      }

      // CPA Analysis
      if (kpis.cpa > 50) {
        insights.push({
          type: 'negative',
          message: 'Cost per acquisition is high',
          metric: 'CPA',
          value: kpis.cpa,
          recommendation: 'Review targeting and bidding strategy',
        });
      } else if (kpis.cpa < 20) {
        insights.push({
          type: 'positive',
          message: 'Efficient cost per acquisition',
          metric: 'CPA',
          value: kpis.cpa,
        });
      }

      // Conversion Rate Analysis
      if (kpis.conversionRate < 1) {
        insights.push({
          type: 'negative',
          message: 'Low conversion rate',
          metric: 'Conversion Rate',
          value: kpis.conversionRate,
          recommendation: 'Optimize landing pages and conversion funnel',
        });
      }

      return {
        metrics: aggregatedMetrics,
        kpis,
        insights,
      };
    },
    enabled: !!campaignId,
  });
}