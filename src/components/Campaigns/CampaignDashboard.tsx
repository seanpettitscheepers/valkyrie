import { useRef, useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { MetricsGrid } from "./Metrics/MetricsGrid";
import { ChartsSection } from "./Charts/ChartsSection";
import { useCampaignAnalysis } from "@/hooks/useCampaignAnalysis";
import { useCampaignData } from "@/hooks/useCampaignData";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

export function CampaignDashboard() {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const dashboardRef = useRef<HTMLDivElement>(null);

  const { data: campaignAnalysis, isLoading: isAnalysisLoading, error: analysisError } = 
    useCampaignAnalysis(selectedCampaign);

  const { performanceData, campaignKPIs } = useCampaignData(selectedCampaign);

  if (isAnalysisLoading) {
    return <LoadingState />;
  }

  if (analysisError) {
    return <ErrorState />;
  }

  const kpiProgress = {
    signups: {
      completed: campaignKPIs?.find(k => k.kpi_type === "signups")?.current_value || 0,
      target: campaignKPIs?.find(k => k.kpi_type === "signups")?.target_value || 10000,
    },
    purchases: {
      completed: campaignKPIs?.find(k => k.kpi_type === "purchases")?.current_value || 0,
      target: campaignKPIs?.find(k => k.kpi_type === "purchases")?.target_value || 1000,
    },
    revenue: {
      completed: campaignKPIs?.find(k => k.kpi_type === "revenue")?.current_value || 0,
      target: campaignKPIs?.find(k => k.kpi_type === "revenue")?.target_value || 20000,
    },
  };

  const trendsData = performanceData?.map(metric => ({
    date: new Date(metric.date).toLocaleDateString(),
    spend: metric.spend || 0,
    impressions: metric.impressions || 0,
    clicks: metric.clicks || 0,
    conversions: metric.conversions || 0,
  })) || [];

  return (
    <div className="space-y-8 p-6" ref={dashboardRef}>
      <DashboardHeader
        selectedCampaign={selectedCampaign}
        onCampaignChange={setSelectedCampaign}
        dashboardRef={dashboardRef}
      />

      <MetricsGrid 
        kpiProgress={kpiProgress}
        campaign={{ id: selectedCampaign, campaign_metrics: performanceData }}
      />

      <ChartsSection
        trendsData={trendsData}
        performanceData={performanceData || []}
        campaignAnalysis={campaignAnalysis}
        kpiProgress={kpiProgress}
      />
    </div>
  );
}