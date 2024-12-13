import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Facebook, RefreshCw, AlertCircle, Users } from "lucide-react";

const FACEBOOK_CLIENT_ID = "your_facebook_client_id";
const REDIRECT_URI = "https://qothiaalyhdfuesmvcvu.functions.supabase.co/facebook-pages-auth-callback";

export function FacebookPagesManager() {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { data: pages, isLoading, refetch } = useQuery({
    queryKey: ["facebook-pages"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("facebook_pages")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data || [];
    },
  });

  const syncMutation = useMutation({
    mutationFn: async (pageId: string) => {
      const { error } = await supabase.functions.invoke("sync-facebook-pages", {
        body: { pageId },
      });

      if (error) throw error;
      await refetch();
    },
    onSuccess: () => {
      toast({
        title: "Sync Successful",
        description: "Page data has been synchronized successfully.",
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
        `&scope=pages_show_list,pages_read_engagement,pages_manage_posts`;

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error initiating Facebook connection:", error);
      setError("Failed to initiate Facebook connection. Please try again.");
    }
  };

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
        <CardTitle className="flex items-center gap-2">
          <Facebook className="h-5 w-5" />
          Facebook Pages
        </CardTitle>
        <CardDescription>
          Connect and manage your Facebook Pages
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {pages?.length > 0 ? (
          <div className="space-y-4">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{page.page_name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{page.followers_count?.toLocaleString() || 0} followers</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary"
                    className={page.is_active ? "bg-green-100 text-green-800" : ""}
                  >
                    {page.is_active ? "Connected" : "Disconnected"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => syncMutation.mutate(page.id)}
                    disabled={syncMutation.isPending}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                    Sync
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Button onClick={handleConnect} className="w-full">
            <Facebook className="mr-2 h-4 w-4" />
            Connect Facebook Pages
          </Button>
        )}
      </CardContent>
    </Card>
  );
}