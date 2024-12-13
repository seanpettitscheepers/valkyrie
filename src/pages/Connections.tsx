import { PageLayout } from "@/components/Layout/PageLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UnconnectedState } from "@/components/Connections/UnconnectedState";
import { FacebookAdsIntegration } from "@/components/Integrations/FacebookAdsIntegration";
import { FacebookPagesIntegration } from "@/components/Integrations/Facebook/FacebookPagesIntegration";
import { DV360Integration } from "@/components/Integrations/DV360/DV360Integration";
import { TikTokAdsIntegration } from "@/components/Integrations/TikTok/TikTokAdsIntegration";
import { PinterestAdsIntegration } from "@/components/Integrations/Pinterest/PinterestAdsIntegration";
import { SnapchatAdsIntegration } from "@/components/Integrations/Snapchat/SnapchatAdsIntegration";

export default function Connections() {
  const { data: connectedPlatforms } = useQuery({
    queryKey: ["connected-platforms"],
    queryFn: async () => {
      const [
        { data: facebook },
        { data: dv360 },
        { data: tiktok },
        { data: pinterest },
        { data: snapchat }
      ] = await Promise.all([
        supabase.from("facebook_ad_accounts").select("id").limit(1),
        supabase.from("dv360_accounts").select("id").limit(1),
        supabase.from("tiktok_ad_accounts").select("id").limit(1),
        supabase.from("pinterest_ad_accounts").select("id").limit(1),
        supabase.from("snapchat_ad_accounts").select("id").limit(1)
      ]);

      return {
        facebook: facebook && facebook.length > 0,
        dv360: dv360 && dv360.length > 0,
        tiktok: tiktok && tiktok.length > 0,
        pinterest: pinterest && pinterest.length > 0,
        snapchat: snapchat && snapchat.length > 0
      };
    },
  });

  return (
    <PageLayout title="Platform Connections">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1">
          {connectedPlatforms?.facebook ? (
            <FacebookAdsIntegration />
          ) : (
            <UnconnectedState
              title="Facebook Ads"
              description="Connect your Facebook Ads account to sync campaign data and performance metrics"
              onConnect={() => window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${import.meta.env.VITE_FACEBOOK_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_FACEBOOK_REDIRECT_URI)}&scope=ads_management`}
            />
          )}
        </div>
        
        <div className="col-span-1">
          {connectedPlatforms?.dv360 ? (
            <DV360Integration />
          ) : (
            <UnconnectedState
              title="Display & Video 360"
              description="Connect your DV360 account to sync campaign data and performance metrics"
              onConnect={() => window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_DV360_REDIRECT_URI)}&scope=https://www.googleapis.com/auth/display-video&response_type=code`}
            />
          )}
        </div>

        <div className="col-span-1">
          {connectedPlatforms?.tiktok ? (
            <TikTokAdsIntegration />
          ) : (
            <UnconnectedState
              title="TikTok Ads"
              description="Connect your TikTok Ads account to sync campaign data and performance metrics"
              onConnect={() => window.location.href = `https://business-api.tiktok.com/open_api/v1.2/oauth2/authorize?app_id=${import.meta.env.VITE_TIKTOK_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_TIKTOK_REDIRECT_URI)}&scope=ads.read,ads.manage`}
            />
          )}
        </div>

        <div className="col-span-1">
          {connectedPlatforms?.pinterest ? (
            <PinterestAdsIntegration />
          ) : (
            <UnconnectedState
              title="Pinterest Ads"
              description="Connect your Pinterest Ads account to sync campaign data and performance metrics"
              onConnect={() => window.location.href = `https://www.pinterest.com/oauth/?client_id=${import.meta.env.VITE_PINTEREST_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_PINTEREST_REDIRECT_URI)}&scope=ads:read,ads:write`}
            />
          )}
        </div>

        <div className="col-span-1">
          {connectedPlatforms?.snapchat ? (
            <SnapchatAdsIntegration />
          ) : (
            <UnconnectedState
              title="Snapchat Ads"
              description="Connect your Snapchat Ads account to sync campaign data and performance metrics"
              onConnect={() => window.location.href = `https://accounts.snapchat.com/login/oauth2/authorize?client_id=${import.meta.env.VITE_SNAPCHAT_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_SNAPCHAT_REDIRECT_URI)}&response_type=code&scope=snapchat-marketing-api`}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}