import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

interface TwitterCampaignsProps {
  accountId: string;
}

export function TwitterCampaigns({ accountId }: TwitterCampaignsProps) {
  const { toast } = useToast();
  const { data: campaigns, isLoading, refetch } = useQuery({
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

  const syncCampaigns = async () => {
    try {
      toast({
        title: "Syncing campaigns...",
        description: "Please wait while we fetch your campaign data.",
      });

      await supabase.functions.invoke("sync-twitter-campaigns", {
        body: { accountId },
      });

      await refetch();

      toast({
        title: "Sync complete",
        description: "Your Twitter campaigns have been updated.",
      });
    } catch (error) {
      console.error("Error syncing campaigns:", error);
      toast({
        title: "Sync failed",
        description: "Failed to sync Twitter campaigns. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Campaigns</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={syncCampaigns}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync Campaigns
        </Button>
      </div>

      <div className="space-y-2">
        {campaigns?.map((campaign) => (
          <Card key={campaign.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{campaign.campaign_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Objective: {campaign.objective}
                  </p>
                </div>
                <Badge
                  variant={campaign.status === "ACTIVE" ? "default" : "secondary"}
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
                    <p className="text-sm text-muted-foreground">Engagements</p>
                    <p className="font-medium">
                      {campaign.performance_metrics.engagements?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Spend</p>
                    <p className="font-medium">
                      ${campaign.performance_metrics.spend?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {campaigns?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No campaigns found
          </p>
        )}
      </div>
    </div>
  );
}