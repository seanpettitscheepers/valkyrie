import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function WebsitePerformanceOverview() {
  const { data: analyticsData, error } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_integrations")
        .select("*")
        .eq("platform_type", "google_analytics_4")
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, return null to show default metrics
          return null;
        }
        throw error;
      }

      // Fetch data from GA4 via Edge Function
      const { data: gaData, error: gaError } = await supabase.functions.invoke("fetch-ga4-overview", {
        body: { propertyId: data.property_id }
      });

      if (gaError) throw gaError;
      return gaData;
    },
  });

  // Default metrics to show even when no data is available
  const overviewMetrics = [
    { title: "Total Users", value: analyticsData?.totalUsers || "0", change: analyticsData ? "+5.2%" : "N/A" },
    { title: "Active Users", value: analyticsData?.activeUsers || "0", change: analyticsData ? "+2.1%" : "N/A" },
    { title: "New Users", value: analyticsData?.newUsers || "0", change: analyticsData ? "+3.5%" : "N/A" },
    { title: "Avg. Session Duration", value: analyticsData?.avgSessionDuration || "0m", change: analyticsData ? "-1.2%" : "N/A" }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {error && (
        <Alert variant="destructive" className="col-span-full">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load analytics data. Please try again later.
          </AlertDescription>
        </Alert>
      )}
      
      {overviewMetrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className={`text-xs ${metric.change === "N/A" ? 'text-gray-500' : (metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600')}`}>
              {metric.change} {metric.change !== "N/A" && "from last period"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}