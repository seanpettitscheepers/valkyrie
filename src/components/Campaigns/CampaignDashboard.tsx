import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "./DashboardHeader";
import { EngagementChart } from "./Charts/EngagementChart";
import { ConversionChart } from "./Charts/ConversionChart";
import { KPIProgressCard } from "./Metrics/KPIProgressCard";
import { ROICard } from "./Metrics/ROICard";
import { CampaignTrendsChart } from "./Charts/CampaignTrendsChart";
import { useCampaignAnalysis } from "@/hooks/useCampaignAnalysis";
import { AIInsightsCard } from "@/components/Dashboard/AIInsightsCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export function CampaignDashboard() {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const dashboardRef = useRef<HTMLDivElement>(null);

  const { data: campaignAnalysis, isLoading: isAnalysisLoading, error: analysisError } = 
    useCampaignAnalysis(selectedCampaign);

  const { data: performanceData } = useQuery({
    queryKey: ["campaign-metrics", selectedCampaign],
    queryFn: async () => {
      let query = supabase.from("campaign_metrics").select("*");
      
      if (selectedCampaign !== "all") {
        query = query.eq("campaign_id", selectedCampaign);
      }
      
      const { data, error } = await query.order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: campaignKPIs } = useQuery({
    queryKey: ["campaign-kpis", selectedCampaign],
    queryFn: async () => {
      let query = supabase.from("campaign_kpis").select("*");
      
      if (selectedCampaign !== "all") {
        query = query.eq("campaign_id", selectedCampaign);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  if (isAnalysisLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (analysisError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load campaign analysis. Please try again later.
        </AlertDescription>
      </Alert>
    );
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

  // Transform performanceData to match TrendsData interface
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

      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(kpiProgress).map(([key, value]) => (
          <KPIProgressCard
            key={key}
            title={key}
            completed={value.completed}
            target={value.target}
          />
        ))}
        <ROICard
          campaign={{ id: selectedCampaign, campaign_metrics: performanceData }}
          kpis={kpiProgress}
        />
      </div>

      <CampaignTrendsChart data={trendsData} />
      
      {campaignAnalysis && (
        <AIInsightsCard
          campaignType="awareness"
          insights={campaignAnalysis.insights}
        />
      )}

      <EngagementChart data={performanceData || []} />
      <ConversionChart
        signupsCompleted={kpiProgress.signups.completed}
        purchasesCompleted={kpiProgress.purchases.completed}
      />
    </div>
  );
}