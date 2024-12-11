import { useState } from "react";
import { PageLayout } from "@/components/Layout/PageLayout";
import { CampaignFilter } from "@/components/Audience/CampaignFilter";
import { PlatformFilter } from "@/components/Audience/PlatformFilter";
import { DemographicsCard } from "@/components/Audience/DemographicsCard";
import { InterestsCard } from "@/components/Audience/InterestsCard";
import { AIRecommendationsCard } from "@/components/Audience/AIRecommendationsCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Filter, Share2, MoreHorizontal, Plus, ChevronLeft, ChevronRight, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Audience = () => {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const { data: audienceData } = useQuery({
    queryKey: ["audience-insights", selectedCampaign, selectedPlatform],
    queryFn: async () => {
      let query = supabase.from("audience_insights").select("*");
      
      if (selectedCampaign !== "all") {
        query = query.eq("campaign_id", selectedCampaign);
      }
      if (selectedPlatform !== "all") {
        query = query.eq("platform", selectedPlatform);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data[0] || { demographics: {}, interests: {} };
    },
  });

  return (
    <PageLayout title="Audience Insights">
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold">User Analysis</h1>
              <p className="text-muted-foreground mt-1">
                Unlock valuable insights into user behavior and preferences through our comprehensive user analysis, empowering your decision-making with data-driven strategies.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <List className="h-4 w-4" />
                Topics
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CampaignFilter
              selectedCampaign={selectedCampaign}
              onCampaignChange={setSelectedCampaign}
            />
            <PlatformFilter
              selectedPlatform={selectedPlatform}
              onPlatformChange={setSelectedPlatform}
            />
          </div>
        </div>

        <Separator />

        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <DemographicsCard demographics={audienceData?.demographics || {}} />
            <InterestsCard interests={audienceData?.interests || {}} />
          </div>
          <AIRecommendationsCard audienceData={audienceData} />
        </div>
      </div>
    </PageLayout>
  );
};

export default Audience;