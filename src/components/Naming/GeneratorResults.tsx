import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { PlatformGeneratedNames } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GeneratorResultsProps {
  names: PlatformGeneratedNames;
}

export function GeneratorResults({ names }: GeneratorResultsProps) {
  const [campaignName, setCampaignName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const handleSave = async () => {
    if (!campaignName.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("saved_campaign_names")
        .insert({
          campaign_name: campaignName,
          platform_names: names,
        });

      if (error) throw error;
      toast.success("Campaign names saved successfully");
      setCampaignName("");
    } catch (error) {
      console.error("Error saving campaign names:", error);
      toast.error("Failed to save campaign names");
    } finally {
      setIsSaving(false);
    }
  };

  if (Object.keys(names).length === 0) return null;

  return (
    <div className="space-y-6 pt-4 border-t">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Save Campaign Names</label>
          <Input
            placeholder="Enter campaign name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Names"}
        </Button>
      </div>

      {Object.entries(names).map(([platform, platformNames]) => (
        <Card key={platform}>
          <CardHeader>
            <CardTitle className="text-lg">{platform.charAt(0).toUpperCase() + platform.slice(1)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Campaign Name</label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={platformNames.campaign} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(platformNames.campaign, "Campaign name")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Ad Set Name</label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={platformNames.adset} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(platformNames.adset, "Ad set name")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Ad Name</label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={platformNames.ad} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(platformNames.ad, "Ad name")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">UTM Tag</label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={platformNames.utm} readOnly />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(platformNames.utm, "UTM tag")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}