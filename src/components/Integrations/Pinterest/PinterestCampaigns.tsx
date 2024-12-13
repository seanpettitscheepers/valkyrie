import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PinterestCampaignsProps {
  accountId: string;
}

interface PinterestCampaign {
  id: string;
  campaign_name: string;
  objective_type: string;
  status: string;
  daily_spend_cap: number;
  lifetime_spend_cap: number;
  performance_metrics: {
    impressions?: number;
    clicks?: number;
    ctr?: number;
    spend?: number;
    conversions?: number;
  };
  last_sync_at: string;
}

interface SupabasePinterestCampaign {
  id: string;
  campaign_name: string;
  objective_type: string | null;
  status: string | null;
  daily_spend_cap: number | null;
  lifetime_spend_cap: number | null;
  performance_metrics: {
    impressions?: number;
    clicks?: number;
    ctr?: number;
    spend?: number;
    conversions?: number;
  } | null;
  last_sync_at: string | null;
}

export function PinterestCampaigns({ accountId }: PinterestCampaignsProps) {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["pinterest-campaigns", accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pinterest_campaigns")
        .select("*")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data as SupabasePinterestCampaign[]).map((campaign): PinterestCampaign => ({
        id: campaign.id,
        campaign_name: campaign.campaign_name,
        objective_type: campaign.objective_type || "",
        status: campaign.status || "UNKNOWN",
        daily_spend_cap: campaign.daily_spend_cap || 0,
        lifetime_spend_cap: campaign.lifetime_spend_cap || 0,
        performance_metrics: {
          impressions: campaign.performance_metrics?.impressions || 0,
          clicks: campaign.performance_metrics?.clicks || 0,
          ctr: campaign.performance_metrics?.ctr || 0,
          spend: campaign.performance_metrics?.spend || 0,
          conversions: campaign.performance_metrics?.conversions || 0,
        },
        last_sync_at: campaign.last_sync_at || "",
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!campaigns?.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Objective</TableHead>
              <TableHead>Impressions</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>Budget</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.campaign_name}</TableCell>
                <TableCell>
                  <Badge variant={campaign.status === "ACTIVE" ? "secondary" : "outline"}>
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell>{campaign.objective_type}</TableCell>
                <TableCell>
                  {campaign.performance_metrics.impressions.toLocaleString()}
                </TableCell>
                <TableCell>
                  {campaign.performance_metrics.clicks.toLocaleString()}
                </TableCell>
                <TableCell>
                  {campaign.performance_metrics.ctr.toFixed(2)}%
                </TableCell>
                <TableCell>
                  ${campaign.daily_spend_cap || campaign.lifetime_spend_cap} {campaign.daily_spend_cap ? "daily" : "lifetime"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}