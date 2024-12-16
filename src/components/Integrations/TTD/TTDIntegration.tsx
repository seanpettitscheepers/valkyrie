import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link2, Settings2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TTDCampaigns } from "./TTDCampaigns";

export function TTDIntegration() {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["ttd-accounts"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("ttd_accounts")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
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
        <div className="space-y-4">
          {accounts?.map((account) => (
            <div key={account.id} className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{account.account_name || account.account_id}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link2 className="h-4 w-4" />
                    <span className={account.status === "active" ? "text-green-600" : "text-gray-500"}>
                      {account.status === "active" ? "Connected" : "Not Connected"}
                    </span>
                  </div>
                  {account.last_sync_at && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Last synced: {new Date(account.last_sync_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary"
                    className={account.status === "active" ? "bg-green-100 text-green-800" : ""}
                  >
                    {account.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {account.status === "active" && (
                <TTDCampaigns accountId={account.id} />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}