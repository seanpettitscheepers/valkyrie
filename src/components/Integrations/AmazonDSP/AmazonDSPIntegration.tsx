import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Settings2, Link2, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AmazonDSPCampaigns } from "./AmazonDSPCampaigns";

export function AmazonDSPIntegration() {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: account, isLoading, error, refetch } = useQuery({
    queryKey: ["amazon-dsp-account"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("amazon_dsp_accounts")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const { error } = await supabase.functions.invoke("sync-amazon-dsp-campaigns", {
        body: { accountId: account.id },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully synced Amazon DSP campaigns",
      });
      refetch();
    } catch (error) {
      console.error("Error syncing campaigns:", error);
      toast({
        title: "Error",
        description: "Failed to sync campaigns. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Amazon DSP</CardTitle>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Advertising
        </Badge>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading Amazon DSP account: {error.message}
            </AlertDescription>
          </Alert>
        )}

        {account && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{account.account_name || account.account_id}</p>
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
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing ? (
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
            <AmazonDSPCampaigns accountId={account.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}