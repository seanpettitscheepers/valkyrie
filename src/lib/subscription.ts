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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user found");

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    if (!profile?.subscription_tier) return DEFAULT_LIMITS;

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

export async function getCurrentUsage(userId: string): Promise<Partial<FeatureLimit>> {
  const { data: platformCount } = await supabase
    .from('platform_integrations')
    .select('id', { count: 'exact' })
    .eq('is_active', true);

  const { data: aiRecommendationsCount } = await supabase
    .from('campaign_plans')
    .select('id', { count: 'exact' })
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  return {
    platform_limit: platformCount?.length || 0,
    ai_recommendations_limit: aiRecommendationsCount?.length || 0,
    planning_limit: 0, // This would need to be implemented based on your planning feature
  };
}