import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CampaignFilterProps {
  selectedCampaign: string;
  onCampaignChange: (campaign: string) => void;
}

export function CampaignFilter({ selectedCampaign, onCampaignChange }: CampaignFilterProps) {
  const { data: campaigns } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("id, name")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Select value={selectedCampaign} onValueChange={onCampaignChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select campaign" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Campaigns</SelectItem>
        {campaigns?.map((campaign) => (
          <SelectItem key={campaign.id} value={campaign.id}>
            {campaign.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}