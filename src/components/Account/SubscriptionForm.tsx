import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function SubscriptionForm() {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("user_subscriptions")
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq("user_id", user.id)
        .maybeSingle(); // Changed from single() to maybeSingle()

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("price");

      if (error) throw error;
      return data;
    },
  });

  if (profileLoading || subscriptionLoading || plansLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getTrialStatus = () => {
    if (!profile?.trial_ends_at) return null;
    const trialEnd = new Date(profile.trial_ends_at);
    const now = new Date();
    if (trialEnd > now) {
      return `Trial ends on ${formatDate(trialEnd)}`;
    }
    return "Trial ended";
  };

  const getBadgeColor = (tier: string) => {
    switch (tier) {
      case "free":
        return "bg-gray-100 text-gray-800";
      case "starter":
        return "bg-blue-100 text-blue-800";
      case "growth":
        return "bg-purple-100 text-purple-800";
      case "enterprise":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>
          Manage your subscription and billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Current Plan</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getBadgeColor(profile?.subscription_tier || "free")}>
                {profile?.subscription_tier?.toUpperCase() || "FREE"}
              </Badge>
              {getTrialStatus() && (
                <Badge variant="outline">{getTrialStatus()}</Badge>
              )}
            </div>
          </div>
          {subscription && (
            <Button variant="outline">
              {subscription.cancel_at_period_end ? "Resume Subscription" : "Cancel Subscription"}
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans?.map((plan) => (
            <Card key={plan.id} className="relative">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  ${plan.price}/month
                  {plan.annual_price && (
                    <span className="block text-sm text-muted-foreground">
                      or ${plan.annual_price}/year
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {(plan.features as string[]).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-4" variant={plan.tier === profile?.subscription_tier ? "outline" : "default"}>
                  {plan.tier === profile?.subscription_tier ? "Current Plan" : "Upgrade"}
                </Button>
              </CardContent>
              {plan.tier === profile?.subscription_tier && (
                <div className="absolute -top-2 -right-2">
                  <Badge>Current</Badge>
                </div>
              )}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}