import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CampaignMetricsProps {
  campaign: {
    campaign_name: string;
    status: string;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    last_sync_at: string;
  };
}

export const CampaignMetrics = ({ campaign }: CampaignMetricsProps) => {
  return (
    <div className="ml-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{campaign.campaign_name}</p>
          <p className="text-sm text-muted-foreground">
            Last synced: {new Date(campaign.last_sync_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {campaign.status}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        <div>
          <p className="text-sm text-muted-foreground">Spend</p>
          <p className="font-medium">${campaign.spend}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Impressions</p>
          <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Clicks</p>
          <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Conversions</p>
          <p className="font-medium">{campaign.conversions.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};