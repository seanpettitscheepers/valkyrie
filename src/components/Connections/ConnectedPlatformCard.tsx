import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2, Link2 } from "lucide-react";

interface ConnectedPlatformCardProps {
  connection: {
    id: string;
    platform_name: string;
    platform_type: string;
    is_active: boolean;
    last_sync_at?: string;
  };
}

export function ConnectedPlatformCard({ connection }: ConnectedPlatformCardProps) {
  return (
    <Card className={connection.is_active ? "border-primary" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {connection.platform_name}
        </CardTitle>
        <Badge variant="secondary">
          {connection.platform_type}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              <span className={connection.is_active ? "text-green-600" : "text-gray-500"}>
                {connection.is_active ? "Connected" : "Not Connected"}
              </span>
            </div>
            <Button variant="ghost" size="sm">
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
          {connection.last_sync_at && (
            <p className="text-xs text-muted-foreground">
              Last synced: {new Date(connection.last_sync_at).toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}