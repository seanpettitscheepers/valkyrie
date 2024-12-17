import { CampaignTrendsChart } from "./CampaignTrendsChart";
import { EngagementChart } from "./EngagementChart";
import { ConversionChart } from "./ConversionChart";
import { AIInsightsCard } from "@/components/Dashboard/AIInsightsCard";

interface ChartsSectionProps {
  trendsData: Array<{
    date: string;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
  }>;
  performanceData: any[];
  campaignAnalysis?: {
    insights: Array<{
      type: "success" | "warning" | "info";
      message: string;
      metric?: string;
      recommendation?: string;
    }>;
  };
  kpiProgress: {
    signups: { completed: number };
    purchases: { completed: number };
  };
}

export function ChartsSection({ 
  trendsData, 
  performanceData, 
  campaignAnalysis,
  kpiProgress 
}: ChartsSectionProps) {
  return (
    <>
      <CampaignTrendsChart data={trendsData} />
      
      {campaignAnalysis && (
        <AIInsightsCard
          campaignType="awareness"
          insights={campaignAnalysis.insights}
        />
      )}

      <EngagementChart data={performanceData} />
      <ConversionChart
        signupsCompleted={kpiProgress.signups.completed}
        purchasesCompleted={kpiProgress.purchases.completed}
      />
    </>
  );
}