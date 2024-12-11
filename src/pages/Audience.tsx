import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { PlatformFilter } from "@/components/Audience/PlatformFilter";
import { CampaignFilter } from "@/components/Audience/CampaignFilter";
import { DemographicsCard } from "@/components/Audience/DemographicsCard";
import { InterestsCard } from "@/components/Audience/InterestsCard";
import { AIRecommendationsCard } from "@/components/Audience/AIRecommendationsCard";
import { AddInsightForm } from "@/components/Audience/AddInsightForm";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface AudienceInsight {
  id: string;
  campaign_id: string;
  platform: string;
  demographics: {
    age?: { [key: string]: number };
    gender?: { [key: string]: number };
    education?: { [key: string]: number };
    occupation?: { [key: string]: number };
    marital_status?: { [key: string]: number };
  };
  interests: {
    categories?: string[];
    topics?: string[];
  };
}

const Audience = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: insights, isLoading } = useQuery({
    queryKey: ["audience-insights", selectedPlatform, selectedCampaign],
    queryFn: async () => {
      let query = supabase.from("audience_insights").select("*");
      
      if (selectedPlatform !== "all") {
        query = query.eq("platform", selectedPlatform);
      }
      
      if (selectedCampaign !== "all") {
        query = query.eq("campaign_id", selectedCampaign);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as AudienceInsight[];
    },
  });

  const aggregateData = (insights: AudienceInsight[] | undefined): AudienceInsight | undefined => {
    if (!insights || insights.length === 0) return undefined;
    
    // If only one platform is selected, return its data directly
    if (insights.length === 1) return insights[0];

    // Otherwise, aggregate the data
    const aggregated: AudienceInsight = {
      id: "aggregated",
      campaign_id: "aggregated",
      platform: "all",
      demographics: {},
      interests: {
        categories: [],
        topics: [],
      },
    };

    // Combine demographics
    insights.forEach((insight) => {
      Object.entries(insight.demographics).forEach(([key, values]) => {
        if (!aggregated.demographics[key]) {
          aggregated.demographics[key] = {};
        }
        
        Object.entries(values).forEach(([subKey, value]) => {
          aggregated.demographics[key][subKey] = (aggregated.demographics[key][subKey] || 0) + value;
        });
      });

      // Combine interests
      if (insight.interests.categories) {
        aggregated.interests.categories = [
          ...new Set([...(aggregated.interests.categories || []), ...insight.interests.categories]),
        ];
      }
      if (insight.interests.topics) {
        aggregated.interests.topics = [
          ...new Set([...(aggregated.interests.topics || []), ...insight.interests.topics]),
        ];
      }
    });

    // Normalize percentages for demographics
    Object.entries(aggregated.demographics).forEach(([key, values]) => {
      const total = Object.values(values).reduce((sum, value) => sum + value, 0);
      Object.keys(values).forEach((subKey) => {
        aggregated.demographics[key][subKey] = Math.round((values[subKey] / total) * 100);
      });
    });

    return aggregated;
  };

  const aggregatedData = aggregateData(insights);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
          <Skeleton className="h-[200px] w-full" />
        </div>
      );
    }

    if (!insights || insights.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No audience insights yet</h3>
          <p className="text-muted-foreground mt-2">
            Add your first audience insight to start analyzing your audience demographics and interests.
          </p>
          <Button onClick={() => setIsFormOpen(true)} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Insight
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <DemographicsCard demographics={aggregatedData?.demographics || {}} />
          <InterestsCard interests={aggregatedData?.interests || {}} />
        </div>
        <AIRecommendationsCard audienceData={aggregatedData} />
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
                <h1 className="text-3xl font-bold">Audience Insights</h1>
                <p className="text-muted-foreground mt-1">
                  Analyze and understand your audience demographics, interests, and behaviors
                </p>
              </div>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Insight
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Audience Insight</DialogTitle>
                  </DialogHeader>
                  <AddInsightForm />
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex gap-4 mb-6 flex-wrap">
              <PlatformFilter
                selectedPlatform={selectedPlatform}
                onPlatformChange={setSelectedPlatform}
              />
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

export default Audience;