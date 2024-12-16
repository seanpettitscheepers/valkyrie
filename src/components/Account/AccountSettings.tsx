import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { BusinessInfoForm } from "./BusinessInfoForm";
import { SecurityForm } from "./SecurityForm";
import { SubscriptionForm } from "./SubscriptionForm";
import type { Profile, ProfileUpdate } from "@/types/profile";

export function AccountSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      setEmail(user.email);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error loading profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(formData: ProfileUpdate) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev) => prev ? { ...prev, ...formData } : null);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="business" className="w-full">
        <TabsList>
          <TabsTrigger value="business">Business Information</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-4">
          <BusinessInfoForm 
            profile={profile} 
            email={email}
            onUpdate={updateProfile} 
          />
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <SubscriptionForm />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityForm email={email} />
        </TabsContent>
      </Tabs>
    </div>
  );
}