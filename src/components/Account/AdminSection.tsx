import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AddUserDialog } from "./UserManagement/AddUserDialog";
import { UserTable } from "./UserManagement/UserTable";
import type { Profile } from "@/types/profile";

export function AdminSection() {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);

  const { data: currentUser } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: users, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: subscriptions, error: subsError } = await supabase
        .from("user_subscriptions")
        .select("user_id, subscription_plans(tier), status")
        .eq("status", "active");

      if (subsError) throw subsError;

      return profiles.map(profile => ({
        ...profile,
        subscription: subscriptions?.find(sub => sub.user_id === profile.id)?.subscription_plans?.tier || "free",
        status: subscriptions?.find(sub => sub.user_id === profile.id)?.status || "active"
      }));
    },
    enabled: currentUser?.role === "super_admin",
  });

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
      refetch();
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

  const handleAddUser = async (userData: {
    email: string;
    businessName: string;
    role: string;
    subscription: string;
  }) => {
    try {
      // In a real implementation, you would integrate with your user creation flow
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
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: `There was an error ${action}ing the subscription.`,
        variant: "destructive",
      });
    }
  };

  if (currentUser?.role !== "super_admin") return null;

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <AddUserDialog onAddUser={handleAddUser} />
      </CardHeader>
      <CardContent>
        <UserTable
          users={users || []}
          onUpdateRole={updateUserRole}
          onSubscriptionAction={handleSubscriptionAction}
          updating={updating}
        />
      </CardContent>
    </Card>
  );
}