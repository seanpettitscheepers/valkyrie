import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";

export function CreateCampaignDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch platforms
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

  // Fetch analytics properties
  const { data: analyticsProperties } = useQuery({
    queryKey: ["analytics-integrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_integrations")
        .select("*")
        .eq("is_active", true);
      
      if (error) throw error;
      return data;
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const campaignData = {
        name: formData.get("name"),
        platform_id: formData.get("platform_id"),
        analytics_property_id: formData.get("analytics_property_id"),
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from("campaigns")
        .insert(campaignData)
        .select()
        .single();

      if (error) throw error;

      // Create default KPIs
      const kpiTypes = ["signups", "purchases", "revenue"];
      const kpiPromises = kpiTypes.map((type) =>
        supabase.from("campaign_kpis").insert({
          campaign_id: data.id,
          kpi_type: type,
          target_value: 0,
          current_value: 0,
        })
      );

      await Promise.all(kpiPromises);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      setOpen(false);
      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createCampaignMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Campaign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter campaign name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform_id">Platform</Label>
            <Select name="platform_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms?.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    {platform.platform_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="analytics_property_id">Analytics Property</Label>
            <Select name="analytics_property_id">
              <SelectTrigger>
                <SelectValue placeholder="Select analytics property" />
              </SelectTrigger>
              <SelectContent>
                {analyticsProperties?.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.property_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createCampaignMutation.isPending}
          >
            {createCampaignMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Campaign
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}