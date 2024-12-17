import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ArrowRight, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface OptimizationListProps {
  recommendations: any[];
}

export function OptimizationList({ recommendations }: OptimizationListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const { error } = await supabase
        .from('optimization_recommendations')
        .update({ 
          status: action === 'approve' ? 'approved' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: `Recommendation ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `The optimization has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
      });

      queryClient.invalidateQueries({ queryKey: ["optimization-recommendations"] });
    } catch (error) {
      console.error('Error updating recommendation:', error);
      toast({
        title: "Error",
        description: "Failed to update recommendation. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!recommendations?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-[200px] text-center">
          <p className="text-muted-foreground">No recommendations found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation) => (
        <Card key={recommendation.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-base">
                {recommendation.campaigns?.name || 'Campaign Name'}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={recommendation.type === 'targeting' ? 'default' : 
                             recommendation.type === 'budget' ? 'secondary' : 'outline'}>
                  {recommendation.type}
                </Badge>
                <Badge variant={recommendation.status === 'pending' ? 'outline' : 
                             recommendation.status === 'approved' ? 'default' : 'secondary'}>
                  {recommendation.status}
                </Badge>
              </div>
            </div>
            {recommendation.status === 'pending' && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(recommendation.id, 'reject')}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAction(recommendation.id, 'approve')}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p>{recommendation.recommendation}</p>
              <p className="text-sm text-muted-foreground">{recommendation.rationale}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Estimated Impact:</span>
                <span className="font-medium text-green-500">
                  +{recommendation.estimated_impact.percentage || '10'}%
                </span>
              </div>
              <Button variant="ghost" size="sm">
                View Details
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}