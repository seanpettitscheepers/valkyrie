import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "./DashboardHeader";
import { EngagementChart } from "./EngagementChart";
import { ConversionChart } from "./ConversionChart";
import { KPIProgressCard } from "./KPIProgressCard";

export function CampaignDashboard() {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Fetch performance metrics
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

  // Fetch custom KPIs
  const { data: customKPIs } = useQuery({
    queryKey: ["custom-kpis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("custom_kpis")
        .select("*")
        .eq("is_active", true);
      
      if (error) throw error;
      return data;
    },
  });

  // Calculate KPI progress
  const kpiProgress = {
    signups: {
      completed: performanceData?.reduce((sum, d) => sum + (d.impressions || 0), 0) || 0,
      target: customKPIs?.find(k => k.metric_name === "signups")?.target_value || 10000,
    },
    purchases: {
      completed: performanceData?.reduce((sum, d) => sum + (d.conversions || 0), 0) || 0,
      target: customKPIs?.find(k => k.metric_name === "purchases")?.target_value || 1000,
    },
    revenue: {
      completed: performanceData?.reduce((sum, d) => sum + (d.spend || 0), 0) || 0,
      target: customKPIs?.find(k => k.metric_name === "revenue")?.target_value || 20000,
    },
  };

  // Process engagement data for the chart
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

      <EngagementChart data={engagementData} />

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(kpiProgress).map(([key, value]) => (
          <KPIProgressCard
            key={key}
            title={key}
            completed={value.completed}
            target={value.target}
          />
        ))}
      </div>

      <ConversionChart
        signupsCompleted={kpiProgress.signups.completed}
        purchasesCompleted={kpiProgress.purchases.completed}
      />
    </div>
  );
}