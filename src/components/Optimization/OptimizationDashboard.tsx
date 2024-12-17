import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, TrendingUp, Target, Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { OptimizationList } from "./OptimizationList";
import { OptimizationMetrics } from "./OptimizationMetrics";
import { OptimizationFilters } from "./OptimizationFilters";

export function OptimizationDashboard() {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["optimization-recommendations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("optimization_recommendations")
        .select(`
          *,
          campaigns (
            name,
            type,
            platform_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Campaign Optimization</h1>
        <p className="text-muted-foreground">
          AI-powered recommendations to improve your campaign performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Optimizations</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recommendations?.filter(r => r.status === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Implemented Changes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recommendations?.filter(r => r.status === 'implemented').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Improvement</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15.4%</div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Optimization Available</AlertTitle>
        <AlertDescription>
          We've analyzed your campaigns and found new opportunities for improvement.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Recommendations</TabsTrigger>
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="creative">Creative</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <OptimizationFilters />
          <OptimizationMetrics recommendations={recommendations} />
          <OptimizationList recommendations={recommendations} />
        </TabsContent>
        <TabsContent value="targeting">
          <OptimizationList 
            recommendations={recommendations?.filter(r => r.type === 'targeting')} 
          />
        </TabsContent>
        <TabsContent value="budget">
          <OptimizationList 
            recommendations={recommendations?.filter(r => r.type === 'budget')} 
          />
        </TabsContent>
        <TabsContent value="creative">
          <OptimizationList 
            recommendations={recommendations?.filter(r => r.type === 'creative')} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}