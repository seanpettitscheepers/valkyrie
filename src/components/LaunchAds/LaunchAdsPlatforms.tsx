import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function LaunchAdsPlatforms() {
  const { data: connectedPlatforms } = useQuery({
    queryKey: ["connected-platforms"],
    queryFn: async () => {
      const { data: facebook } = await supabase
        .from("facebook_ad_accounts")
        .select("id")
        .limit(1);

      const { data: snapchat } = await supabase
        .from("snapchat_ad_accounts")
        .select("id")
        .limit(1);

      const { data: pinterest } = await supabase
        .from("pinterest_ad_accounts")
        .select("id")
        .limit(1);

      return {
        facebook: facebook && facebook.length > 0,
        snapchat: snapchat && snapchat.length > 0,
        pinterest: pinterest && pinterest.length > 0,
      };
    },
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Facebook className="h-5 w-5" />
              Facebook Ads
            </CardTitle>
            <CardDescription>
              Create ads for Facebook's advertising network
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectedPlatforms?.facebook ? (
              <Button className="w-full">Select</Button>
            ) : (
              <Button variant="outline" className="w-full" asChild>
                <a href="/connections">Connect Account</a>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5" />
              Instagram Ads
            </CardTitle>
            <CardDescription>
              Create ads for Instagram's advertising platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectedPlatforms?.facebook ? (
              <Button className="w-full">Select</Button>
            ) : (
              <Button variant="outline" className="w-full" asChild>
                <a href="/connections">Connect Account</a>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Twitter className="h-5 w-5" />
              Pinterest Ads
            </CardTitle>
            <CardDescription>
              Create ads for Pinterest's advertising platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectedPlatforms?.pinterest ? (
              <Button className="w-full">Select</Button>
            ) : (
              <Button variant="outline" className="w-full" asChild>
                <a href="/connections">Connect Account</a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}