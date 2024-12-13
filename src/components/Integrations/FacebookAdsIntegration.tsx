import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Facebook, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const FACEBOOK_CLIENT_ID = "your_facebook_client_id"; // Replace with your actual client ID
const REDIRECT_URI = "https://qothiaalyhdfuesmvcvu.functions.supabase.co/facebook-auth-callback";

export function FacebookAdsIntegration() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("facebook_ad_accounts")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error("Error loading accounts:", error);
      setError("Failed to load Facebook ad accounts");
    } finally {
      setIsLoading(false);
    }
  }

  const handleConnect = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create state parameter with user ID and redirect URL
      const state = btoa(JSON.stringify({
        userId: user.id,
        redirectUrl: window.location.origin + "/connections"
      }));

      // Redirect to Facebook OAuth dialog
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${FACEBOOK_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&state=${state}` +
        `&scope=ads_management,ads_read`;

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error initiating Facebook connection:", error);
      toast({
        title: "Connection Error",
        description: "Failed to initiate Facebook connection. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
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

        {accounts.length > 0 ? (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{account.account_name}</p>
                  <p className="text-sm text-muted-foreground">
                    ID: {account.account_id}
                  </p>
                </div>
                <Badge
                  variant={account.status === "active" ? "success" : "secondary"}
                >
                  {account.status}
                </Badge>
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