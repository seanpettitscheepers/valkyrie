import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TTDCampaigns } from "./TTDCampaigns";

const TTD_CLIENT_ID = import.meta.env.VITE_TTD_CLIENT_ID;
const TTD_REDIRECT_URI = import.meta.env.VITE_TTD_REDIRECT_URI;

export function TTDIntegration() {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { data: accounts, isLoading: accountsLoading, refetch: refetchAccounts } = useQuery({
    queryKey: ["ttd-accounts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("ttd_accounts")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data || [];
    },
  });

  const syncMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const { error } = await supabase.functions.invoke("sync-ttd-campaigns", {
        body: { accountId },
      });

      if (error) throw error;
      await refetchAccounts();
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

      const authUrl = `https://api.thetradedesk.com/v3/authentication/oauth/authorize?` +
        `client_id=${TTD_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(TTD_REDIRECT_URI)}` +
        `&response_type=code` +
        `&scope=campaign_read campaign_write audience_read` +
        `&state=${state}`;

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error initiating TTD connection:", error);
      setError("Failed to initiate TTD connection. Please try again.");
    }
  };

  if (accountsLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>The Trade Desk</CardTitle>
        <CardDescription>
          Connect your TTD account to sync campaign data and performance metrics
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
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{account.account_name}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {account.account_id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary"
                      className={account.status === "active" ? "bg-green-100 text-green-800" : ""}
                    >
                      {account.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => syncMutation.mutate(account.id)}
                      disabled={syncMutation.isPending}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                      Sync
                    </Button>
                  </div>
                </div>

                <TTDCampaigns accountId={account.id} />
              </div>
            ))}
          </div>
        ) : (
          <Button onClick={handleConnect} className="w-full">
            Connect TTD Account
          </Button>
        )}
      </CardContent>
    </Card>
  );
}