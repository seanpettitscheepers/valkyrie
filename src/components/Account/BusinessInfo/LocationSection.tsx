import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import type { Profile } from "@/types/profile";

interface LocationSectionProps {
  profile: Profile | null;
  onFieldChange: (field: string, value: string) => void;
}

export function LocationSection({ profile, onFieldChange }: LocationSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="address1">Address Line 1</Label>
          </div>
          <Input
            id="address1"
            value={profile?.address_line1 || ""}
            onChange={(e) => onFieldChange("address_line1", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address2">Address Line 2</Label>
          <Input
            id="address2"
            value={profile?.address_line2 || ""}
            onChange={(e) => onFieldChange("address_line2", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={profile?.city || ""}
            onChange={(e) => onFieldChange("city", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={profile?.state || ""}
            onChange={(e) => onFieldChange("state", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input
            id="postal_code"
            value={profile?.postal_code || ""}
            onChange={(e) => onFieldChange("postal_code", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={profile?.country || ""}
            onChange={(e) => onFieldChange("country", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}