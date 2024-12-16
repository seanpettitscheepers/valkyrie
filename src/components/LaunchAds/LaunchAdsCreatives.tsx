import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SavedCampaignSelector } from "./SavedCampaignSelector";
import { useState } from "react";

export function LaunchAdsCreatives() {
  const [names, setNames] = useState({
    campaignName: "",
    adSetName: "",
    adName: "",
  });

  const handleImport = (importedNames: {
    campaignName: string;
    adSetName: string;
    adName: string;
  }) => {
    setNames(importedNames);
  };

  return (
    <div className="space-y-4">
      <SavedCampaignSelector onSelect={handleImport} />

      <Card>
        <CardHeader>
          <CardTitle>Campaign Names</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Campaign Name</Label>
            <Input
              placeholder="Enter campaign name"
              value={names.campaignName}
              onChange={(e) =>
                setNames((prev) => ({ ...prev, campaignName: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Ad Set Name</Label>
            <Input
              placeholder="Enter ad set name"
              value={names.adSetName}
              onChange={(e) =>
                setNames((prev) => ({ ...prev, adSetName: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Ad Name</Label>
            <Input
              placeholder="Enter ad name"
              value={names.adName}
              onChange={(e) =>
                setNames((prev) => ({ ...prev, adName: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}