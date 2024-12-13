import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign } from "@/types/campaign";

interface ROICardProps {
  campaign: Campaign;
  kpis: {
    signups: { completed: number; target: number };
    purchases: { completed: number; target: number };
    revenue: { completed: number; target: number };
  };
}

export function ROICard({ campaign, kpis }: ROICardProps) {
  // Calculate total spend
  const totalSpend = campaign.campaign_metrics?.reduce(
    (sum, metric) => sum + (metric.spend || 0),
    0
  ) || 0;

  // Calculate ROI for each KPI
  const calculateROI = (value: number) => {
    if (totalSpend === 0) return 0;
    return ((value - totalSpend) / totalSpend) * 100;
  };

  const signupsROI = calculateROI(kpis.signups.completed);
  const purchasesROI = calculateROI(kpis.purchases.completed);
  const revenueROI = calculateROI(kpis.revenue.completed);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Return on Investment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Total Ad Spend</p>
              <p className="text-2xl font-bold">
                ${totalSpend.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Revenue</p>
              <p className="text-2xl font-bold">
                ${kpis.revenue.completed.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Signups ROI</span>
              <span className={signupsROI >= 0 ? "text-green-600" : "text-red-600"}>
                {signupsROI.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Purchases ROI</span>
              <span className={purchasesROI >= 0 ? "text-green-600" : "text-red-600"}>
                {purchasesROI.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Revenue ROI</span>
              <span className={revenueROI >= 0 ? "text-green-600" : "text-red-600"}>
                {revenueROI.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}