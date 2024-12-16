import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { UserManagementHeader } from "./UserManagement/UserManagementHeader";
import { UserTable } from "./UserManagement/UserTable";
import { UserFilters } from "./UserManagement/UserFilters";
import { useUserData } from "./UserManagement/useUserData";
import { useUserActions } from "./UserManagement/useUserActions";

export function AdminSection() {
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

  const { users } = useUserData(currentUser);
  const { updating, updateUserRole, handleSubscriptionAction, handleAddUser } = useUserActions();

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

  if (currentUser?.role !== "super_admin") return null;

  return (
    <Card className="mt-8">
      <UserManagementHeader 
        filteredUsers={filteredUsers || []}
        onAddUser={handleAddUser}
      />
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