import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function WebsitePerformanceOverview() {
  const { data: analyticsData, error } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => {
      // Modified query to handle no results case
      const { data, error } = await supabase
        .from("analytics_integrations")
        .select("*")
        .eq("platform_type", "google_analytics_4");

      if (error) throw error;
      
      // Return null if no integrations exist
      if (!data || data.length === 0) {
        return null;
      }

      const integration = data[0];

      // Fetch data from GA4 via Edge Function
      const { data: gaData, error: gaError } = await supabase.functions.invoke("fetch-ga4-overview", {
        body: { propertyId: integration.property_id }
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