import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Profile, ProfileUpdate } from "@/types/profile";
import { useNavigate } from "react-router-dom";

export function useProfile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    getProfile();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setEmail(null);
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  async function getProfile() {
    try {
      setLoading(true);
      
      // First check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        // No valid session, redirect to auth
        navigate('/auth');
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error("No user found");
      }

      setEmail(user.email);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (error: any) {
      console.error("Error loading user data:", error);
      
      // Handle session-specific errors
      if (error.message?.includes('JWT')) {
        await supabase.auth.signOut();
        navigate('/auth');
        toast({
          title: "Session expired",
          description: "Please sign in again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error loading profile",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(formData: ProfileUpdate) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Session expired",
          description: "Please sign in again to update your profile.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", session.user.id);

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

  return {
    loading,
    profile,
    email,
    updateProfile
  };
}