import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { AIInsightsCard } from "@/components/Dashboard/AIInsightsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { CampaignFilter } from "@/components/Audience/CampaignFilter";
import { MetricsExplanation } from "@/components/Performance/MetricsExplanation";
import { PerformanceMetricsGrid } from "@/components/Performance/PerformanceMetricsGrid";
import { usePerformanceMetrics } from "@/components/Performance/usePerformanceMetrics";

const Performance = () => {
  const [selectedCampaign, setSelectedCampaign] = useState("all");

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*, campaign_metrics(*)");
      
      if (error) throw error;
      return data;
    },
  });

  const performanceMetrics = usePerformanceMetrics(campaigns, selectedCampaign);

  const generateInsights = () => {
    if (!performanceMetrics) return [];

    const insights = [
      {
        type: "success",
        message: "Campaign Performance Overview",
        metric: `Total Spend: ${performanceMetrics.spend.value}`,
        recommendation: performanceMetrics.spend.trend === "up" 
          ? "Spending levels are healthy and driving good results"
          : "Consider reviewing budget allocation for better results"
      },
      {
        type: "info",
        message: "Engagement Metrics",
        metric: `Engagement Rate: ${performanceMetrics.engagementRate.value}`,
        recommendation: performanceMetrics.engagementRate.trend === "up"
          ? "Strong engagement indicates content resonates well with audience"
          : "Consider refreshing content strategy to boost engagement"
      },
      {
        type: "success",
        message: "Video Performance",
        metric: `VTR: ${performanceMetrics.vtr.value}`,
        recommendation: performanceMetrics.vtr.trend === "up"
          ? "Video content is performing exceptionally well"
          : "Consider optimizing video length and content"
      },
      {
        type: "info",
        message: "Cost Efficiency",
        metric: `CPM: ${performanceMetrics.cpm.value}`,
        recommendation: performanceMetrics.cpm.trend === "up"
          ? "Cost per impression is within optimal range"
          : "Review targeting to improve cost efficiency"
      }
    ];

    return insights;
  };

  const renderContent = () => {
    if (campaignsLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-[160px] w-full" />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <PerformanceMetricsGrid metrics={performanceMetrics} />
        
        <AIInsightsCard
          campaignType="awareness"
          insights={generateInsights()}
        />

        <MetricsExplanation />
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">Campaign Performance Analysis</h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive analysis of campaign performance metrics and insights
                </p>
              </div>
              <CampaignFilter
                selectedCampaign={selectedCampaign}
                onCampaignChange={setSelectedCampaign}
              />
            </div>
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Performance;