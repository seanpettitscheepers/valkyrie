import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function WebsitePerformanceOverview() {
  const { data: analyticsData } = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => {
      const { data: analyticsIntegration } = await supabase
        .from("analytics_integrations")
        .select("*")
        .eq("platform_type", "google_analytics_4")
        .single();

      if (!analyticsIntegration) {
        return null;
      }

      // Fetch data from GA4 via Edge Function
      const { data, error } = await supabase.functions.invoke("fetch-ga4-overview", {
        body: { propertyId: analyticsIntegration.property_id }
      });

      if (error) throw error;
      return data;
    }
  });

  const overviewMetrics = [
    { title: "Total Users", value: analyticsData?.totalUsers || "0", change: "+5.2%" },
    { title: "Active Users", value: analyticsData?.activeUsers || "0", change: "+2.1%" },
    { title: "New Users", value: analyticsData?.newUsers || "0", change: "+3.5%" },
    { title: "Avg. Session Duration", value: analyticsData?.avgSessionDuration || "0m", change: "-1.2%" }
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
            <p className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change} from last period
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}