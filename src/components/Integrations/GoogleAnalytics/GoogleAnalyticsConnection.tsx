import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Link2, RefreshCw } from "lucide-react";
import { GoogleAnalyticsMetrics } from "./GoogleAnalyticsMetrics";

const REDIRECT_URI = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-analytics-auth-callback`;

export function GoogleAnalyticsConnection() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const { data: accounts, isLoading, error, refetch } = useQuery({
    queryKey: ["analytics-integrations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("analytics_integrations")
        .select("*")
        .eq("platform_type", "google_analytics_4")
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
        `&scope=https://www.googleapis.com/auth/analytics.readonly` +
        `&access_type=offline` +
        `&state=${state}`;

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error initiating Google Analytics connection:", error);
      toast({
        title: "Connection Error",
        description: "Failed to initiate Google Analytics connection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async (propertyId: string) => {
    try {
      setIsSyncing(propertyId);
      const { error } = await supabase.functions.invoke("sync-google-analytics", {
        body: { propertyId },
      });

      if (error) throw error;

      toast({
        title: "Sync Complete",
        description: "Successfully synced Google Analytics data.",
      });
      refetch();
    } catch (error) {
      console.error("Error syncing Google Analytics data:", error);
      toast({
        title: "Sync Error",
        description: "Failed to sync Google Analytics data. Please try again.",
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
        <CardTitle>Google Analytics 4</CardTitle>
        <CardDescription>
          Connect your Google Analytics 4 property to sync website performance data and audience insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading Google Analytics accounts: {error.message}
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
                      {account.property_id}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Link2 className="h-4 w-4" />
                      <span className={account.is_active ? "text-green-600" : "text-gray-500"}>
                        {account.is_active ? "Connected" : "Disconnected"}
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
                    onClick={() => handleSync(account.property_id)}
                    disabled={isSyncing === account.property_id}
                  >
                    {isSyncing === account.property_id ? (
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
                <GoogleAnalyticsMetrics propertyId={account.property_id} />
              </div>
            ))}
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? "Connecting..." : "Connect Google Analytics"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}