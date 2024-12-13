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

interface LinkedInCampaignsProps {
  accountId: string;
}

interface LinkedInCampaign {
  id: string;
  campaign_name: string;
  objective: string;
  status: string;
  daily_budget: number;
  total_budget: number;
  performance_metrics: {
    impressions?: number;
    clicks?: number;
    ctr?: number;
    spend?: number;
    conversions?: number;
  };
  last_sync_at: string;
}

export function LinkedInCampaigns({ accountId }: LinkedInCampaignsProps) {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["linkedin-campaigns", accountId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("linkedin_campaigns")
        .select("*")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as LinkedInCampaign[];
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
                <TableCell>{campaign.objective}</TableCell>
                <TableCell>
                  {campaign.performance_metrics.impressions?.toLocaleString() || 0}
                </TableCell>
                <TableCell>
                  {campaign.performance_metrics.clicks?.toLocaleString() || 0}
                </TableCell>
                <TableCell>
                  {campaign.performance_metrics.ctr?.toFixed(2) || "0.00"}%
                </TableCell>
                <TableCell>
                  ${campaign.daily_budget || campaign.total_budget || 0} 
                  {campaign.daily_budget ? " daily" : " lifetime"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}