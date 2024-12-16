import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FunnelChart, Funnel, LabelList, ResponsiveContainer } from "recharts";

export function CustomerJourneyAnalysis() {
  const { data: journeyData } = useQuery({
    queryKey: ["customer-journey"],
    queryFn: async () => {
      const { data: analyticsIntegration } = await supabase
        .from("analytics_integrations")
        .select("*")
        .eq("platform_type", "google_analytics_4")
        .single();

      if (!analyticsIntegration) {
        return null;
      }

      // Fetch journey data from GA4 via Edge Function
      const { data, error } = await supabase.functions.invoke("fetch-ga4-journey", {
        body: { propertyId: analyticsIntegration.property_id }
      });

      if (error) throw error;
      return data;
    }
  });

  const funnelData = [
    { name: "Website Visits", value: 1200, fill: "#496946" },
    { name: "Product Views", value: 800, fill: "#858071" },
    { name: "Add to Cart", value: 400, fill: "#C2B8B0" },
    { name: "Purchases", value: 200, fill: "#EBE5D5" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Journey Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Funnel
                data={funnelData}
                dataKey="value"
                nameKey="name"
              >
                <LabelList 
                  position="right" 
                  fill="#1F1E1B" 
                  stroke="none" 
                  dataKey="name" 
                />
                <LabelList 
                  position="right" 
                  fill="#858071" 
                  stroke="none" 
                  dataKey="value" 
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}