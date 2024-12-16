import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AddUserDialog } from "./UserManagement/AddUserDialog";
import { UserTable } from "./UserManagement/UserTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import * as XLSX from 'xlsx';
import type { Profile } from "@/types/profile";

export function AdminSection() {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    businessName: "",
    role: "",
    subscription: "",
    status: "",
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

  const { data: users, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get all users to get their emails
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      // Get active subscriptions
      const { data: subscriptions, error: subsError } = await supabase
        .from("user_subscriptions")
        .select("user_id, subscription_plans(tier), status")
        .eq("status", "active");

      if (subsError) throw subsError;

      // Combine the data
      return profiles.map(profile => ({
        ...profile,
        email: authUsers.find(u => u.id === profile.id)?.email || "",
        subscription: subscriptions?.find(sub => sub.user_id === profile.id)?.subscription_plans?.tier || "free",
        status: subscriptions?.find(sub => sub.user_id === profile.id)?.status || "active"
      }));
    },
    enabled: currentUser?.role === "super_admin",
  });

  const filteredUsers = users?.filter(user => {
    return (
      (!filters.businessName || user.business_name?.toLowerCase().includes(filters.businessName.toLowerCase())) &&
      (!filters.role || user.role === filters.role) &&
      (!filters.subscription || user.subscription === filters.subscription) &&
      (!filters.status || user.status === filters.status)
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
        <div className="mb-4 grid grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Filter by business name..."
              value={filters.businessName}
              onChange={(e) => setFilters({ ...filters, businessName: e.target.value })}
            />
          </div>
          <Select
            value={filters.role}
            onValueChange={(value) => setFilters({ ...filters, role: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.subscription}
            onValueChange={(value) => setFilters({ ...filters, subscription: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All subscriptions</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="growth">Growth</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
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