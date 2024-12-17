import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Recommendation {
  type: "demographic" | "behavioral" | "interest";
  recommendation: string;
  reasoning: string;
  potentialImpact: "high" | "medium" | "low";
}

interface AIRecommendationsCardProps {
  audienceData: any;
}

export function AIRecommendationsCard({ audienceData }: AIRecommendationsCardProps) {
  const { toast } = useToast();

  const { data: recommendations, isLoading, error } = useQuery({
    queryKey: ['targeting-recommendations', audienceData],
    queryFn: async () => {
      try {
        console.log('Calling edge function with data:', audienceData);
        const { data, error } = await supabase.functions.invoke('generate-targeting-recommendations', {
          body: { audienceData },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (error) {
          console.error('Error calling edge function:', error);
          toast({
            title: "Error",
            description: "Failed to generate recommendations. Please try again.",
            variant: "destructive",
          });
          throw error;
        }

        console.log('Edge function response:', data);
        return data.recommendations as Recommendation[];
      } catch (err) {
        console.error('Error in query function:', err);
        toast({
          title: "Error",
          description: "Failed to generate recommendations. Please try again.",
          variant: "destructive",
        });
        throw err;
      }
    },
    enabled: !!audienceData,
    retry: 1,
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "demographic":
        return "bg-blue-100 text-blue-800";
      case "behavioral":
        return "bg-purple-100 text-purple-800";
      case "interest":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Targeting Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Failed to generate recommendations. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Targeting Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {recommendations?.map((rec, index) => (
              <div key={index} className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge className={cn(getTypeColor(rec.type))}>
                    {rec.type}
                  </Badge>
                  <Badge className={cn(getImpactColor(rec.potentialImpact))}>
                    {rec.potentialImpact} impact
                  </Badge>
                </div>
                <p className="font-medium">{rec.recommendation}</p>
                <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}