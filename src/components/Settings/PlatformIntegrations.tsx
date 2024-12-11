import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { IntegrationDialog } from "./IntegrationDialog";
import { useState } from "react";
import { PlatformIntegrationType } from "@/types/platform";

export const PlatformIntegrations = () => {
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

  const platformTypes = {
    social_media: { label: "Social Media", className: "bg-blue-100 text-blue-800" },
    video: { label: "Video", className: "bg-red-100 text-red-800" },
    search_display: { label: "Search & Display", className: "bg-green-100 text-green-800" },
    ecommerce: { label: "E-commerce", className: "bg-purple-100 text-purple-800" },
    audio: { label: "Audio", className: "bg-orange-100 text-orange-800" },
  };

  if (isLoading) {
    return <div>Loading integrations...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Platform Integrations</h2>
        <p className="text-muted-foreground">
          Connect your advertising platforms to enable automated data synchronization.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platforms?.map((platform) => (
          <Card key={platform.id}>
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
              <div className="flex items-center justify-between">
                <Badge variant={platform.is_active ? "success" : "secondary"}>
                  {platform.is_active ? "Connected" : "Not Connected"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPlatform(platform)}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
              {platform.last_sync_at && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last synced: {new Date(platform.last_sync_at).toLocaleString()}
                </p>
              )}
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