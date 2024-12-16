import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SavedCampaignSelectorProps {
  onSelect: (names: {
    campaignName: string;
    adSetName: string;
    adName: string;
  }) => void;
}

export function SavedCampaignSelector({ onSelect }: SavedCampaignSelectorProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");

  const { data: savedCampaigns } = useQuery({
    queryKey: ["saved-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_campaign_names")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleImport = () => {
    if (!selectedCampaign || !savedCampaigns) return;

    const campaign = savedCampaigns.find((c) => c.id === selectedCampaign);
    if (!campaign) return;

    // Get the first platform's names as default
    const platformKey = Object.keys(campaign.platform_names)[0];
    const names = campaign.platform_names[platformKey];

    onSelect({
      campaignName: names.campaign,
      adSetName: names.adset,
      adName: names.ad,
    });

    toast.success("Campaign names imported successfully");
  };

  if (!savedCampaigns?.length) return null;

  return (
    <div className="flex gap-4 items-end mb-6">
      <div className="flex-1">
        <label className="text-sm font-medium mb-2 block">
          Import from Saved Campaigns
        </label>
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <SelectTrigger>
            <SelectValue placeholder="Select a saved campaign" />
          </SelectTrigger>
          <SelectContent>
            {savedCampaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                {campaign.campaign_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleImport} disabled={!selectedCampaign}>
        Import Names
      </Button>
    </div>
  );
}