import { useState } from "react";
import { PageLayout } from "@/components/Layout/PageLayout";
import { CampaignFilter } from "@/components/Audience/CampaignFilter";
import { PlatformFilter } from "@/components/Audience/PlatformFilter";
import { DemographicsCard } from "@/components/Audience/DemographicsCard";
import { InterestsCard } from "@/components/Audience/InterestsCard";
import { AIRecommendationsCard } from "@/components/Audience/AIRecommendationsCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Filter, Share2, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Audience = () => {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["all"]);

  const { data: audienceData } = useQuery({
    queryKey: ["audience-insights", selectedCampaign, selectedPlatforms],
    queryFn: async () => {
      let query = supabase.from("audience_insights").select("*");
      
      if (selectedCampaign !== "all") {
        query = query.eq("campaign_id", selectedCampaign);
      }
      if (!selectedPlatforms.includes("all")) {
        query = query.in("platform", selectedPlatforms);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data[0] || { demographics: {}, interests: {} };
    },
  });

  return (
    <PageLayout title="Audience Insights">
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Know Your Allies: Deep Audience Intelligence.</h1>
            <p className="text-muted-foreground">
              Discover the people who power your campaigns. Leverage detailed insights to build stronger connections and smarter strategies.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button size="sm" className="bg-gradient-brand hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="flex items-center gap-4 bg-gradient-subtle p-4 rounded-lg border animate-fade-in">
            <CampaignFilter
              selectedCampaign={selectedCampaign}
              onCampaignChange={setSelectedCampaign}
            />
            <PlatformFilter
              selectedPlatforms={selectedPlatforms}
              onPlatformChange={setSelectedPlatforms}
            />
          </div>
        </div>

        <Separator className="bg-border/5" />

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