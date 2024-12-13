import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Link2, RefreshCw } from "lucide-react";
import { GoogleAdsCampaigns } from "./GoogleAdsCampaigns";

const REDIRECT_URI = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-ads-auth-callback`;

export function GoogleAdsConnection() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const { data: accounts, isLoading, error, refetch } = useQuery({
    queryKey: ["google-ads-accounts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("google_ads_accounts")
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

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&response_type=code` +
        `&scope=https://www.googleapis.com/auth/adwords` +
        `&access_type=offline` +
        `&state=${state}`;

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error initiating Google Ads connection:", error);
    } finally {
      setIsConnecting(false);
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
        <CardTitle>Google Ads</CardTitle>
        <CardDescription>
          Connect your Google Ads accounts to sync campaign data and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading Google Ads accounts: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {accounts?.length ? (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {account.account_name || account.customer_id}
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
                    onClick={() => setIsSyncing(account.id)}
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
                <GoogleAdsCampaigns accountId={account.id} />
              </div>
            ))}
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? "Connecting..." : "Connect Google Ads"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}