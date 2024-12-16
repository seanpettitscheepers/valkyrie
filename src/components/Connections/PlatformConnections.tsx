import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { PlatformIntegrationType } from "@/types/platform";
import { IntegrationDialog } from "@/components/Settings/IntegrationDialog";
import { Header } from "./Header";
import { PlatformCard } from "./PlatformCard";
import { AnalyticsCard } from "./AnalyticsCard";

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
    analytics: { label: "Analytics", className: "bg-indigo-100 text-indigo-800" },
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
      <Header 
        connectedPlatforms={connectedPlatforms}
        totalPlatforms={totalPlatforms}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Analytics Platforms */}
        {analyticsIntegrations?.map((integration) => (
          <AnalyticsCard
            key={integration.id}
            integration={integration}
            platformType={platformTypes.analytics}
            onSelectPlatform={setSelectedPlatform}
          />
        ))}

        {/* Advertising Platforms */}
        {platforms?.map((platform) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            platformType={platformTypes[platform.platform_type]}
            onSelectPlatform={setSelectedPlatform}
          />
        ))}
      </div>

      <IntegrationDialog
        platform={selectedPlatform}
        onClose={() => setSelectedPlatform(null)}
      />
    </div>
  );
};