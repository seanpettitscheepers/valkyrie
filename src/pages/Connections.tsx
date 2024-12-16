import { PageLayout } from "@/components/Layout/PageLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ConnectedPlatformCard } from "@/components/Connections/ConnectedPlatformCard";
import { ConnectPlatformDialog } from "@/components/Connections/ConnectPlatformDialog";
import { useState } from "react";

export default function Connections() {
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);

  const { data: connections, isLoading } = useQuery({
    queryKey: ["platform-connections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_connections")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <PageLayout title="Platform Connections">
      <div className="space-y-6">
        <PageHeader
          title="Unite Your Arsenal: Platform Connections"
          description="Connect and manage all your advertising platforms in one place. Streamline your workflow and maintain control over your digital presence."
        />

        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Connected Platforms</h2>
            <p className="text-sm text-muted-foreground">
              Manage your connected advertising platforms and analytics services
            </p>
          </div>
          <Button onClick={() => setIsConnectDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Connect Platform
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-24 bg-muted rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {connections?.map((connection) => (
              <ConnectedPlatformCard
                key={connection.id}
                connection={connection}
              />
            ))}
          </div>
        )}

        <ConnectPlatformDialog
          open={isConnectDialogOpen}
          onOpenChange={setIsConnectDialogOpen}
        />
      </div>
    </PageLayout>
  );
}