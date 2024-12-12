import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ConnectAccountsDialogProps {
  brand: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectAccountsDialog({ brand, open, onOpenChange }: ConnectAccountsDialogProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    brand.brand_connections?.map((c: any) => c.platform_integration_id) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: platforms } = useQuery({
    queryKey: ["platform-integrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_integrations")
        .select("*")
        .eq("is_active", true);
      
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Delete existing connections
      await supabase
        .from("brand_connections")
        .delete()
        .eq("brand_id", brand.id);

      // Insert new connections
      if (selectedPlatforms.length > 0) {
        const { error } = await supabase
          .from("brand_connections")
          .insert(
            selectedPlatforms.map(platformId => ({
              brand_id: brand.id,
              platform_integration_id: platformId,
            }))
          );

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Connected accounts updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["brands"] });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(current =>
      current.includes(platformId)
        ? current.filter(id => id !== platformId)
        : [...current, platformId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Accounts</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {platforms?.map((platform) => (
              <div key={platform.id} className="flex items-center space-x-2">
                <Checkbox
                  id={platform.id}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={() => togglePlatform(platform.id)}
                />
                <Label htmlFor={platform.id}>{platform.platform_name}</Label>
              </div>
            ))}
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Updating..." : "Update Connections"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}