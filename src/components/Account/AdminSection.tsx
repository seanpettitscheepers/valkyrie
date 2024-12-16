import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AddUserDialog } from "./UserManagement/AddUserDialog";
import { UserTable } from "./UserManagement/UserTable";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import * as XLSX from 'xlsx';
import { UserFilters } from "./UserManagement/UserFilters";
import type { Profile } from "@/types/profile";

export function AdminSection() {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    businessName: "",
    role: "all",
    subscription: "all",
    status: "all",
  });

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

  // Separate queries for profiles and subscriptions
  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: currentUser?.role === "super_admin",
  });

  const { data: subscriptions } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select(`
          user_id,
          status,
          subscription_plans (
            tier
          )
        `);

      if (error) throw error;
      return data;
    },
    enabled: currentUser?.role === "super_admin",
  });

  // Combine the data
  const users = profiles?.map(profile => {
    const userSubscription = subscriptions?.find(sub => sub.user_id === profile.id);
    return {
      ...profile,
      subscription: userSubscription?.subscription_plans?.tier || "free",
      status: userSubscription?.status || "active"
    };
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredUsers = users?.filter(user => {
    return (
      (!filters.businessName || user.business_name?.toLowerCase().includes(filters.businessName.toLowerCase())) &&
      (filters.role === "all" || user.role === filters.role) &&
      (filters.subscription === "all" || user.subscription === filters.subscription) &&
      (filters.status === "all" || user.status === filters.status)
    );
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
    } catch (error) {
      toast({
        title: "Error",
        description: `There was an error ${action}ing the subscription.`,
        variant: "destructive",
      });
    }
  };

  const exportToExcel = () => {
    if (!filteredUsers?.length) return;

    const exportData = filteredUsers.map(user => ({
      'Business Name': user.business_name || '',
      'Email': user.email || '',
      'Role': user.role,
      'Subscription': user.subscription,
      'Status': user.status,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users.xlsx');
  };

  if (currentUser?.role !== "super_admin") return null;

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <div className="flex gap-2">
          <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export Excel
          </Button>
          <AddUserDialog onAddUser={handleAddUser} />
        </div>
      </CardHeader>
      <CardContent>
        <UserFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <UserTable
          users={filteredUsers || []}
          onUpdateRole={updateUserRole}
          onSubscriptionAction={handleSubscriptionAction}
          updating={updating}
        />
      </CardContent>
    </Card>
  );
}