import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TwitterCampaignsProps {
  accountId: string;
}

export function TwitterCampaigns({ accountId }: TwitterCampaignsProps) {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["twitter-campaigns", accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("twitter_campaigns")
        .select("*")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
      </div>
    );
  }

  if (!campaigns?.length) {
    return (
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            No campaigns found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{campaign.campaign_name}</h4>
                <p className="text-sm text-muted-foreground">
                  {campaign.objective}
                </p>
              </div>
              <Badge
                variant={campaign.status === "active" ? "default" : "secondary"}
              >
                {campaign.status}
              </Badge>
            </div>
            {campaign.performance_metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Impressions</p>
                  <p className="font-medium">
                    {campaign.performance_metrics.impressions?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clicks</p>
                  <p className="font-medium">
                    {campaign.performance_metrics.clicks?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CTR</p>
                  <p className="font-medium">
                    {campaign.performance_metrics.ctr?.toFixed(2) || 0}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Spend</p>
                  <p className="font-medium">
                    ${campaign.performance_metrics.spend?.toFixed(2) || 0}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}