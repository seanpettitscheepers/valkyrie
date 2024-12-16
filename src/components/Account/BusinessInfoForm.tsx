import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile, ProfileUpdate } from "@/types/profile";
import { ProfileAvatar } from "./BusinessInfo/ProfileAvatar";
import { DemographicSection } from "./BusinessInfo/DemographicSection";
import { LocationSection } from "./BusinessInfo/LocationSection";

interface BusinessInfoFormProps {
  profile: Profile | null;
  email: string | null;
  onUpdate: (formData: ProfileUpdate) => Promise<void>;
}

export function BusinessInfoForm({ profile, email, onUpdate }: BusinessInfoFormProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<ProfileUpdate>({});

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile?.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await onUpdate({ avatar_url: publicUrl });

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error uploading avatar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setPendingChanges(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      toast({
        title: "No changes to save",
        description: "Make some changes to your profile first.",
      });
      return;
    }

    await onUpdate(pendingChanges);
    setPendingChanges({});
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ProfileAvatar 
        profile={profile}
        email={email}
        uploading={uploading}
        onAvatarUpload={handleAvatarUpload}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DemographicSection
            profile={profile}
            email={email}
            onFieldChange={handleFieldChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LocationSection
            profile={profile}
            onFieldChange={handleFieldChange}
          />

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <Button 
              onClick={handleUpdateProfile}
              disabled={Object.keys(pendingChanges).length === 0}
            >
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}