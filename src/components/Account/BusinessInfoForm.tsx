import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BusinessProfile {
  business_name: string | null;
  phone_number: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
}

interface BusinessInfoFormProps {
  profile: BusinessProfile | null;
  onUpdate: (formData: Partial<BusinessProfile>) => Promise<void>;
}

export function BusinessInfoForm({ profile, onUpdate }: BusinessInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
        <CardDescription>
          Update your business information and contact details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              id="business_name"
              value={profile?.business_name || ""}
              onChange={(e) => onUpdate({ business_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={profile?.phone_number || ""}
              onChange={(e) => onUpdate({ phone_number: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address1">Address Line 1</Label>
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
      </CardContent>
    </Card>
  );
}