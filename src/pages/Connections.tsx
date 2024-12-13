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
import { GoogleAdsConnection } from "@/components/Integrations/GoogleAds/GoogleAdsConnection";
import { LinkedInAdsIntegration } from "@/components/Integrations/LinkedIn/LinkedInAdsIntegration";
import { GoogleAnalyticsConnection } from "@/components/Integrations/GoogleAnalytics/GoogleAnalyticsConnection";
import { AmazonDSPIntegration } from "@/components/Integrations/AmazonDSP/AmazonDSPIntegration";

export default function Connections() {
  const { data: connectedPlatforms } = useQuery({
    queryKey: ["connected-platforms"],
    queryFn: async () => {
      const [
        { data: facebook },
        { data: facebookPages },
        { data: dv360 },
        { data: tiktok },
        { data: pinterest },
        { data: snapchat },
        { data: googleAds },
        { data: linkedin },
        { data: analytics },
        { data: amazonDsp }
      ] = await Promise.all([
        supabase.from("facebook_ad_accounts").select("id").limit(1),
        supabase.from("facebook_pages").select("id").limit(1),
        supabase.from("dv360_accounts").select("id").limit(1),
        supabase.from("tiktok_ad_accounts").select("id").limit(1),
        supabase.from("pinterest_ad_accounts").select("id").limit(1),
        supabase.from("snapchat_ad_accounts").select("id").limit(1),
        supabase.from("google_ads_accounts").select("id").limit(1),
        supabase.from("linkedin_ad_accounts").select("id").limit(1),
        supabase.from("analytics_integrations")
          .select("id")
          .eq("platform_type", "google_analytics_4")
          .limit(1),
        supabase.from("amazon_dsp_accounts").select("id").limit(1)
      ]);

      return {
        facebook: facebook && facebook.length > 0,
        facebookPages: facebookPages && facebookPages.length > 0,
        dv360: dv360 && dv360.length > 0,
        tiktok: tiktok && tiktok.length > 0,
        pinterest: pinterest && pinterest.length > 0,
        snapchat: snapchat && snapchat.length > 0,
        googleAds: googleAds && googleAds.length > 0,
        linkedin: linkedin && linkedin.length > 0,
        analytics: analytics && analytics.length > 0,
        amazonDsp: amazonDsp && amazonDsp.length > 0
      };
    },
  });

  return (
    <PageLayout title="Platform Connections">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="h-full">
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

        <div className="h-full">
          {connectedPlatforms?.facebookPages ? (
            <FacebookPagesIntegration />
          ) : (
            <UnconnectedState
              title="Facebook Pages"
              description="Connect your Facebook Pages to manage posts and view insights"
              onConnect={() => window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${import.meta.env.VITE_FACEBOOK_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_FACEBOOK_PAGES_REDIRECT_URI)}&scope=pages_show_list,pages_read_engagement,pages_manage_posts`}
            />
          )}
        </div>

        <div className="h-full">
          {connectedPlatforms?.googleAds ? (
            <GoogleAdsConnection />
          ) : (
            <UnconnectedState
              title="Google Ads"
              description="Connect your Google Ads account to sync campaign data and performance metrics"
              onConnect={() => window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_GOOGLE_ADS_REDIRECT_URI)}&scope=https://www.googleapis.com/auth/adwords&response_type=code`}
            />
          )}
        </div>

        <div className="h-full">
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

        <div className="h-full">
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

        <div className="h-full">
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

        <div className="h-full">
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

        <div className="h-full">
          {connectedPlatforms?.linkedin ? (
            <LinkedInAdsIntegration />
          ) : (
            <UnconnectedState
              title="LinkedIn Ads"
              description="Connect your LinkedIn Ads account to sync campaign data and performance metrics"
              onConnect={() => window.location.href = `https://www.linkedin.com/oauth/v2/authorization?client_id=${import.meta.env.VITE_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_LINKEDIN_REDIRECT_URI)}&scope=r_liteprofile%20r_ads%20rw_ads&response_type=code`}
            />
          )}
        </div>

        <div className="h-full">
          {connectedPlatforms?.analytics ? (
            <GoogleAnalyticsConnection />
          ) : (
            <UnconnectedState
              title="Google Analytics"
              description="Connect your Google Analytics 4 property to sync website performance data and audience insights"
              onConnect={() => window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(import.meta.env.VITE_GA4_REDIRECT_URI)}&scope=https://www.googleapis.com/auth/analytics.readonly&response_type=code&access_type=offline`}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
