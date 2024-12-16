import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2, Link2 } from "lucide-react";

interface AnalyticsCardProps {
  integration: any;
  platformType: {
    label: string;
    className: string;
  };
  onSelectPlatform: (platform: any) => void;
}

export const AnalyticsCard = ({ integration, platformType, onSelectPlatform }: AnalyticsCardProps) => {
  return (
    <Card className={integration.is_active ? "border-primary" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {integration.platform_type === 'google_analytics_4' ? 'Google Analytics 4' : 'Universal Analytics'}
        </CardTitle>
        <Badge variant="secondary" className={platformType.className}>
          Analytics
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              <span className={integration.is_active ? "text-green-600" : "text-gray-500"}>
                {integration.is_active ? "Connected" : "Not Connected"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectPlatform(integration)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
          {integration.last_sync_at && (
            <p className="text-xs text-muted-foreground">
              Last synced: {new Date(integration.last_sync_at).toLocaleString()}
            </p>
          )}
          {integration.property_id && (
            <p className="text-xs text-muted-foreground">
              Property ID: {integration.property_id}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};