import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ConnectedPlatform {
  value: string;
  label: string;
}

export function useConnectedPlatforms() {
  return useQuery({
    queryKey: ["connected-platforms"],
    queryFn: async () => {
      const [
        { data: facebook },
        { data: dv360 },
        { data: tiktok },
        { data: pinterest },
        { data: snapchat },
        { data: googleAds },
        { data: linkedin }
      ] = await Promise.all([
        supabase.from("facebook_ad_accounts").select("id").limit(1),
        supabase.from("dv360_accounts").select("id").limit(1),
        supabase.from("tiktok_ad_accounts").select("id").limit(1),
        supabase.from("pinterest_ad_accounts").select("id").limit(1),
        supabase.from("snapchat_ad_accounts").select("id").limit(1),
        supabase.from("google_ads_accounts").select("id").limit(1),
        supabase.from("linkedin_ad_accounts").select("id").limit(1)
      ]);

      const platforms: ConnectedPlatform[] = [];
      if (facebook?.length) platforms.push({ value: "facebook", label: "Facebook" });
      if (dv360?.length) platforms.push({ value: "dv360", label: "Display & Video 360" });
      if (tiktok?.length) platforms.push({ value: "tiktok", label: "TikTok" });
      if (pinterest?.length) platforms.push({ value: "pinterest", label: "Pinterest" });
      if (snapchat?.length) platforms.push({ value: "snapchat", label: "Snapchat" });
      if (googleAds?.length) platforms.push({ value: "google_ads", label: "Google Ads" });
      if (linkedin?.length) platforms.push({ value: "linkedin", label: "LinkedIn" });

      return platforms;
    },
  });
}