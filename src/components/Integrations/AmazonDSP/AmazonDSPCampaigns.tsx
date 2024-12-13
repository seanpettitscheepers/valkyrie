import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AmazonDSPCampaignsProps {
  accountId: string;
}

export function AmazonDSPCampaigns({ accountId }: AmazonDSPCampaignsProps) {
  const { data: campaigns, isLoading, refetch } = useQuery({
    queryKey: ["amazon-dsp-campaigns", accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("amazon_dsp_campaigns")
        .select("*")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const syncCampaigns = async () => {
    try {
      await supabase.functions.invoke("sync-amazon-dsp-campaigns", {
        body: { accountId },
      });
      refetch();
    } catch (error) {
      console.error("Error syncing campaigns:", error);
    }
  };

  if (isLoading) {
    return <div>Loading campaigns...</div>;
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
          <div
            key={campaign.id}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{campaign.campaign_name}</h4>
                <p className="text-sm text-muted-foreground">
                  Status: {campaign.status}
                </p>
              </div>
              <div className="text-sm text-right">
                <p>Budget: ${campaign.daily_budget}</p>
                <p className="text-muted-foreground">
                  {campaign.start_date} - {campaign.end_date}
                </p>
              </div>
            </div>
          </div>
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