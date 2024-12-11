import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function WebsitePerformanceMetrics() {
  const { data: metricsData } = useQuery({
    queryKey: ["website-metrics"],
    queryFn: async () => {
      const { data: analyticsIntegration } = await supabase
        .from("analytics_integrations")
        .select("*")
        .eq("platform_type", "google_analytics_4")
        .single();

      if (!analyticsIntegration) {
        return null;
      }

      // Fetch metrics data from GA4 via Edge Function
      const { data, error } = await supabase.functions.invoke("fetch-ga4-metrics", {
        body: { propertyId: analyticsIntegration.property_id }
      });

      if (error) throw error;
      return data;
    }
  });

  const performanceData = [
    { name: "Page Views", value: 15000 },
    { name: "Unique Views", value: 12000 },
    { name: "Avg. Time on Page", value: 180 },
    { name: "Bounce Rate", value: 45 },
    { name: "Exit Rate", value: 35 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}