import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AddUserDialogProps {
  onAddUser: (userData: {
    email: string;
    businessName: string;
    role: string;
    subscription: string;
  }) => void;
}

export function AddUserDialog({ onAddUser }: AddUserDialogProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    businessName: "",
    role: "user",
    subscription: "free"
  });

  const handleSubmit = () => {
    onAddUser(newUser);
    setShowDialog(false);
    setNewUser({
      email: "",
      businessName: "",
      role: "user",
      subscription: "free"
    });
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
          <Button className="w-full" onClick={handleSubmit}>
            Add User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}