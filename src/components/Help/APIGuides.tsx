import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PlatformGuideList } from "./PlatformGuideList";

export function APIGuides() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Platform Connection Guides</h2>
        <p className="text-muted-foreground">
          Learn how to connect your advertising and analytics platforms to enable automated data synchronization.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Make sure you have the necessary API credentials before attempting to connect any platform.
          If you encounter any issues during setup, please contact our support team for assistance.
        </AlertDescription>
      </Alert>

      <PlatformGuideList />

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Additional Information</h3>
        <p>
          For all platform connections:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Ensure you have admin access to the advertising accounts you want to connect.</li>
          <li>Keep your API credentials secure and never share them publicly.</li>
          <li>Review the permissions requested during the connection process.</li>
          <li>Monitor your connection status in the Connections page.</li>
        </ul>
      </div>
    </div>
  );
}