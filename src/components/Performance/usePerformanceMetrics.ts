import { Campaign } from "@/types/campaign";

type Trend = "up" | "down";

interface PerformanceMetric {
  value: string;
  trend: Trend;
  change: number;
}

export interface PerformanceMetrics {
  spend: PerformanceMetric;
  impressions: PerformanceMetric;
  reach: PerformanceMetric;
  clicks: PerformanceMetric;
  cpm: PerformanceMetric;
  engagements: PerformanceMetric;
  videoViews: PerformanceMetric;
  cpv: PerformanceMetric;
  cpc: PerformanceMetric;
  engagementRate: PerformanceMetric;
  vtr: PerformanceMetric;
  cpcv: PerformanceMetric;
  ctr: PerformanceMetric;
  cpe: PerformanceMetric;
  cpa: PerformanceMetric;
}

export function usePerformanceMetrics(campaigns: Campaign[] | null, selectedCampaign: string): PerformanceMetrics | null {
  if (!campaigns?.length) return null;

  let filteredCampaigns = campaigns;
  if (selectedCampaign !== "all") {
    filteredCampaigns = campaigns.filter(c => c.id === selectedCampaign);
  }

  const metrics = filteredCampaigns.flatMap(campaign => campaign.campaign_metrics || []);
  if (!metrics.length) return null;

  const totalSpend = metrics.reduce((sum, m) => sum + (Number(m.spend) || 0), 0);
  const totalImpressions = metrics.reduce((sum, m) => sum + (m.impressions || 0), 0);
  const totalReach = Math.round(totalImpressions * 0.8); // Estimated reach as 80% of impressions
  const totalClicks = metrics.reduce((sum, m) => sum + (m.clicks || 0), 0);
  const totalEngagements = metrics.reduce((sum, m) => sum + (m.engagements || 0), 0);
  const totalVideoViews = metrics.reduce((sum, m) => sum + (m.video_views || 0), 0);
  const totalConversions = metrics.reduce((sum, m) => sum + (m.conversions || 0), 0);

  // Calculate all metrics
  const cpm = totalImpressions ? (totalSpend / totalImpressions) * 1000 : 0;
  const cpv = totalVideoViews ? totalSpend / totalVideoViews : 0;
  const cpc = totalClicks ? totalSpend / totalClicks : 0;
  const engagementRate = totalImpressions ? (totalEngagements / totalImpressions) * 100 : 0;
  const vtr = totalImpressions ? (totalVideoViews / totalImpressions) * 100 : 0;
  const cpcv = totalVideoViews ? totalSpend / totalVideoViews : 0;
  const ctr = totalImpressions ? (totalClicks / totalImpressions) * 100 : 0;
  const cpe = totalEngagements ? totalSpend / totalEngagements : 0;
  const cpa = totalConversions ? totalSpend / totalConversions : 0;

  return {
    spend: {
      value: `$${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: totalSpend > 1000 ? "up" : "down" as Trend,
      change: 10
    },
    impressions: {
      value: totalImpressions.toLocaleString(),
      trend: totalImpressions > 10000 ? "up" : "down" as Trend,
      change: 15
    },
    reach: {
      value: totalReach.toLocaleString(),
      trend: totalReach > 8000 ? "up" : "down" as Trend,
      change: 12
    },
    clicks: {
      value: totalClicks.toLocaleString(),
      trend: totalClicks > 500 ? "up" : "down" as Trend,
      change: 8
    },
    cpm: {
      value: `$${cpm.toFixed(2)}`,
      trend: cpm < 10 ? "up" : "down" as Trend,
      change: Number((Math.abs(cpm - 10)).toFixed(1))
    },
    engagements: {
      value: totalEngagements.toLocaleString(),
      trend: totalEngagements > 1000 ? "up" : "down" as Trend,
      change: 15
    },
    videoViews: {
      value: totalVideoViews.toLocaleString(),
      trend: totalVideoViews > 1000 ? "up" : "down" as Trend,
      change: 20
    },
    cpv: {
      value: `$${cpv.toFixed(2)}`,
      trend: cpv < 0.05 ? "up" : "down" as Trend,
      change: Number((Math.abs(cpv - 0.05)).toFixed(1))
    },
    cpc: {
      value: `$${cpc.toFixed(2)}`,
      trend: cpc < 2 ? "up" : "down" as Trend,
      change: Number((Math.abs(cpc - 2)).toFixed(1))
    },
    engagementRate: {
      value: `${engagementRate.toFixed(2)}%`,
      trend: engagementRate > 2 ? "up" : "down" as Trend,
      change: Number((Math.abs(engagementRate - 2)).toFixed(1))
    },
    vtr: {
      value: `${vtr.toFixed(2)}%`,
      trend: vtr > 50 ? "up" : "down" as Trend,
      change: Number((Math.abs(vtr - 50)).toFixed(1))
    },
    cpcv: {
      value: `$${cpcv.toFixed(2)}`,
      trend: cpcv < 0.1 ? "up" : "down" as Trend,
      change: Number((Math.abs(cpcv - 0.1)).toFixed(1))
    },
    ctr: {
      value: `${ctr.toFixed(2)}%`,
      trend: ctr > 1 ? "up" : "down" as Trend,
      change: Number((Math.abs(ctr - 1)).toFixed(1))
    },
    cpe: {
      value: `$${cpe.toFixed(2)}`,
      trend: cpe < 0.5 ? "up" : "down" as Trend,
      change: Number((Math.abs(cpe - 0.5)).toFixed(1))
    },
    cpa: {
      value: `$${cpa.toFixed(2)}`,
      trend: cpa < 10 ? "up" : "down" as Trend,
      change: Number((Math.abs(cpa - 10)).toFixed(1))
    }
  };
}