import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function SubscriptionLimits() {
  const { data: limits, isLoading } = useQuery({
    queryKey: ["subscription-limits"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single();

      if (!profile?.subscription_tier) return null;

      const { data: plan } = await supabase
        .from("subscription_plans")
        .select("platform_limit, ai_recommendations_limit, planning_limit")
        .eq("tier", profile.subscription_tier)
        .single();

      return plan;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!limits) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Limits</CardTitle>
        <CardDescription>
          Track your current usage and limits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Platform Connections</span>
            <span className="text-muted-foreground">
              {limits.platform_limit === null ? "Unlimited" : `0/${limits.platform_limit}`}
            </span>
          </div>
          {limits.platform_limit && (
            <Progress value={0} max={limits.platform_limit} />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>AI Recommendations</span>
            <span className="text-muted-foreground">
              {limits.ai_recommendations_limit === null ? "Unlimited" : `0/${limits.ai_recommendations_limit}`}
            </span>
          </div>
          {limits.ai_recommendations_limit && (
            <Progress value={0} max={limits.ai_recommendations_limit} />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Campaign Planning</span>
            <span className="text-muted-foreground">
              {limits.planning_limit === null ? "Unlimited" : `0/${limits.planning_limit}`}
            </span>
          </div>
          {limits.planning_limit && (
            <Progress value={0} max={limits.planning_limit} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}