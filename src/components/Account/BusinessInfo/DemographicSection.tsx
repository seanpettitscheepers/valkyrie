import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User2, Globe } from "lucide-react";
import type { Profile } from "@/types/profile";

interface DemographicSectionProps {
  profile: Profile | null;
  email: string | null;
  onFieldChange: (field: string, value: string) => void;
}

export function DemographicSection({ profile, email, onFieldChange }: DemographicSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User2 className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="business_name">Business Name</Label>
        </div>
        <Input
          id="business_name"
          value={profile?.business_name || ""}
          onChange={(e) => onFieldChange("business_name", e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="phone">Phone Number</Label>
        </div>
        <Input
          id="phone"
          value={profile?.phone_number || ""}
          onChange={(e) => onFieldChange("phone_number", e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <User2 className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="email">Email Address</Label>
        </div>
        <Input
          id="email"
          value={email || ""}
          readOnly
          className="max-w-sm bg-muted"
        />
      </div>
    </div>
  );
}