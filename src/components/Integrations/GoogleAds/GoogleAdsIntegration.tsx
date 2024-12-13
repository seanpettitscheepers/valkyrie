import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Link2 } from "lucide-react";

const GOOGLE_CLIENT_ID = "your-google-client-id";
const REDIRECT_URI = `${process.env.SUPABASE_URL}/functions/v1/google-ads-auth-callback`;

export function GoogleAdsIntegration() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

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
        `client_id=${GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&response_type=code` +
        `&scope=https://www.googleapis.com/auth/adwords` +
        `&access_type=offline` +
        `&state=${state}`;

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error initiating Google Ads connection:", error);
      toast({
        title: "Connection Error",
        description: "Failed to initiate Google Ads connection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
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
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
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
                </div>
                {account.last_sync_at && (
                  <p className="text-sm text-muted-foreground">
                    Last synced: {new Date(account.last_sync_at).toLocaleString()}
                  </p>
                )}
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