import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PauseCircle, StopCircle, Eye } from "lucide-react";
import type { Profile } from "@/types/profile";

interface UserTableProps {
  users: Array<Profile & { 
    subscription?: string;
    status?: string;
    email?: string;
  }>;
  onUpdateRole: (userId: string, newRole: string) => void;
  onSubscriptionAction: (userId: string, action: "pause" | "cancel") => void;
  updating: string | null;
}

export function UserTable({ users, onUpdateRole, onSubscriptionAction, updating }: UserTableProps) {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Business Name</TableHead>
          <TableHead>Email</TableHead>
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
            <TableCell>{user.email || "N/A"}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{user.subscription}</TableCell>
            <TableCell>{getStatusBadge(user.status || "unknown")}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Select
                  disabled={updating === user.id}
                  onValueChange={(value) => onUpdateRole(user.id, value)}
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
                  onClick={() => onSubscriptionAction(user.id, "pause")}
                >
                  <PauseCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onSubscriptionAction(user.id, "cancel")}
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
  );
}