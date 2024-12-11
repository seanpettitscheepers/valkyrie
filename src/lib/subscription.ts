import { supabase } from "@/integrations/supabase/client";

export type FeatureLimit = {
  platform_limit: number;
  ai_recommendations_limit: number;
  planning_limit: number;
};

export const DEFAULT_LIMITS: FeatureLimit = {
  platform_limit: 1,
  ai_recommendations_limit: 5,
  planning_limit: 2,
};

export async function getSubscriptionLimits(): Promise<FeatureLimit> {
  try {
    // Get user's subscription
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user found");

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    if (!profile?.subscription_tier) return DEFAULT_LIMITS;

    // Get limits for the user's subscription tier
    const { data: plan } = await supabase
      .from("subscription_plans")
      .select("platform_limit, ai_recommendations_limit, planning_limit")
      .eq("tier", profile.subscription_tier)
      .single();

    return plan || DEFAULT_LIMITS;
  } catch (error) {
    console.error("Error getting subscription limits:", error);
    return DEFAULT_LIMITS;
  }
}

export async function checkFeatureAccess(feature: keyof FeatureLimit): Promise<boolean> {
  const limits = await getSubscriptionLimits();
  return limits[feature] > 0;
}