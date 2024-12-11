import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { GeneratedNames } from "./types";

interface GeneratorResultsProps {
  names: GeneratedNames;
}

export function GeneratorResults({ names }: GeneratorResultsProps) {
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  if (!names.campaign) return null;

  return (
    <div className="space-y-4 pt-4 border-t">
      <div>
        <label className="text-sm font-medium">Campaign Name</label>
        <div className="flex items-center gap-2 mt-1">
          <Input value={names.campaign} readOnly />
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(names.campaign, "Campaign name")}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Ad Set Name</label>
        <div className="flex items-center gap-2 mt-1">
          <Input value={names.adset} readOnly />
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(names.adset, "Ad set name")}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Ad Name</label>
        <div className="flex items-center gap-2 mt-1">
          <Input value={names.ad} readOnly />
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(names.ad, "Ad name")}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">UTM Tag</label>
        <div className="flex items-center gap-2 mt-1">
          <Input value={names.utm} readOnly />
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(names.utm, "UTM tag")}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}