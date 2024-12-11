import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlatformIntegrationType } from "@/types/platform";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface GoogleAdsSetupProps {
  platform: PlatformIntegrationType;
}

export const GoogleAdsSetup = ({ platform }: GoogleAdsSetupProps) => {
  const [clientId, setClientId] = useState(platform.credentials?.clientId || "");
  const [clientSecret, setClientSecret] = useState(platform.credentials?.clientSecret || "");
  const [refreshToken, setRefreshToken] = useState(platform.credentials?.refreshToken || "");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("platform_integrations")
        .update({
          credentials: { clientId, clientSecret, refreshToken },
          is_active: true,
          last_sync_at: new Date().toISOString(),
        })
        .eq("id", platform.id);

      if (error) throw error;

      toast({
        title: "Integration Updated",
        description: `${platform.platform_name} integration has been updated successfully.`,
      });

      queryClient.invalidateQueries({ queryKey: ["platform-integrations"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update integration settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="clientId">Client ID</Label>
        <Input
          id="clientId"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          placeholder="Enter your Client ID"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="clientSecret">Client Secret</Label>
        <Input
          id="clientSecret"
          type="password"
          value={clientSecret}
          onChange={(e) => setClientSecret(e.target.value)}
          placeholder="Enter your Client Secret"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="refreshToken">Refresh Token</Label>
        <Input
          id="refreshToken"
          type="password"
          value={refreshToken}
          onChange={(e) => setRefreshToken(e.target.value)}
          placeholder="Enter your Refresh Token"
        />
      </div>
      <Button
        className="w-full"
        onClick={handleSave}
        disabled={!clientId || !clientSecret || !refreshToken || isLoading}
      >
        {isLoading ? "Saving..." : "Save Integration"}
      </Button>
    </div>
  );
};