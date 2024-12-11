import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlatformIntegrationType } from "@/types/platform";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface FacebookSetupProps {
  platform: PlatformIntegrationType;
}

export const FacebookSetup = ({ platform }: FacebookSetupProps) => {
  const [appId, setAppId] = useState(platform.credentials?.appId || "");
  const [appSecret, setAppSecret] = useState(platform.credentials?.appSecret || "");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("platform_integrations")
        .update({
          credentials: { appId, appSecret },
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
        <Label htmlFor="appId">App ID</Label>
        <Input
          id="appId"
          value={appId}
          onChange={(e) => setAppId(e.target.value)}
          placeholder="Enter your App ID"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="appSecret">App Secret</Label>
        <Input
          id="appSecret"
          type="password"
          value={appSecret}
          onChange={(e) => setAppSecret(e.target.value)}
          placeholder="Enter your App Secret"
        />
      </div>
      <Button
        className="w-full"
        onClick={handleSave}
        disabled={!appId || !appSecret || isLoading}
      >
        {isLoading ? "Saving..." : "Save Integration"}
      </Button>
    </div>
  );
};