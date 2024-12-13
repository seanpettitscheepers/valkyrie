import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Link2, RefreshCw } from "lucide-react";
import { LinkedInCampaigns } from "./LinkedInCampaigns";

const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
const REDIRECT_URI = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/linkedin-auth-callback`;

export function LinkedInAdsIntegration() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const { data: accounts, isLoading, error, refetch } = useQuery({
    queryKey: ["linkedin-accounts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("linkedin_ad_accounts")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const state = btoa(JSON.stringify({
        userId: user.id,
        redirectUrl: window.location.origin + "/connections"
      }));

      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code` +
        `&client_id=${LINKEDIN_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=r_liteprofile%20r_ads%20rw_ads` +
        `&state=${state}`;

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error initiating LinkedIn connection:", error);
      toast({
        title: "Connection Error",
        description: "Failed to initiate LinkedIn connection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async (accountId: string) => {
    try {
      setIsSyncing(accountId);
      const { error } = await supabase.functions.invoke("sync-linkedin-campaigns", {
        body: { accountId },
      });

      if (error) throw error;

      toast({
        title: "Sync Complete",
        description: "Successfully synced LinkedIn campaigns.",
      });
      refetch();
    } catch (error) {
      console.error("Error syncing LinkedIn campaigns:", error);
      toast({
        title: "Sync Error",
        description: "Failed to sync LinkedIn campaigns. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>LinkedIn Ads</CardTitle>
        <CardDescription>
          Connect your LinkedIn Ads account to sync campaign data and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading LinkedIn accounts: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {accounts?.length ? (
          <div className="space-y-6">
            {accounts.map((account) => (
              <div key={account.id} className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {account.account_name || account.account_id}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Link2 className="h-4 w-4" />
                      <span className={account.status === "active" ? "text-green-600" : "text-gray-500"}>
                        {account.status === "active" ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                    {account.last_sync_at && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Last synced: {new Date(account.last_sync_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(account.id)}
                    disabled={isSyncing === account.id}
                  >
                    {isSyncing === account.id ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync Now
                      </>
                    )}
                  </Button>
                </div>
                <LinkedInCampaigns accountId={account.id} />
              </div>
            ))}
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? "Connecting..." : "Connect LinkedIn Ads"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}