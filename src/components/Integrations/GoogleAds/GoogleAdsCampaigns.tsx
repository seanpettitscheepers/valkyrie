import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { GoogleAdsCampaign } from "@/types/googleAds";

export function GoogleAdsCampaigns({ accountId }: { accountId: string }) {
  const { data: campaigns, isLoading, refetch } = useQuery({
    queryKey: ["google-ads-campaigns", accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("google_ads_campaigns")
        .select("*")
        .eq("account_id", accountId)
        .order("campaign_name");
      
      if (error) throw error;
      return data as GoogleAdsCampaign[];
    },
  });

  const handleSync = async () => {
    try {
      const { error } = await supabase.functions.invoke("sync-google-ads-campaigns", {
        body: { accountId },
      });

      if (error) throw error;

      toast.success("Successfully synced Google Ads campaigns");
      refetch();
    } catch (error) {
      console.error("Error syncing campaigns:", error);
      toast.error("Failed to sync campaigns. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Campaigns</h3>
        <Button onClick={handleSync} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync Campaigns
        </Button>
      </div>

      {campaigns?.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No campaigns found. Click sync to fetch your Google Ads campaigns.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {campaigns?.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {campaign.campaign_name}
                </CardTitle>
                <Badge 
                  variant={campaign.status === "ENABLED" ? "default" : "secondary"}
                >
                  {campaign.status?.toLowerCase()}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Type: {campaign.campaign_type}
                  </div>
                  {campaign.budget_amount && (
                    <div className="text-sm text-muted-foreground">
                      Budget: ${campaign.budget_amount} ({campaign.budget_type})
                    </div>
                  )}
                  {campaign.performance_metrics && (
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="text-xs">
                        <div className="font-medium">Impressions</div>
                        <div className="text-muted-foreground">
                          {(campaign.performance_metrics as any)?.impressions?.toLocaleString() || 0}
                        </div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium">Clicks</div>
                        <div className="text-muted-foreground">
                          {(campaign.performance_metrics as any)?.clicks?.toLocaleString() || 0}
                        </div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium">Cost</div>
                        <div className="text-muted-foreground">
                          ${((campaign.performance_metrics as any)?.cost || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}