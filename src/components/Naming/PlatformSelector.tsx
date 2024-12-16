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
import { useConnectedPlatforms } from "@/hooks/useConnectedPlatforms";

interface PlatformFilterProps {
  selectedPlatforms: string[];
  onPlatformChange: (platforms: string[]) => void;
}

export function PlatformSelector({ selectedPlatforms, onPlatformChange }: PlatformFilterProps) {
  const { data: connectedPlatforms, isLoading } = useConnectedPlatforms();

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
  };

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Filter className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Platforms
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Platforms</DropdownMenuLabel>
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