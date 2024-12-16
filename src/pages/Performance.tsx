import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageLayout } from "@/components/Layout/PageLayout";
import { AIInsightsCard } from "@/components/Dashboard/AIInsightsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { CampaignFilter } from "@/components/Audience/CampaignFilter";
import { PlatformFilter } from "@/components/Audience/PlatformFilter";
import { MetricsExplanation } from "@/components/Performance/MetricsExplanation";
import { PerformanceMetricsGrid } from "@/components/Performance/PerformanceMetricsGrid";
import { usePerformanceMetrics } from "@/components/Performance/usePerformanceMetrics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Performance = () => {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["all"]);

  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ["campaigns", selectedPlatforms],
    queryFn: async () => {
      let query = supabase
        .from("campaigns")
        .select("*, campaign_metrics(*)");
      
      if (!selectedPlatforms.includes("all")) {
        query = query.in("platform", selectedPlatforms);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const performanceMetrics = usePerformanceMetrics(campaigns, selectedCampaign);

  const handlePlatformChange = (platforms: string[]) => {
    setSelectedPlatforms(platforms);
  };

  const generateInsights = (objective: "awareness" | "consideration" | "conversion") => {
    if (!performanceMetrics) return [];

    const insights = [
      {
        type: "success" as const,
        message: `${objective.charAt(0).toUpperCase() + objective.slice(1)} Campaign Performance`,
        metric: `Total Spend: ${performanceMetrics.spend.value}`,
        recommendation: performanceMetrics.spend.trend === "up" 
          ? "Spending levels are healthy and driving good results"
          : "Consider reviewing budget allocation for better results"
      },
      {
        type: "info" as const,
        message: "Engagement Metrics",
        metric: `Engagement Rate: ${performanceMetrics.engagementRate.value}`,
        recommendation: performanceMetrics.engagementRate.trend === "up"
          ? "Strong engagement indicates content resonates well with audience"
          : "Consider refreshing content strategy to boost engagement"
      },
      {
        type: "success" as const,
        message: "Video Performance",
        metric: `VTR: ${performanceMetrics.vtr.value}`,
        recommendation: performanceMetrics.vtr.trend === "up"
          ? "Video content is performing exceptionally well"
          : "Consider optimizing video length and content"
      },
      {
        type: "info" as const,
        message: "Cost Efficiency",
        metric: `CPM: ${performanceMetrics.cpm.value}`,
        recommendation: performanceMetrics.cpm.trend === "up"
          ? "Cost per impression is within optimal range"
          : "Review targeting to improve cost efficiency"
      }
    ];

    return insights;
  };

  return (
    <PageLayout title="Ad Performance Analysis">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Ad Arsenal: Measure. Optimize. Dominate.</h1>
          <p className="text-muted-foreground mt-1">
            Dive deep into your ad performance metrics across platforms. See what's working, what's not, and adjust your tactics in real time.
          </p>
        </div>
        <div className="flex gap-4">
          <CampaignFilter
            selectedCampaign={selectedCampaign}
            onCampaignChange={setSelectedCampaign}
          />
          <PlatformFilter
            selectedPlatforms={selectedPlatforms}
            onPlatformChange={handlePlatformChange}
          />
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex gap-2 flex-wrap">
          {selectedPlatforms.map(platform => (
            <Badge key={platform} variant="secondary">
              {platform === "all" ? "All Platforms" : platform}
            </Badge>
          ))}
        </div>

        <Tabs defaultValue="awareness" className="space-y-6">
          <TabsList>
            <TabsTrigger value="awareness">Awareness</TabsTrigger>
            <TabsTrigger value="consideration">Consideration</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
          </TabsList>

          <TabsContent value="awareness">
            <div className="space-y-6">
              <PerformanceMetricsGrid metrics={performanceMetrics} />
              <AIInsightsCard
                campaignType="awareness"
                insights={generateInsights("awareness")}
              />
            </div>
          </TabsContent>

          <TabsContent value="consideration">
            <div className="space-y-6">
              <PerformanceMetricsGrid metrics={performanceMetrics} />
              <AIInsightsCard
                campaignType="consideration"
                insights={generateInsights("consideration")}
              />
            </div>
          </TabsContent>

          <TabsContent value="conversion">
            <div className="space-y-6">
              <PerformanceMetricsGrid metrics={performanceMetrics} />
              <AIInsightsCard
                campaignType="conversion"
                insights={generateInsights("conversion")}
              />
            </div>
          </TabsContent>
        </Tabs>

        <MetricsExplanation />
      </div>
    </PageLayout>
  );
};

export default Performance;