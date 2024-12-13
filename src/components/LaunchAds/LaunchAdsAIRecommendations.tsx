import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchCampaignMetrics, getAIRecommendations } from "@/utils/aiRecommendations";

export function LaunchAdsAIRecommendations() {
  const [objective, setObjective] = useState("");
  const { toast } = useToast();

  const { data: recommendations, refetch, isLoading } = useQuery({
    queryKey: ['launch-ads-recommendations', objective],
    queryFn: async () => {
      if (!objective.trim()) return null;

      try {
        const performanceData = await fetchCampaignMetrics();
        return await getAIRecommendations(objective, performanceData || []);
      } catch (err) {
        console.error('Error getting recommendations:', err);
        toast({
          title: "Error",
          description: "Failed to get recommendations. Please try again.",
          variant: "destructive",
        });
        throw err;
      }
    },
    enabled: false,
  });

  const handleAnalyze = () => {
    if (!objective.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe your advertising objective.",
        variant: "destructive",
      });
      return;
    }
    refetch();
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Campaign Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Describe what you're trying to achieve with these ads... (e.g., 'I want to increase brand awareness among young professionals in the tech industry')"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            rows={4}
          />
          <Button 
            onClick={handleAnalyze}
            disabled={isLoading || !objective.trim()}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get AI Recommendations
          </Button>
        </div>

        {recommendations && (
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Platform Recommendations</h3>
              <p className="text-sm text-muted-foreground">{recommendations.platforms}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Targeting Recommendations</h3>
              <p className="text-sm text-muted-foreground">{recommendations.targeting}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Creative Recommendations</h3>
              <p className="text-sm text-muted-foreground">{recommendations.creatives}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}