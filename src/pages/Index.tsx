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
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
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
        <div className="grid gap-6 md:grid-cols-2">
          <PerformanceCard
            title="Campaign Performance"
            value="85%"
            change={12}
            trend="up"
          />
          <AIInsightsCard
            campaignType="awareness"
            insights={[
              {
                type: "success",
                message: "Campaign performance is above average",
                metric: "Engagement rate: 4.2%",
                recommendation: "Consider increasing budget allocation"
              },
              {
                type: "info",
                message: "New audience segment identified",
                metric: "18-24 age group showing high engagement",
                recommendation: "Optimize content for younger audience"
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