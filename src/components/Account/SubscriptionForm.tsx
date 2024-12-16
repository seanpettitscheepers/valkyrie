import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowUpCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { SubscriptionBadge } from "./SubscriptionBadge";
import { SubscriptionPlanCard } from "./SubscriptionPlanCard";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function SubscriptionForm() {
  const { toast } = useToast();

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
        .maybeSingle();

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

  const handleSubscribe = async (plan: any) => {
    try {
      if (!plan.price_id && plan.price_id !== null) {
        toast({
          title: "Error",
          description: "Invalid price ID. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      // For enterprise plan, redirect to contact
      if (plan.price_id === null) {
        window.location.href = "/contact";
        return;
      }

      // For free plan, just update the profile
      if (plan.tier === "free") {
        const { error } = await supabase
          .from("profiles")
          .update({ subscription_tier: "free" })
          .eq("id", profile?.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "You've been subscribed to the free plan.",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId: plan.price_id },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getNextTier = (currentTier: string) => {
    const tiers = ['free', 'growth', 'pro', 'enterprise'];
    const currentIndex = tiers.indexOf(currentTier);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const getUpgradeFeatures = (nextTier: string | null) => {
    if (!nextTier || !plans) return [];
    const nextPlan = plans.find(p => p.tier === nextTier);
    return nextPlan?.features || [];
  };

  if (profileLoading || subscriptionLoading || plansLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const currentPlan = plans?.find(p => p.tier === profile?.subscription_tier);
  const nextTier = getNextTier(profile?.subscription_tier || 'free');
  const upgradeFeatures = getUpgradeFeatures(nextTier);
  const nextPlan = plans?.find(p => p.tier === nextTier);

  const getTrialStatus = () => {
    if (!profile?.trial_ends_at) return null;
    const trialEnd = new Date(profile.trial_ends_at);
    const now = new Date();
    if (trialEnd > now) {
      return `Trial ends on ${formatDate(trialEnd)}`;
    }
    return "Trial ended";
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
              <SubscriptionBadge tier={profile?.subscription_tier} />
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

        {/* Current Plan Features */}
        <div className="space-y-4">
          <h4 className="font-medium">What's included in your plan:</h4>
          <ul className="space-y-2">
            {currentPlan?.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-primary">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {nextTier && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Upgrade to {nextPlan?.name} to get:</h4>
              </div>
              <ul className="space-y-2">
                {upgradeFeatures.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-primary">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                onClick={() => nextPlan && handleSubscribe(nextPlan)}
              >
                Upgrade to {nextPlan?.name}
              </Button>
            </div>
          </>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans?.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              profile={profile}
              isCurrentPlan={plan.tier === profile?.subscription_tier}
              onSubscribe={() => handleSubscribe(plan)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}