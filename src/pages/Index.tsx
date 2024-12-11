import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { PerformanceCard } from "@/components/Dashboard/PerformanceCard";
import { AIInsightsCard } from "@/components/Dashboard/AIInsightsCard";
import { BarChart, Target, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const Index = () => {
  // Fetch campaigns and their metrics
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

  // Fetch sentiment data
  const { data: sentimentData, isLoading: sentimentLoading } = useQuery({
    queryKey: ["sentiment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brand_sentiment")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Calculate performance metrics
  const calculatePerformanceMetrics = () => {
    if (!campaigns?.length) return null;

    const metrics = campaigns.flatMap(campaign => campaign.campaign_metrics || []);
    if (!metrics.length) return null;

    const totalImpressions = metrics.reduce((sum, m) => sum + (m.impressions || 0), 0);
    const totalEngagements = metrics.reduce((sum, m) => sum + (m.engagements || 0), 0);
    const engagementRate = totalImpressions ? (totalEngagements / totalImpressions) * 100 : 0;

    return {
      rate: engagementRate.toFixed(2),
      trend: engagementRate > 2 ? "up" : "down",
      change: Math.abs(engagementRate - 2).toFixed(1)
    };
  };

  // Calculate sentiment metrics
  const calculateSentimentMetrics = () => {
    if (!sentimentData?.length) return null;

    const avgSentiment = sentimentData.reduce((sum, item) => sum + item.sentiment_score, 0) / sentimentData.length;
    const previousAvg = 0.65; // This could be calculated from historical data

    return {
      score: avgSentiment.toFixed(2),
      trend: avgSentiment > previousAvg ? "up" : "down",
      change: Math.abs(avgSentiment - previousAvg).toFixed(1)
    };
  };

  const performanceMetrics = calculatePerformanceMetrics();
  const sentimentMetrics = calculateSentimentMetrics();

  const renderContent = () => {
    if (campaignsLoading || sentimentLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[160px] w-full" />
            <Skeleton className="h-[160px] w-full" />
            <Skeleton className="h-[160px] w-full" />
          </div>
        </div>
      );
    }

    if (!campaigns || campaigns.length === 0) {
      return (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No campaigns yet</h3>
          <p className="text-muted-foreground mt-2">
            Create your first campaign to start tracking performance and insights
          </p>
          <Button asChild className="mt-4">
            <Link to="/campaigns/new">
              Create Campaign
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have {campaigns.length} active campaign{campaigns.length === 1 ? "" : "s"}
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PerformanceCard
            title="Campaign Performance"
            value={performanceMetrics?.rate + "%" || "0%"}
            change={Number(performanceMetrics?.change || 0)}
            trend={performanceMetrics?.trend || "up"}
          />
          
          <PerformanceCard
            title="Brand Sentiment"
            value={sentimentMetrics?.score || "0.00"}
            change={Number(sentimentMetrics?.change || 0)}
            trend={sentimentMetrics?.trend || "up"}
          />

          <AIInsightsCard
            campaignType="awareness"
            insights={[
              {
                type: "success",
                message: "Campaign performance is above average",
                metric: `Engagement rate: ${performanceMetrics?.rate || 0}%`,
                recommendation: "Consider increasing budget allocation"
              },
              {
                type: "info",
                message: "Brand sentiment is positive",
                metric: `Sentiment score: ${sentimentMetrics?.score || 0}`,
                recommendation: "Maintain current content strategy"
              }
            ]}
          />
        </div>
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
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Campaign Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Track performance metrics and get AI-powered insights for your campaigns
              </p>
            </div>

            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;