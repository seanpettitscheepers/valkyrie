import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import { toast } from "sonner";

interface UTMGeneratorResultsProps {
  url: string;
}

export function UTMGeneratorResults({ url }: UTMGeneratorResultsProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  if (!url) return null;

  return (
    <div className="space-y-4 pt-4 border-t">
      <div>
        <label className="text-sm font-medium">Generated UTM URL</label>
        <div className="flex items-center gap-2 mt-1">
          <Input value={url} readOnly />
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
          >
            <Link className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}