import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User2, Upload } from "lucide-react";
import type { Profile } from "@/types/profile";

interface ProfileAvatarProps {
  profile: Profile | null;
  uploading: boolean;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export function ProfileAvatar({ profile, uploading, onAvatarUpload }: ProfileAvatarProps) {
  return (
    <div className="mb-8 flex items-center gap-6">
      <div className="relative group">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback>
            <User2 className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <label 
          htmlFor="avatar-upload" 
          className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
        >
          <Upload className="h-6 w-6" />
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={onAvatarUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
          </div>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold">{profile?.business_name || "Business Profile"}</h1>
        <p className="text-muted-foreground">{profile?.email || "Add your email address"}</p>
      </div>
    </div>
  );
}