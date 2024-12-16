import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

interface HeaderProps {
  connectedPlatforms: number;
  totalPlatforms: number;
}

export const Header = ({ connectedPlatforms, totalPlatforms }: HeaderProps) => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Forge the Links to Your Digital Arsenal"
        description="Connect your advertising and analytics accounts to unlock Valkyrie's full power. Seamless integration, complete visibility, and precision control."
      />

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {connectedPlatforms} of {totalPlatforms} platforms connected
        </AlertDescription>
      </Alert>
    </div>
  );
};