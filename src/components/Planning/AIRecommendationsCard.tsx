import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AIRecommendationsCardProps {
  objective: string;
  totalBudget: number;
  platforms: string[];
  targetingObjectives: any[];
  onImplementRecommendations: (recommendations: string) => void;
}

export function AIRecommendationsCard({
  objective,
  totalBudget,
  platforms,
  targetingObjectives,
  onImplementRecommendations
}: AIRecommendationsCardProps) {
  const { toast } = useToast();

  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ['planning-recommendations', objective, totalBudget, platforms, targetingObjectives],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-planning-recommendations', {
          body: {
            objective,
            totalBudget,
            platforms,
            targetingObjectives
          }
        });

        if (error) throw error;
        return data.recommendations;
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        toast({
          title: "Error",
          description: "Failed to generate recommendations. Please try again.",
          variant: "destructive",
        });
        throw err;
      }
    },
    enabled: false,
  });

  const handleGetRecommendations = () => {
    refetch();
  };

  const handleImplement = () => {
    if (recommendations) {
      onImplementRecommendations(recommendations);
      toast({
        title: "Success",
        description: "Recommendations have been implemented into your plan.",
      });
    }
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
        <Button
          onClick={handleGetRecommendations}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Get AI Recommendations
        </Button>

        {recommendations && (
          <div className="space-y-4">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm">{recommendations}</div>
            </div>
            <Button onClick={handleImplement} className="w-full">
              Implement Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}