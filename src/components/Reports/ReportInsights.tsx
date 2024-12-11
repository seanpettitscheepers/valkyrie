import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ReportInsightsProps {
  data: {
    performanceData: any[];
    audienceData: any[];
    sentimentData: any[];
  };
}

export function ReportInsights({ data }: ReportInsightsProps) {
  const { data: insights, isLoading } = useQuery({
    queryKey: ["report-insights", data],
    queryFn: async () => {
      const { data: response, error } = await supabase.functions.invoke("generate-report-insights", {
        body: data,
      });

      if (error) throw error;
      return response.insights;
    },
  });

  if (isLoading) {
    return <div>Generating insights...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI-Generated Insights
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
              No insights available. Try selecting different metrics or date ranges.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}