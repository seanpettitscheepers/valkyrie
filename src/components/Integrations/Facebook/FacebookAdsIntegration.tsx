import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Facebook } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AccountHeader } from "./AccountHeader";
import { CampaignMetrics } from "./CampaignMetrics";

const FACEBOOK_CLIENT_ID = "your_facebook_client_id";
const REDIRECT_URI = "https://qothiaalyhdfuesmvcvu.functions.supabase.co/facebook-auth-callback";

export function FacebookAdsIntegration() {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { data: accounts, isLoading: accountsLoading, refetch: refetchAccounts } = useQuery({
    queryKey: ["facebook-accounts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("facebook_ad_accounts")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: campaigns, isLoading: campaignsLoading, refetch: refetchCampaigns } = useQuery({
    queryKey: ["facebook-campaigns", accounts],
    queryFn: async () => {
      if (!accounts?.length) return [];

      const accountIds = accounts.map(a => a.id);
      const { data, error } = await supabase
        .from("facebook_campaigns")
        .select("*")
        .in("account_id", accountIds)
        .order("last_sync_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!accounts?.length,
  });

  const syncMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const account = accounts?.find(a => a.id === accountId);
      if (!account) throw new Error("Account not found");

      const { error } = await supabase.functions.invoke("sync-facebook-campaigns", {
        body: {
          account_id: account.account_id,
          access_token: account.access_token,
        },
      });

      if (error) throw error;
      await refetchCampaigns();
    },
    onSuccess: () => {
      toast({
        title: "Sync Successful",
        description: "Campaign data has been synchronized successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleConnect = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const state = btoa(JSON.stringify({
        userId: user.id,
        redirectUrl: window.location.origin + "/connections"
      }));

      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${FACEBOOK_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&state=${state}` +
        `&scope=ads_management,ads_read`;

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error initiating Facebook connection:", error);
      setError("Failed to initiate Facebook connection. Please try again.");
    }
  };

  if (accountsLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Facebook className="h-5 w-5" />
          Facebook Ads
        </CardTitle>
        <CardDescription>
          Connect your Facebook Ads accounts to sync campaign data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {accounts?.length > 0 ? (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="space-y-4">
                <AccountHeader
                  account={account}
                  onSync={() => syncMutation.mutate(account.id)}
                  isSyncing={syncMutation.isPending}
                />
                {campaigns?.filter(c => c.account_id === account.id).map((campaign) => (
                  <CampaignMetrics key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <Button onClick={handleConnect} className="w-full">
            <Facebook className="mr-2 h-4 w-4" />
            Connect Facebook Ads
          </Button>
        )}
      </CardContent>
    </Card>
  );
}