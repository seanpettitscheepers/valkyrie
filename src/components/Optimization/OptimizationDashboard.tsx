import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecommendationsList } from "./RecommendationsList";
import { PerformanceImpactChart } from "./PerformanceImpactChart";
import { CampaignSelector } from "./CampaignSelector";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useOptimizationAnalysis } from "@/hooks/useOptimizationAnalysis";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function OptimizationDashboard() {
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const { toast } = useToast();

  // Fetch campaign analysis
  const { 
    data: analysis, 
    isLoading: analysisLoading, 
    error: analysisError 
  } = useOptimizationAnalysis(selectedCampaign !== "all" ? selectedCampaign : undefined);

  // Fetch recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ["optimization-recommendations", selectedCampaign],
    queryFn: async () => {
      let query = supabase
        .from("optimization_recommendations")
        .select(`
          *,
          campaign:campaigns(*)
        `);

      if (selectedCampaign !== "all") {
        query = query.eq("campaign_id", selectedCampaign);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch optimization recommendations",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  if (analysisLoading || recommendationsLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (analysisError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load campaign analysis. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <CampaignSelector
          selectedCampaign={selectedCampaign}
          onSelect={setSelectedCampaign}
        />
      </div>

      {analysis && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">CTR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analysis.kpis.ctr.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Click-through rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">CPC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${analysis.kpis.cpc.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Cost per click
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">CPA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${analysis.kpis.cpa.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Cost per acquisition
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analysis.kpis.conversionRate.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Conversion rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceImpactChart recommendations={recommendations || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis?.insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    insight.type === 'positive' 
                      ? 'bg-green-50 border-green-200' 
                      : insight.type === 'negative'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <p className="font-medium">{insight.message}</p>
                  {insight.recommendation && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Recommendation: {insight.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <RecommendationsList recommendations={recommendations || []} />
    </div>
  );
}