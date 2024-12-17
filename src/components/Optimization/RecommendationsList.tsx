import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, ArrowRight, TrendingUp, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface Recommendation {
  id: string;
  campaign_id: string;
  type: string;
  recommendation: string;
  rationale: string;
  estimated_impact: any;
  status: string;
  performance_before: any;
  performance_after: any;
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleImplement = async (recommendation: Recommendation) => {
    try {
      const { error } = await supabase.functions.invoke("implement-optimization", {
        body: { recommendationId: recommendation.id },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Optimization has been implemented successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["optimization-recommendations"] });
    } catch (error) {
      console.error("Error implementing optimization:", error);
      toast({
        title: "Error",
        description: "Failed to implement optimization. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "targeting":
        return "bg-blue-100 text-blue-800";
      case "budget":
        return "bg-green-100 text-green-800";
      case "creative":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recommendations</h2>
      {recommendations.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">No recommendations available.</p>
          </CardContent>
        </Card>
      ) : (
        recommendations.map((rec) => (
          <Card key={rec.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(rec.type)}>{rec.type}</Badge>
                      {rec.status === "implemented" && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Implemented
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium">{rec.recommendation}</p>
                    <p className="text-sm text-muted-foreground">{rec.rationale}</p>
                  </div>
                  {rec.status !== "implemented" && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          toast({
                            title: "Recommendation Dismissed",
                            description: "The recommendation has been removed from your list.",
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleImplement(rec)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Implement
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium mb-2">Current Performance</p>
                    <div className="space-y-1">
                      {Object.entries(rec.performance_before || {}).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Estimated Impact</p>
                    <div className="space-y-1">
                      {Object.entries(rec.estimated_impact || {}).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-green-600">+{value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}