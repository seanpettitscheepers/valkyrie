import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Globe, User2 } from "lucide-react";
import type { Profile, ProfileUpdate } from "@/types/profile";

interface BusinessInfoFormProps {
  profile: Profile | null;
  onUpdate: (formData: ProfileUpdate) => Promise<void>;
}

export function BusinessInfoForm({ profile, onUpdate }: BusinessInfoFormProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
          <User2 className="h-12 w-12 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile?.business_name || "Business Profile"}</h1>
          <p className="text-muted-foreground">{profile?.phone_number || "Add your phone number"}</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Demographic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="business_name">Business Name</Label>
              </div>
              <Input
                id="business_name"
                value={profile?.business_name || ""}
                onChange={(e) => onUpdate({ business_name: e.target.value })}
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
                onChange={(e) => onUpdate({ phone_number: e.target.value })}
                className="max-w-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="address1">Address Line 1</Label>
              </div>
              <Input
                id="address1"
                value={profile?.address_line1 || ""}
                onChange={(e) => onUpdate({ address_line1: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address2">Address Line 2</Label>
              <Input
                id="address2"
                value={profile?.address_line2 || ""}
                onChange={(e) => onUpdate({ address_line2: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={profile?.city || ""}
                onChange={(e) => onUpdate({ city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={profile?.state || ""}
                onChange={(e) => onUpdate({ state: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={profile?.postal_code || ""}
                onChange={(e) => onUpdate({ postal_code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={profile?.country || ""}
                onChange={(e) => onUpdate({ country: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}