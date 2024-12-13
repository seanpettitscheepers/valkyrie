import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings2, Link2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AmazonDSPCampaigns } from "./AmazonDSPCampaigns";

export function AmazonDSPIntegration() {
  const { data: account, isLoading } = useQuery({
    queryKey: ["amazon-dsp-account"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("amazon_dsp_accounts")
        .select("*")
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Amazon DSP</CardTitle>
          <CardDescription>
            Connect your Amazon DSP account to sync campaign data and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              window.location.href = `https://api.amazon.com/auth/o2/authorize?client_id=${
                import.meta.env.VITE_AMAZON_CLIENT_ID
              }&response_type=code&redirect_uri=${encodeURIComponent(
                import.meta.env.VITE_AMAZON_REDIRECT_URI
              )}&scope=advertising::campaign_management advertising::reporting`;
            }}
            className="w-full"
          >
            Connect Amazon DSP
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Amazon DSP</CardTitle>
            <CardDescription>{account.account_name}</CardDescription>
          </div>
          <Badge variant={account.status === "active" ? "default" : "destructive"}>
            {account.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {account.error_message && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{account.error_message}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            <span>Account ID: {account.account_id}</span>
          </div>
          <Button variant="ghost" size="sm">
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>

        {account.last_sync_at && (
          <p className="text-sm text-muted-foreground">
            Last synced: {new Date(account.last_sync_at).toLocaleString()}
          </p>
        )}

        <AmazonDSPCampaigns accountId={account.id} />
      </CardContent>
    </Card>
  );
}