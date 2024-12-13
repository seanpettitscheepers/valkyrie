import { PageLayout } from "@/components/Layout/PageLayout";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      return data;
    }
  });

  // Redirect non-admin users
  if (!isLoading && (!profile || (profile.role !== "admin" && profile.role !== "super_admin"))) {
    navigate("/");
    return null;
  }

  if (isLoading) {
    return (
      <PageLayout title="Admin">
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Admin">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        {/* Add admin functionality here */}
      </div>
    </PageLayout>
  );
}