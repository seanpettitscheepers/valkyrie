import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecommendationsList } from "./RecommendationsList";
import { PerformanceImpactChart } from "./PerformanceImpactChart";
import { CampaignSelector } from "./CampaignSelector";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function OptimizationDashboard() {
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const { toast } = useToast();

  const { data: recommendations, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
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
            <CardTitle>Optimization Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Recommendations</span>
                <span className="font-medium">{recommendations?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Implemented</span>
                <span className="font-medium">
                  {recommendations?.filter(r => r.status === "implemented").length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Pending</span>
                <span className="font-medium">
                  {recommendations?.filter(r => r.status === "pending").length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <RecommendationsList recommendations={recommendations || []} />
    </div>
  );
}