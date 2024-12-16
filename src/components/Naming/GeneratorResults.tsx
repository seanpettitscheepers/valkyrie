import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { PlatformGeneratedNames } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GeneratorResultsProps {
  names: PlatformGeneratedNames;
}

export function GeneratorResults({ names }: GeneratorResultsProps) {
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  if (Object.keys(names).length === 0) return null;

  return (
    <div className="space-y-6 pt-4 border-t">
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