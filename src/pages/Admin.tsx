import { PageLayout } from "@/components/Layout/PageLayout";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSection } from "@/components/Account/AdminSection";
import { AdminInbox } from "@/components/Admin/AdminInbox";
import { BusinessAnalytics } from "@/components/Admin/BusinessAnalytics";
import { TicketManagement } from "@/components/Admin/TicketManagement";
import { InfluencerDiscovery } from "@/components/Admin/Influencers/InfluencerDiscovery";

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
        <Tabs defaultValue="users" className="w-full">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="analytics">Business Analytics</TabsTrigger>
            <TabsTrigger value="influencers">Influencers</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <AdminSection />
          </TabsContent>

          <TabsContent value="tickets" className="space-y-4">
            <TicketManagement />
          </TabsContent>

          <TabsContent value="inbox" className="space-y-4">
            <AdminInbox />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <BusinessAnalytics />
          </TabsContent>

          <TabsContent value="influencers" className="space-y-4">
            <InfluencerDiscovery />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}