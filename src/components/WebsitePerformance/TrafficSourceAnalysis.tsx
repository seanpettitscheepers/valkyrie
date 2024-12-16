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
    { name: "Organic Search", value: 4000, color: "#496946" },  // Primary
    { name: "Paid Search", value: 3000, color: "#858071" },     // Secondary
    { name: "Social Media", value: 2000, color: "#C2B8B0" },    // Accent
    { name: "Direct", value: 2780, color: "#EBE5D5" },          // Background
    { name: "Email", value: 1890, color: "#6A665A" },           // Secondary-600
    { name: "Referral", value: 2390, color: "#2C402C" },        // Primary-700
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
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#EBE5D5",
                  border: "1px solid #C2B8B0",
                  borderRadius: "0.5rem"
                }}
                labelStyle={{ color: "#1F1E1B" }}
              />
              <Legend 
                formatter={(value) => <span style={{ color: "#1F1E1B" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}