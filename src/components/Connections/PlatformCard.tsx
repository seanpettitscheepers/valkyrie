import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2, Link2 } from "lucide-react";
import { PlatformIntegrationType } from "@/types/platform";

interface PlatformCardProps {
  platform: PlatformIntegrationType;
  platformType: {
    label: string;
    className: string;
  };
  onSelectPlatform: (platform: PlatformIntegrationType) => void;
}

export const PlatformCard = ({ platform, platformType, onSelectPlatform }: PlatformCardProps) => {
  return (
    <Card key={platform.id} className={platform.is_active ? "border-primary" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {platform.platform_name}
        </CardTitle>
        <Badge variant="secondary" className={platformType.className}>
          {platformType.label}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              <span className={platform.is_active ? "text-green-600" : "text-gray-500"}>
                {platform.is_active ? "Connected" : "Not Connected"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectPlatform(platform)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
          {platform.last_sync_at && (
            <p className="text-xs text-muted-foreground">
              Last synced: {new Date(platform.last_sync_at).toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};