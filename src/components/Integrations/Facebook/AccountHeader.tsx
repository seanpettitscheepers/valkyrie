import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";

interface AccountHeaderProps {
  account: {
    account_name: string;
    account_id: string;
    status: string;
  };
  onSync: () => void;
  isSyncing: boolean;
}

export const AccountHeader = ({ account, onSync, isSyncing }: AccountHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <p className="font-medium">{account.account_name}</p>
        <p className="text-sm text-muted-foreground">
          ID: {account.account_id}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge 
          variant="secondary"
          className={account.status === "active" ? "bg-green-100 text-green-800" : ""}
        >
          {account.status}
        </Badge>
        <Button
          size="sm"
          variant="outline"
          onClick={onSync}
          disabled={isSyncing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          Sync
        </Button>
      </div>
    </div>
  );
};