import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlatformFilterProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
}

export function PlatformFilter({ selectedPlatform, onPlatformChange }: PlatformFilterProps) {
  return (
    <div className="mb-6">
      <Select value={selectedPlatform} onValueChange={onPlatformChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Platforms</SelectItem>
          <SelectItem value="Facebook">Facebook</SelectItem>
          <SelectItem value="Instagram">Instagram</SelectItem>
          <SelectItem value="Twitter">Twitter</SelectItem>
          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}