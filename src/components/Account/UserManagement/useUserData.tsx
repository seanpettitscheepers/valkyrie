import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/profile";

interface SubscriptionPlan {
  tier: string;
}

interface UserSubscription {
  user_id: string;
  status: string;
  subscription_plans: SubscriptionPlan;
}

export function useUserData(currentUser: Profile | null) {
  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      // First get all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Then get the current user's email
      const { data: { user } } = await supabase.auth.getUser();
      
      // Return profiles with email if available
      return profilesData?.map(profile => ({
        ...profile,
        email: profile.id === user?.id ? user?.email : null
      }));
    },
    enabled: currentUser?.role === "super_admin",
  });

  const { data: subscriptions } = useQuery<UserSubscription[]>({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select(`
          user_id,
          status,
          subscription_plans!inner (
            tier
          )
        `);

      if (error) throw error;
      
      return data?.map(sub => ({
        user_id: sub.user_id,
        status: sub.status,
        subscription_plans: {
          tier: sub.subscription_plans[0]?.tier || 'free'
        }
      })) as UserSubscription[];
    },
    enabled: currentUser?.role === "super_admin",
  });

  const users = profiles?.map(profile => {
    const userSubscription = subscriptions?.find(sub => sub.user_id === profile.id);
    return {
      ...profile,
      subscription: userSubscription?.subscription_plans?.tier || "free",
      status: userSubscription?.status || "active"
    };
  });

  return { users };
}