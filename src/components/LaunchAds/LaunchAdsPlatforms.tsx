import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  MessageCircle, 
  MonitorPlay, 
  BarChart3, 
  Store
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function LaunchAdsPlatforms() {
  const { data: connectedPlatforms } = useQuery({
    queryKey: ["connected-platforms"],
    queryFn: async () => {
      const [
        { data: facebook },
        { data: dv360 },
        { data: tiktok },
        { data: pinterest },
        { data: snapchat },
        { data: googleAds },
        { data: linkedin },
        { data: amazonDsp },
        { data: ttd }
      ] = await Promise.all([
        supabase.from("facebook_ad_accounts").select("id").limit(1),
        supabase.from("dv360_accounts").select("id").limit(1),
        supabase.from("tiktok_ad_accounts").select("id").limit(1),
        supabase.from("pinterest_ad_accounts").select("id").limit(1),
        supabase.from("snapchat_ad_accounts").select("id").limit(1),
        supabase.from("google_ads_accounts").select("id").limit(1),
        supabase.from("linkedin_ad_accounts").select("id").limit(1),
        supabase.from("amazon_dsp_accounts").select("id").limit(1),
        supabase.from("ttd_accounts").select("id").limit(1)
      ]);

      return {
        facebook: facebook && facebook.length > 0,
        dv360: dv360 && dv360.length > 0,
        tiktok: tiktok && tiktok.length > 0,
        pinterest: pinterest && pinterest.length > 0,
        snapchat: snapchat && snapchat.length > 0,
        googleAds: googleAds && googleAds.length > 0,
        linkedin: linkedin && linkedin.length > 0,
        amazonDsp: amazonDsp && amazonDsp.length > 0,
        ttd: ttd && ttd.length > 0
      };
    },
  });

  const platforms = [
    {
      name: "Facebook Ads",
      icon: Facebook,
      description: "Create ads for Facebook's advertising network",
      isConnected: connectedPlatforms?.facebook,
    },
    {
      name: "Instagram Ads",
      icon: Instagram,
      description: "Create ads for Instagram's advertising platform",
      isConnected: connectedPlatforms?.facebook, // Uses Facebook connection
    },
    {
      name: "LinkedIn Ads",
      icon: Linkedin,
      description: "Create ads for LinkedIn's advertising platform",
      isConnected: connectedPlatforms?.linkedin,
    },
    {
      name: "Pinterest Ads",
      icon: MessageCircle, // Using MessageCircle as Pinterest icon isn't available
      description: "Create ads for Pinterest's advertising platform",
      isConnected: connectedPlatforms?.pinterest,
    },
    {
      name: "Snapchat Ads",
      icon: MessageCircle, // Using MessageCircle as Snapchat icon isn't available
      description: "Create ads for Snapchat's advertising platform",
      isConnected: connectedPlatforms?.snapchat,
    },
    {
      name: "TikTok Ads",
      icon: MessageCircle,
      description: "Create ads for TikTok's advertising platform",
      isConnected: connectedPlatforms?.tiktok,
    },
    {
      name: "X Ads",
      icon: MessageCircle,
      description: "Create ads for X's (formerly Twitter) advertising platform",
      isConnected: false, // Not implemented yet
    },
    {
      name: "Display & Video 360",
      icon: MonitorPlay,
      description: "Create programmatic display and video ads",
      isConnected: connectedPlatforms?.dv360,
    },
    {
      name: "Google Ads",
      icon: BarChart3,
      description: "Create search and display ads on Google's network",
      isConnected: connectedPlatforms?.googleAds,
    },
    {
      name: "Amazon DSP",
      icon: Store,
      description: "Create programmatic ads through Amazon's DSP",
      isConnected: connectedPlatforms?.amazonDsp,
    },
    {
      name: "The Trade Desk",
      icon: MonitorPlay,
      description: "Create programmatic ads through The Trade Desk",
      isConnected: connectedPlatforms?.ttd,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => (
          <Card key={platform.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <platform.icon className="h-5 w-5" />
                {platform.name}
              </CardTitle>
              <CardDescription>
                {platform.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {platform.isConnected ? (
                <Button className="w-full">Select</Button>
              ) : (
                <Button variant="outline" className="w-full" asChild>
                  <a href="/connections">Connect Account</a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}