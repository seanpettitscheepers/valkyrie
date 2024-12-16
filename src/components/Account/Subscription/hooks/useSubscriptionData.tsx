import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useSubscriptionData() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for Stripe session status
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get('session_id');
    
    if (sessionId) {
      toast({
        title: "Subscription updated",
        description: "Your subscription has been successfully updated.",
      });
      // Clear the URL parameters
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [toast]);

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
        .neq('tier', 'freyja')
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
        navigate("/contact");
        return;
      }

      // For free plan
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

      // For paid plans
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

  const handleManageSubscription = async () => {
    try {
      if (!subscription?.cancel_at_period_end) {
        // Cancel subscription at period end
        const { error } = await supabase
          .from("user_subscriptions")
          .update({ cancel_at_period_end: true })
          .eq("id", subscription?.id);

        if (error) throw error;
        
        toast({
          title: "Subscription cancelled",
          description: "Your subscription will be cancelled at the end of the billing period.",
        });
      } else {
        // Resume subscription
        const { error } = await supabase
          .from("user_subscriptions")
          .update({ cancel_at_period_end: false })
          .eq("id", subscription?.id);

        if (error) throw error;
        
        toast({
          title: "Subscription resumed",
          description: "Your subscription has been resumed.",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
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

  const currentPlan = plans?.find(p => p.tier === profile?.subscription_tier);
  const nextTier = getNextTier(profile?.subscription_tier || 'free');
  const upgradeFeatures = getUpgradeFeatures(nextTier);
  const nextPlan = plans?.find(p => p.tier === nextTier);

  return {
    profile,
    subscription,
    plans,
    currentPlan,
    nextTier,
    nextPlan,
    upgradeFeatures,
    isLoading: profileLoading || subscriptionLoading || plansLoading,
    handleSubscribe,
    handleManageSubscription
  };
}