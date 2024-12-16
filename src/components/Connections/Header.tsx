import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface HeaderProps {
  connectedPlatforms: number;
  totalPlatforms: number;
}

export const Header = ({ connectedPlatforms, totalPlatforms }: HeaderProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Forge the Links to Your Digital Arsenal</h2>
        <p className="text-muted-foreground">
          Connect your advertising and analytics accounts to unlock Valkyrie's full power. Seamless integration, complete visibility, and precision control.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {connectedPlatforms} of {totalPlatforms} platforms connected
        </AlertDescription>
      </Alert>
    </div>
  );
};