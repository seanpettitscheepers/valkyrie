import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

interface PlatformFilterProps {
  selectedPlatforms: string[];
  onPlatformChange: (platforms: string[]) => void;
  multiSelect?: boolean;
}

export function PlatformFilter({ 
  selectedPlatforms, 
  onPlatformChange,
  multiSelect = true 
}: PlatformFilterProps) {
  const platforms = [
    { value: "all", label: "All Platforms" },
    { value: "Facebook", label: "Facebook" },
    { value: "Instagram", label: "Instagram" },
    { value: "TikTok", label: "TikTok" },
    { value: "Snapchat", label: "Snapchat" },
    { value: "Pinterest", label: "Pinterest" },
    { value: "Google Ads", label: "Google Ads" },
    { value: "DV360", label: "DV360" },
  ];

  const handlePlatformToggle = (platform: string) => {
    if (platform === "all") {
      onPlatformChange(["all"]);
      return;
    }

    if (multiSelect) {
      let newPlatforms: string[];
      if (selectedPlatforms.includes("all")) {
        newPlatforms = [platform];
      } else {
        if (selectedPlatforms.includes(platform)) {
          newPlatforms = selectedPlatforms.filter(p => p !== platform);
          if (newPlatforms.length === 0) {
            newPlatforms = ["all"];
          }
        } else {
          newPlatforms = [...selectedPlatforms, platform];
        }
      }
      onPlatformChange(newPlatforms);
    } else {
      // Single select mode
      onPlatformChange([platform]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          {selectedPlatforms.includes("all") 
            ? "All Platforms" 
            : selectedPlatforms.length === 1 
              ? platforms.find(p => p.value === selectedPlatforms[0])?.label 
              : `${selectedPlatforms.length} Platforms`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Platform{multiSelect ? 's' : ''}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {platforms.map((platform) => (
          <DropdownMenuCheckboxItem
            key={platform.value}
            checked={selectedPlatforms.includes(platform.value)}
            onCheckedChange={() => handlePlatformToggle(platform.value)}
          >
            {platform.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}