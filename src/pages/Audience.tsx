import { useState } from "react";
import { PageLayout } from "@/components/Layout/PageLayout";
import { CampaignFilter } from "@/components/Audience/CampaignFilter";
import { PlatformFilter } from "@/components/Audience/PlatformFilter";
import { DemographicsCard } from "@/components/Audience/DemographicsCard";
import { InterestsCard } from "@/components/Audience/InterestsCard";
import { AIRecommendationsCard } from "@/components/Audience/AIRecommendationsCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Audience Insights</h1>
          <p className="text-muted-foreground mt-1">
            Analyze your audience demographics and interests across platforms
          </p>
        </div>
        <div className="flex gap-4">
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

      <div className="grid gap-6 md:grid-cols-2">
        <DemographicsCard demographics={audienceData?.demographics || {}} />
        <InterestsCard interests={audienceData?.interests || {}} />
      </div>

      <div className="mt-6">
        <AIRecommendationsCard audienceData={audienceData} />
      </div>
    </PageLayout>
  );
};

export default Audience;