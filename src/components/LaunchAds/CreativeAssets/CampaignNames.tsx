import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CampaignNamesProps {
  names: {
    campaignName: string;
    adSetName: string;
    adName: string;
  };
  onNamesChange: (field: string, value: string) => void;
}

export function CampaignNames({ names, onNamesChange }: CampaignNamesProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Campaign Name</Label>
        <Input
          placeholder="Enter campaign name"
          value={names.campaignName}
          onChange={(e) => onNamesChange("campaignName", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Ad Set Name</Label>
        <Input
          placeholder="Enter ad set name"
          value={names.adSetName}
          onChange={(e) => onNamesChange("adSetName", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Ad Name</Label>
        <Input
          placeholder="Enter ad name"
          value={names.adName}
          onChange={(e) => onNamesChange("adName", e.target.value)}
        />
      </div>
    </div>
  );
}