import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2, Link2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IntegrationDialog } from "@/components/Settings/IntegrationDialog";
import { useState } from "react";
import { PlatformIntegrationType } from "@/types/platform";

export const PlatformConnections = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformIntegrationType | null>(null);

  const { data: platforms, isLoading } = useQuery({
    queryKey: ["platform-integrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_integrations")
        .select("*")
        .order("platform_name");
      
      if (error) throw error;
      return data as PlatformIntegrationType[];
    },
  });

  const { data: analyticsIntegrations, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["analytics-integrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_integrations")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const platformTypes = {
    social_media: { label: "Social Media", className: "bg-blue-100 text-blue-800" },
    video: { label: "Video", className: "bg-red-100 text-red-800" },
    search_display: { label: "Search & Display", className: "bg-green-100 text-green-800" },
    ecommerce: { label: "E-commerce", className: "bg-purple-100 text-purple-800" },
    audio: { label: "Audio", className: "bg-orange-100 text-orange-800" },
  };

  if (isLoading || isLoadingAnalytics) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const connectedPlatforms = [
    ...(platforms?.filter(p => p.is_active) || []),
    ...(analyticsIntegrations?.filter(a => a.is_active) || [])
  ].length;
  
  const totalPlatforms = (platforms?.length || 0) + (analyticsIntegrations?.length || 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Platform Connections</h2>
        <p className="text-muted-foreground">
          Connect your advertising and analytics platforms to enable automated data synchronization.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {connectedPlatforms} of {totalPlatforms} platforms connected
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Advertising Platforms */}
        {platforms?.map((platform) => (
          <Card key={platform.id} className={platform.is_active ? "border-primary" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {platform.platform_name}
              </CardTitle>
              <Badge 
                variant="secondary" 
                className={platformTypes[platform.platform_type]?.className}
              >
                {platformTypes[platform.platform_type]?.label}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    <span className={platform.is_active ? "text-green-600" : "text-gray-500"}>
                      {platform.is_active ? "Connected" : "Not Connected"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPlatform(platform)}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
                {platform.last_sync_at && (
                  <p className="text-xs text-muted-foreground">
                    Last synced: {new Date(platform.last_sync_at).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Analytics Platforms */}
        {analyticsIntegrations?.map((integration) => (
          <Card key={integration.id} className={integration.is_active ? "border-primary" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {integration.platform_type === 'google_analytics_4' ? 'Google Analytics 4' : 'Universal Analytics'}
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Analytics
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    <span className={integration.is_active ? "text-green-600" : "text-gray-500"}>
                      {integration.is_active ? "Connected" : "Not Connected"}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPlatform(integration as any)}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
                {integration.last_sync_at && (
                  <p className="text-xs text-muted-foreground">
                    Last synced: {new Date(integration.last_sync_at).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <IntegrationDialog
        platform={selectedPlatform}
        onClose={() => setSelectedPlatform(null)}
      />
    </div>
  );
};