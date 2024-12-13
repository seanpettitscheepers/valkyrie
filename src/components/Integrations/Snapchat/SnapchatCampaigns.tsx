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

interface SnapchatCampaignsProps {
  accountId: string;
}

interface SnapchatCampaign {
  id: string;
  campaign_name: string;
  objective: string;
  status: string;
  daily_budget_micro: number;
  total_budget_micro: number;
  performance_metrics: {
    impressions?: number;
    swipe_ups?: number;
    video_views?: number;
    spend?: number;
    conversions?: number;
  };
  last_sync_at: string;
}

interface SupabaseSnapchatCampaign {
  id: string;
  campaign_name: string;
  objective: string | null;
  status: string | null;
  daily_budget_micro: number | null;
  total_budget_micro: number | null;
  performance_metrics: {
    impressions?: number;
    swipe_ups?: number;
    video_views?: number;
    spend?: number;
    conversions?: number;
  } | null;
  last_sync_at: string | null;
}

export function SnapchatCampaigns({ accountId }: SnapchatCampaignsProps) {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["snapchat-campaigns", accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("snapchat_campaigns")
        .select("*")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data as SupabaseSnapchatCampaign[]).map((campaign): SnapchatCampaign => ({
        id: campaign.id,
        campaign_name: campaign.campaign_name,
        objective: campaign.objective || "",
        status: campaign.status || "UNKNOWN",
        daily_budget_micro: campaign.daily_budget_micro || 0,
        total_budget_micro: campaign.total_budget_micro || 0,
        performance_metrics: {
          impressions: campaign.performance_metrics?.impressions || 0,
          swipe_ups: campaign.performance_metrics?.swipe_ups || 0,
          video_views: campaign.performance_metrics?.video_views || 0,
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
              <TableHead>Swipe Ups</TableHead>
              <TableHead>Video Views</TableHead>
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
                <TableCell>{campaign.objective}</TableCell>
                <TableCell>
                  {campaign.performance_metrics.impressions.toLocaleString()}
                </TableCell>
                <TableCell>
                  {campaign.performance_metrics.swipe_ups.toLocaleString()}
                </TableCell>
                <TableCell>
                  {campaign.performance_metrics.video_views.toLocaleString()}
                </TableCell>
                <TableCell>
                  ${(campaign.daily_budget_micro || campaign.total_budget_micro) / 1000000} 
                  {campaign.daily_budget_micro ? " daily" : " lifetime"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}