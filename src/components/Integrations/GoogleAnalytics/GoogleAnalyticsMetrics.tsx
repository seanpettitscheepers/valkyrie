import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface GoogleAnalyticsMetricsProps {
  propertyId: string;
}

export function GoogleAnalyticsMetrics({ propertyId }: GoogleAnalyticsMetricsProps) {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["ga4-metrics", propertyId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("fetch-ga4-metrics", {
        body: { propertyId }
      });

      if (error) throw error;
      return data;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load Google Analytics metrics
        </AlertDescription>
      </Alert>
    );
  }

  if (!metrics) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.userChange >= 0 ? "+" : ""}{metrics.userChange}% from last period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.sessions}</div>
          <p className="text-xs text-muted-foreground">
            {metrics.sessionChange >= 0 ? "+" : ""}{metrics.sessionChange}% from last period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.bounceRate}%</div>
          <p className="text-xs text-muted-foreground">
            {metrics.bounceRateChange <= 0 ? "+" : ""}{-metrics.bounceRateChange}% from last period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.avgSessionDuration}s</div>
          <p className="text-xs text-muted-foreground">
            {metrics.durationChange >= 0 ? "+" : ""}{metrics.durationChange}% from last period
          </p>
        </CardContent>
      </Card>
    </div>
  );
}