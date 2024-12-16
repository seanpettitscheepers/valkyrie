import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "./DashboardHeader";
import { EngagementChart } from "./Charts/EngagementChart";
import { ConversionChart } from "./Charts/ConversionChart";
import { KPIProgressCard } from "./Metrics/KPIProgressCard";
import { ROICard } from "./Metrics/ROICard";
import { CreateCampaignDialog } from "./CreateCampaignDialog";
import { CampaignTrendsChart } from "./Charts/CampaignTrendsChart";

export function CampaignDashboard() {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const dashboardRef = useRef<HTMLDivElement>(null);

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

  const trendsData = performanceData?.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    spend: d.spend,
    signups: Math.round(d.impressions * 0.1),
    purchases: d.conversions,
    revenue: d.conversions * 100,
    profit: (d.conversions * 100) - d.spend,
  })) || [];

  const engagementData = performanceData?.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    sign_in: Math.round(d.impressions * 0.1),
    buy_product: d.conversions,
    revenue: d.spend,
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
      <EngagementChart data={engagementData} />
      <ConversionChart
        signupsCompleted={kpiProgress.signups.completed}
        purchasesCompleted={kpiProgress.purchases.completed}
      />
    </div>
  );
}