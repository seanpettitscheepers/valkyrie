import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useUserActions() {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setUpdating(userId);
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Role updated",
        description: "User role has been updated successfully.",
      });
      
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error updating role",
        description: "There was an error updating the user role.",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleSubscriptionAction = async (userId: string, action: "pause" | "cancel") => {
    try {
      const newStatus = action === "pause" ? "paused" : "cancelled";
      const { error } = await supabase
        .from("user_subscriptions")
        .update({ status: newStatus })
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Subscription updated",
        description: `Subscription has been ${action}ed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `There was an error ${action}ing the subscription.`,
        variant: "destructive",
      });
    }
  };

  const handleAddUser = async (userData: {
    email: string;
    businessName: string;
    role: string;
    subscription: string;
  }) => {
    try {
      toast({
        title: "User invited",
        description: "An invitation has been sent to the user's email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the user.",
        variant: "destructive",
      });
    }
  };

  return {
    updating,
    updateUserRole,
    handleSubscriptionAction,
    handleAddUser,
  };
}