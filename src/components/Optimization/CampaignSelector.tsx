import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CampaignSelectorProps {
  selectedCampaign: string;
  onSelect: (value: string) => void;
}

export function CampaignSelector({ selectedCampaign, onSelect }: CampaignSelectorProps) {
  const { data: campaigns } = useQuery({
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

  return (
    <Select value={selectedCampaign} onValueChange={onSelect}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select Campaign" />
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