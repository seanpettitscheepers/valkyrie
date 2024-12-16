import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFiltersProps {
  filters: {
    businessName: string;
    role: string;
    subscription: string;
    status: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export function UserFilters({ filters, onFilterChange }: UserFiltersProps) {
  return (
    <div className="mb-4 grid grid-cols-4 gap-4">
      <div>
        <Input
          placeholder="Filter by business name..."
          value={filters.businessName}
          onChange={(e) => onFilterChange("businessName", e.target.value)}
        />
      </div>
      <Select
        value={filters.role}
        onValueChange={(value) => onFilterChange("role", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="super_admin">Super Admin</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.subscription}
        onValueChange={(value) => onFilterChange("subscription", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by subscription" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All subscriptions</SelectItem>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="growth">Growth</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.status}
        onValueChange={(value) => onFilterChange("status", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="paused">Paused</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}