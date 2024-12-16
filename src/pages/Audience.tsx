import { PageLayout } from "@/components/Layout/PageLayout";
import { PageHeader } from "@/components/ui/page-header";
import { AudienceInsights } from "@/components/Audience/AudienceInsights";
import { DemographicsCard } from "@/components/Audience/DemographicsCard";
import { InterestsCard } from "@/components/Audience/InterestsCard";
import { BehaviorAnalysis } from "@/components/Audience/BehaviorAnalysis";
import { CampaignFilter } from "@/components/Audience/CampaignFilter";
import { DateRangePicker } from "@/components/Reports/DateRangePicker";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Audience() {
  const [selectedCampaign, setSelectedCampaign] = useState("all");

  const { data: audienceData } = useQuery({
    queryKey: ["audience-data", selectedCampaign],
    queryFn: async () => {
      let query = supabase.from("audience_data").select("*");
      
      if (selectedCampaign !== "all") {
        query = query.eq("campaign_id", selectedCampaign);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <PageLayout title="Audience Insights">
      <div className="space-y-6">
        <PageHeader
          title="Know Your Warriors: Audience Intelligence"
          description="Understand who your campaigns reach, engage, and convert. Use data-driven insights to refine your targeting and maximize impact."
        />
        
        <div className="flex items-center justify-between">
          <CampaignFilter
            selectedCampaign={selectedCampaign}
            onCampaignChange={setSelectedCampaign}
          />
          <DateRangePicker />
        </div>

        <AudienceInsights data={audienceData} />

        <div className="grid gap-6 md:grid-cols-2">
          <DemographicsCard demographics={audienceData?.[0]?.demographics} />
          <InterestsCard interests={audienceData?.[0]?.interests} />
        </div>

        <BehaviorAnalysis data={audienceData} />
      </div>
    </PageLayout>
  );
}