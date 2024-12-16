import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ROICardProps {
  campaign: {
    id: string;
    campaign_metrics?: Array<{
      spend: number;
      conversions: number;
    }>;
  };
  kpis: {
    revenue: {
      completed: number;
    };
  };
}

export function ROICard({ campaign, kpis }: ROICardProps) {
  const totalSpend = campaign.campaign_metrics?.reduce((sum, metric) => sum + metric.spend, 0) || 0;
  const totalRevenue = kpis.revenue.completed || 0;
  const roi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">ROI</CardTitle>
        <span className="text-sm text-muted-foreground">YTD</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {roi.toFixed(1)}%
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Revenue: ${totalRevenue.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">
          Spend: ${totalSpend.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}