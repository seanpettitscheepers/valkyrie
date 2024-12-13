import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DV360CampaignsProps {
  accountId: string;
}

export function DV360Campaigns({ accountId }: DV360CampaignsProps) {
  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ["dv360-campaigns", accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dv360_campaigns")
        .select("*")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error loading campaigns: {error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!campaigns?.length) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No campaigns found for this account.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id}>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {campaign.campaign_name}
              </CardTitle>
              <Badge variant={campaign.status === "ACTIVE" ? "success" : "secondary"}>
                {campaign.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-medium">
                  {campaign.budget_amount ? `$${campaign.budget_amount.toLocaleString()}` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Impressions</p>
                <p className="font-medium">
                  {campaign.performance_metrics?.impressions?.toLocaleString() || "0"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clicks</p>
                <p className="font-medium">
                  {campaign.performance_metrics?.clicks?.toLocaleString() || "0"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CTR</p>
                <p className="font-medium">
                  {campaign.performance_metrics?.ctr?.toFixed(2) || "0"}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}