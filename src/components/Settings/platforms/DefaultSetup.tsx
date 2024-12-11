import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlatformIntegrationType } from "@/types/platform";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface DefaultSetupProps {
  platform: PlatformIntegrationType;
}

export const DefaultSetup = ({ platform }: DefaultSetupProps) => {
  const [apiKey, setApiKey] = useState(platform.credentials?.apiKey || "");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("platform_integrations")
        .update({
          credentials: { apiKey },
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
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key"
        />
      </div>
      <Button
        className="w-full"
        onClick={handleSave}
        disabled={!apiKey || isLoading}
      >
        {isLoading ? "Saving..." : "Save Integration"}
      </Button>
    </div>
  );
};