import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { ConnectedPlatform } from "@/hooks/useConnectedPlatforms";

interface PlatformSelectorProps {
  platforms: ConnectedPlatform[];
  selectedPlatforms: string[];
  onPlatformAdd: (platform: string) => void;
  onPlatformRemove: (platform: string) => void;
}

export function PlatformSelector({ 
  platforms, 
  selectedPlatforms, 
  onPlatformAdd, 
  onPlatformRemove 
}: PlatformSelectorProps) {
  return (
    <div>
      <label className="text-sm font-medium">Platforms</label>
      <Select
        value=""
        onValueChange={onPlatformAdd}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select platforms" />
        </SelectTrigger>
        <SelectContent>
          {platforms?.map((platform) => (
            <SelectItem 
              key={platform.value} 
              value={platform.value}
              disabled={selectedPlatforms.includes(platform.value)}
            >
              {platform.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedPlatforms.map(platform => {
          const platformLabel = platforms?.find(p => p.value === platform)?.label || platform;
          return (
            <Badge 
              key={platform} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {platformLabel}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onPlatformRemove(platform)}
              />
            </Badge>
          );
        })}
      </div>
    </div>
  );
}