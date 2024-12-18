import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, TrendingUp } from "lucide-react";

interface MetricsCardsProps {
  analytics: {
    total_users: number;
    active_users: number;
    monthly_revenue: number;
    total_revenue: number;
    monthly_profit: number;
    total_profit: number;
  };
}

export function MetricsCards({ analytics }: MetricsCardsProps) {
  const calculateChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-card hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{analytics?.total_users}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <TrendingUp className="h-4 w-4 inline mr-1" />
            {calculateChange(analytics?.total_users || 0, (analytics?.total_users || 0) - (analytics?.active_users || 0))}% from last period
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <CreditCard className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            ${analytics?.monthly_revenue?.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            <TrendingUp className="h-4 w-4 inline mr-1" />
            {calculateChange(analytics?.monthly_revenue || 0, (analytics?.total_revenue || 0) / 12)}% from last month
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            ${analytics?.monthly_profit?.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            <TrendingUp className="h-4 w-4 inline mr-1" />
            {calculateChange(analytics?.monthly_profit || 0, (analytics?.total_profit || 0) / 12)}% from last month
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          <CreditCard className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            ${analytics?.total_profit?.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            <TrendingUp className="h-4 w-4 inline mr-1" />
            {calculateChange(analytics?.total_profit || 0, (analytics?.total_revenue || 0) - (analytics?.total_profit || 0))}% total growth
          </div>
        </CardContent>
      </Card>
    </div>
  );
}