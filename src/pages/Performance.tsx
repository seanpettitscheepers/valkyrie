import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { PerformanceCard } from "@/components/Dashboard/PerformanceCard";
import { AIInsightsCard } from "@/components/Dashboard/AIInsightsCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CampaignFilter } from "@/components/Audience/CampaignFilter";
import { useState } from "react";

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

  const calculatePerformanceMetrics = () => {
    if (!campaigns?.length) return null;

    let filteredCampaigns = campaigns;
    if (selectedCampaign !== "all") {
      filteredCampaigns = campaigns.filter(c => c.id === selectedCampaign);
    }

    const metrics = filteredCampaigns.flatMap(campaign => campaign.campaign_metrics || []);
    if (!metrics.length) return null;

    const totalImpressions = metrics.reduce((sum, m) => sum + (m.impressions || 0), 0);
    const totalEngagements = metrics.reduce((sum, m) => sum + (m.engagements || 0), 0);
    const totalClicks = metrics.reduce((sum, m) => sum + (m.clicks || 0), 0);
    const totalSpend = metrics.reduce((sum, m) => sum + (Number(m.spend) || 0), 0);
    const totalConversions = metrics.reduce((sum, m) => sum + (m.conversions || 0), 0);

    const engagementRate = totalImpressions ? (totalEngagements / totalImpressions) * 100 : 0;
    const clickThroughRate = totalImpressions ? (totalClicks / totalImpressions) * 100 : 0;
    const conversionRate = totalClicks ? (totalConversions / totalClicks) * 100 : 0;
    const costPerClick = totalClicks ? totalSpend / totalClicks : 0;

    return {
      engagementRate: {
        value: engagementRate.toFixed(2) + "%",
        trend: engagementRate > 2 ? ("up" as const) : ("down" as const),
        change: Math.abs(engagementRate - 2).toFixed(1)
      },
      clickThroughRate: {
        value: clickThroughRate.toFixed(2) + "%",
        trend: clickThroughRate > 1 ? ("up" as const) : ("down" as const),
        change: Math.abs(clickThroughRate - 1).toFixed(1)
      },
      conversionRate: {
        value: conversionRate.toFixed(2) + "%",
        trend: conversionRate > 3 ? ("up" as const) : ("down" as const),
        change: Math.abs(conversionRate - 3).toFixed(1)
      },
      costPerClick: {
        value: `$${costPerClick.toFixed(2)}`,
        trend: costPerClick < 2 ? ("up" as const) : ("down" as const),
        change: Math.abs(costPerClick - 2).toFixed(1)
      }
    };
  };

  const performanceMetrics = calculatePerformanceMetrics();

  const renderContent = () => {
    if (campaignsLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-[160px] w-full" />
            <Skeleton className="h-[160px] w-full" />
            <Skeleton className="h-[160px] w-full" />
            <Skeleton className="h-[160px] w-full" />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <p className="mb-2">Key Performance Metrics Explained:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><span className="font-medium">Engagement Rate</span>: Percentage of impressions that resulted in any engagement</li>
              <li><span className="font-medium">Click-Through Rate (CTR)</span>: Percentage of impressions that resulted in clicks</li>
              <li><span className="font-medium">Conversion Rate</span>: Percentage of clicks that resulted in conversions</li>
              <li><span className="font-medium">Cost Per Click (CPC)</span>: Average cost per click on your campaigns</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <PerformanceCard
            title="Engagement Rate"
            value={performanceMetrics?.engagementRate.value || "0%"}
            change={Number(performanceMetrics?.engagementRate.change || 0)}
            trend={performanceMetrics?.engagementRate.trend || "up"}
          />
          
          <PerformanceCard
            title="Click-Through Rate"
            value={performanceMetrics?.clickThroughRate.value || "0%"}
            change={Number(performanceMetrics?.clickThroughRate.change || 0)}
            trend={performanceMetrics?.clickThroughRate.trend || "up"}
          />

          <PerformanceCard
            title="Conversion Rate"
            value={performanceMetrics?.conversionRate.value || "0%"}
            change={Number(performanceMetrics?.conversionRate.change || 0)}
            trend={performanceMetrics?.conversionRate.trend || "up"}
          />

          <PerformanceCard
            title="Cost Per Click"
            value={performanceMetrics?.costPerClick.value || "$0.00"}
            change={Number(performanceMetrics?.costPerClick.change || 0)}
            trend={performanceMetrics?.costPerClick.trend || "up"}
          />
        </div>

        <AIInsightsCard
          campaignType="performance"
          insights={[
            {
              type: "success",
              message: "Campaign performance metrics analysis",
              metric: `Engagement rate: ${performanceMetrics?.engagementRate.value || "0%"}`,
              recommendation: performanceMetrics?.engagementRate.trend === "up" 
                ? "Current engagement strategies are working well"
                : "Consider reviewing content strategy to improve engagement"
            },
            {
              type: "info",
              message: "Cost efficiency analysis",
              metric: `CPC: ${performanceMetrics?.costPerClick.value || "$0.00"}`,
              recommendation: performanceMetrics?.costPerClick.trend === "up"
                ? "Cost per click is optimized"
                : "Review bidding strategy to optimize costs"
            }
          ]}
        />
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
                  Detailed analysis of campaign performance metrics and insights
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