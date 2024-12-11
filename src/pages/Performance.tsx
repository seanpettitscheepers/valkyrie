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

    const totalSpend = metrics.reduce((sum, m) => sum + (Number(m.spend) || 0), 0);
    const totalImpressions = metrics.reduce((sum, m) => sum + (m.impressions || 0), 0);
    const totalEngagements = metrics.reduce((sum, m) => sum + (m.engagements || 0), 0);
    const totalVideoViews = metrics.reduce((sum, m) => sum + (m.video_views || 0), 0);
    const totalClicks = metrics.reduce((sum, m) => sum + (m.clicks || 0), 0);
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
        trend: totalSpend > 1000 ? ("up" as const) : ("down" as const),
        change: 10
      },
      cpm: {
        value: `$${cpm.toFixed(2)}`,
        trend: cpm < 10 ? ("up" as const) : ("down" as const),
        change: Math.abs(cpm - 10).toFixed(1)
      },
      engagements: {
        value: totalEngagements.toLocaleString(),
        trend: totalEngagements > 1000 ? ("up" as const) : ("down" as const),
        change: 15
      },
      videoViews: {
        value: totalVideoViews.toLocaleString(),
        trend: totalVideoViews > 1000 ? ("up" as const) : ("down" as const),
        change: 20
      },
      cpv: {
        value: `$${cpv.toFixed(2)}`,
        trend: cpv < 0.05 ? ("up" as const) : ("down" as const),
        change: Math.abs(cpv - 0.05).toFixed(1)
      },
      cpc: {
        value: `$${cpc.toFixed(2)}`,
        trend: cpc < 2 ? ("up" as const) : ("down" as const),
        change: Math.abs(cpc - 2).toFixed(1)
      },
      engagementRate: {
        value: `${engagementRate.toFixed(2)}%`,
        trend: engagementRate > 2 ? ("up" as const) : ("down" as const),
        change: Math.abs(engagementRate - 2).toFixed(1)
      },
      vtr: {
        value: `${vtr.toFixed(2)}%`,
        trend: vtr > 50 ? ("up" as const) : ("down" as const),
        change: Math.abs(vtr - 50).toFixed(1)
      },
      cpcv: {
        value: `$${cpcv.toFixed(2)}`,
        trend: cpcv < 0.1 ? ("up" as const) : ("down" as const),
        change: Math.abs(cpcv - 0.1).toFixed(1)
      },
      ctr: {
        value: `${ctr.toFixed(2)}%`,
        trend: ctr > 1 ? ("up" as const) : ("down" as const),
        change: Math.abs(ctr - 1).toFixed(1)
      },
      cpe: {
        value: `$${cpe.toFixed(2)}`,
        trend: cpe < 0.5 ? ("up" as const) : ("down" as const),
        change: Math.abs(cpe - 0.5).toFixed(1)
      },
      cpa: {
        value: `$${cpa.toFixed(2)}`,
        trend: cpa < 10 ? ("up" as const) : ("down" as const),
        change: Math.abs(cpa - 10).toFixed(1)
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
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-[160px] w-full" />
            ))}
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
              <li><span className="font-medium">Spend</span>: Total amount spent on campaigns</li>
              <li><span className="font-medium">CPM (Cost Per Mille)</span>: Cost per 1,000 impressions</li>
              <li><span className="font-medium">Engagements</span>: Total number of interactions</li>
              <li><span className="font-medium">Video Views</span>: Total number of video views</li>
              <li><span className="font-medium">CPV (Cost Per View)</span>: Average cost per video view</li>
              <li><span className="font-medium">CPC (Cost Per Click)</span>: Average cost per click</li>
              <li><span className="font-medium">Engagement Rate</span>: Percentage of impressions resulting in engagement</li>
              <li><span className="font-medium">VTR (View Through Rate)</span>: Percentage of impressions resulting in video views</li>
              <li><span className="font-medium">CPCV (Cost Per Completed View)</span>: Average cost per completed video view</li>
              <li><span className="font-medium">CTR (Click Through Rate)</span>: Percentage of impressions resulting in clicks</li>
              <li><span className="font-medium">CPE (Cost Per Engagement)</span>: Average cost per engagement</li>
              <li><span className="font-medium">CPA (Cost Per Acquisition)</span>: Average cost per conversion</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <PerformanceCard
            title="Total Spend"
            value={performanceMetrics?.spend.value || "$0.00"}
            change={Number(performanceMetrics?.spend.change || 0)}
            trend={performanceMetrics?.spend.trend || "up"}
          />
          
          <PerformanceCard
            title="CPM"
            value={performanceMetrics?.cpm.value || "$0.00"}
            change={Number(performanceMetrics?.cpm.change || 0)}
            trend={performanceMetrics?.cpm.trend || "up"}
          />

          <PerformanceCard
            title="Engagements"
            value={performanceMetrics?.engagements.value || "0"}
            change={Number(performanceMetrics?.engagements.change || 0)}
            trend={performanceMetrics?.engagements.trend || "up"}
          />

          <PerformanceCard
            title="Video Views"
            value={performanceMetrics?.videoViews.value || "0"}
            change={Number(performanceMetrics?.videoViews.change || 0)}
            trend={performanceMetrics?.videoViews.trend || "up"}
          />

          <PerformanceCard
            title="CPV"
            value={performanceMetrics?.cpv.value || "$0.00"}
            change={Number(performanceMetrics?.cpv.change || 0)}
            trend={performanceMetrics?.cpv.trend || "up"}
          />

          <PerformanceCard
            title="CPC"
            value={performanceMetrics?.cpc.value || "$0.00"}
            change={Number(performanceMetrics?.cpc.change || 0)}
            trend={performanceMetrics?.cpc.trend || "up"}
          />

          <PerformanceCard
            title="Engagement Rate"
            value={performanceMetrics?.engagementRate.value || "0%"}
            change={Number(performanceMetrics?.engagementRate.change || 0)}
            trend={performanceMetrics?.engagementRate.trend || "up"}
          />

          <PerformanceCard
            title="VTR"
            value={performanceMetrics?.vtr.value || "0%"}
            change={Number(performanceMetrics?.vtr.change || 0)}
            trend={performanceMetrics?.vtr.trend || "up"}
          />

          <PerformanceCard
            title="CPCV"
            value={performanceMetrics?.cpcv.value || "$0.00"}
            change={Number(performanceMetrics?.cpcv.change || 0)}
            trend={performanceMetrics?.cpcv.trend || "up"}
          />

          <PerformanceCard
            title="CTR"
            value={performanceMetrics?.ctr.value || "0%"}
            change={Number(performanceMetrics?.ctr.change || 0)}
            trend={performanceMetrics?.ctr.trend || "up"}
          />

          <PerformanceCard
            title="CPE"
            value={performanceMetrics?.cpe.value || "$0.00"}
            change={Number(performanceMetrics?.cpe.change || 0)}
            trend={performanceMetrics?.cpe.trend || "up"}
          />

          <PerformanceCard
            title="CPA"
            value={performanceMetrics?.cpa.value || "$0.00"}
            change={Number(performanceMetrics?.cpa.change || 0)}
            trend={performanceMetrics?.cpa.trend || "up"}
          />
        </div>

        <AIInsightsCard
          campaignType="awareness"
          insights={[
            {
              type: "success",
              message: "Campaign performance overview",
              metric: `Total Spend: ${performanceMetrics?.spend.value || "$0.00"}`,
              recommendation: "Current spending levels are within optimal range"
            },
            {
              type: "info",
              message: "Efficiency metrics",
              metric: `CPM: ${performanceMetrics?.cpm.value || "$0.00"}`,
              recommendation: "Cost per thousand impressions is performing well"
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