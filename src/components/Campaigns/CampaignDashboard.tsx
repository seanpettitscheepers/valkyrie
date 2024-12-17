import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "./DashboardHeader";
import { MetricsGrid } from "./Metrics/MetricsGrid";
import { ChartsSection } from "./Charts/ChartsSection";
import { useCampaignAnalysis } from "@/hooks/useCampaignAnalysis";
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
      const baseQuery = supabase
        .from("campaign_metrics")
        .select("*");
      
      const finalQuery = selectedCampaign !== "all" 
        ? baseQuery.eq("campaign_id", selectedCampaign).order("date", { ascending: true })
        : baseQuery.order("date", { ascending: true });
      
      const { data, error } = await finalQuery;
      if (error) throw error;
      return data;
    },
  });

  const { data: campaignKPIs } = useQuery({
    queryKey: ["campaign-kpis", selectedCampaign],
    queryFn: async () => {
      const baseQuery = supabase
        .from("campaign_kpis")
        .select("*");
      
      const finalQuery = selectedCampaign !== "all" 
        ? baseQuery.eq("campaign_id", selectedCampaign)
        : baseQuery;
      
      const { data, error } = await finalQuery;
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