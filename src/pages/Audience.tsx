import { useState } from "react";
import { PageLayout } from "@/components/Layout/PageLayout";
import { CampaignFilter } from "@/components/Audience/CampaignFilter";
import { PlatformFilter } from "@/components/Audience/PlatformFilter";
import { DemographicsCard } from "@/components/Audience/DemographicsCard";
import { InterestsCard } from "@/components/Audience/InterestsCard";
import { AIRecommendationsCard } from "@/components/Audience/AIRecommendationsCard";

const Audience = () => {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

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
        <DemographicsCard
          campaignId={selectedCampaign}
          platform={selectedPlatform}
        />
        <InterestsCard
          campaignId={selectedCampaign}
          platform={selectedPlatform}
        />
      </div>

      <div className="mt-6">
        <AIRecommendationsCard
          campaignId={selectedCampaign}
          platform={selectedPlatform}
        />
      </div>
    </PageLayout>
  );
};

export default Audience;
