import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function TrafficSourceAnalysis() {
  const { data: trafficData } = useQuery({
    queryKey: ["traffic-sources"],
    queryFn: async () => {
      const { data: analyticsIntegration } = await supabase
        .from("analytics_integrations")
        .select("*")
        .eq("platform_type", "google_analytics_4")
        .single();

      if (!analyticsIntegration) {
        return null;
      }

      // Fetch traffic source data from GA4 via Edge Function
      const { data, error } = await supabase.functions.invoke("fetch-ga4-traffic-sources", {
        body: { propertyId: analyticsIntegration.property_id }
      });

      if (error) throw error;
      return data;
    }
  });

  // Sample data structure (will be replaced by actual GA4 data)
  const sampleData = [
    { name: "Organic Search", value: 4000, color: "#4F46E5" },
    { name: "Paid Search", value: 3000, color: "#6366F1" },
    { name: "Social Media", value: 2000, color: "#818CF8" },
    { name: "Direct", value: 2780, color: "#A5B4FC" },
    { name: "Email", value: 1890, color: "#C7D2FE" },
    { name: "Referral", value: 2390, color: "#E0E7FF" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trafficData || sampleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {(trafficData || sampleData).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}