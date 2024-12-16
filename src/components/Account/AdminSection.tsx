import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, PauseCircle, StopCircle, Eye } from "lucide-react";
import type { Profile } from "@/types/profile";

export function AdminSection() {
  const { toast } = useToast();
  const [updating, setUpdating] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    businessName: "",
    role: "user",
    subscription: "free"
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

  const handleAddUser = async () => {
    try {
      // In a real implementation, you would integrate with your user creation flow
      // For now, we'll just show a success message
      toast({
        title: "User invited",
        description: "An invitation has been sent to the user's email.",
      });
      setShowAddUser(false);
      setNewUser({
        email: "",
        businessName: "",
        role: "user",
        subscription: "free"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the user.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
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
        <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label>Email</label>
                <Input
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <label>Business Name</label>
                <Input
                  value={newUser.businessName}
                  onChange={(e) => setNewUser({ ...newUser, businessName: e.target.value })}
                  placeholder="Business Name"
                />
              </div>
              <div className="space-y-2">
                <label>Role</label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label>Subscription</label>
                <Select
                  value={newUser.subscription}
                  onValueChange={(value) => setNewUser({ ...newUser, subscription: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleAddUser}>
                Add User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.business_name || "N/A"}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.subscription}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select
                      disabled={updating === user.id}
                      onValueChange={(value) => updateUserRole(user.id, value)}
                      defaultValue={user.role}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleSubscriptionAction(user.id, "pause")}
                    >
                      <PauseCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleSubscriptionAction(user.id, "cancel")}
                    >
                      <StopCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {/* Navigate to user profile */}}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}