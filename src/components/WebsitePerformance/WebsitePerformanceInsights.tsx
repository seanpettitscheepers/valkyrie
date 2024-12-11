import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";

export function WebsitePerformanceInsights() {
  const { data: insights, isLoading } = useQuery({
    queryKey: ["performance-insights"],
    queryFn: async () => {
      const { data: analyticsIntegration } = await supabase
        .from("analytics_integrations")
        .select("*")
        .eq("platform_type", "google_analytics_4")
        .single();

      if (!analyticsIntegration) {
        return null;
      }

      // Fetch insights from GA4 via Edge Function
      const { data, error } = await supabase.functions.invoke("generate-performance-insights", {
        body: { propertyId: analyticsIntegration.property_id }
      });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading insights...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI-Generated Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights ? (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />') }} />
          </div>
        ) : (
          <Alert>
            <AlertDescription>
              Connect your Google Analytics account to view AI-generated insights about your website performance.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}