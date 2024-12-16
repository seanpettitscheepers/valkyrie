import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown } from "lucide-react";
import { AddUserDialog } from "./AddUserDialog";
import * as XLSX from 'xlsx';

interface UserManagementHeaderProps {
  filteredUsers: any[];
  onAddUser: (userData: {
    email: string;
    businessName: string;
    role: string;
    subscription: string;
  }) => Promise<void>;
}

export function UserManagementHeader({ filteredUsers, onAddUser }: UserManagementHeaderProps) {
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

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>User Management</CardTitle>
      <div className="flex gap-2">
        <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Export Excel
        </Button>
        <AddUserDialog onAddUser={onAddUser} />
      </div>
    </CardHeader>
  );
}