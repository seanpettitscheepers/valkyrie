import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, Edit, Trash } from "lucide-react";
import { useState } from "react";
import { EditBrandDialog } from "./EditBrandDialog";
import { ConnectAccountsDialog } from "./ConnectAccountsDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface BrandCardProps {
  brand: any;
}

export function BrandCard({ brand }: BrandCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const { error } = await supabase
      .from("brands")
      .delete()
      .eq("id", brand.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete brand",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Brand deleted successfully",
    });

    queryClient.invalidateQueries({ queryKey: ["brands"] });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {brand.name}
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsConnectDialogOpen(true)}
          >
            <Link2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {brand.logo_url && (
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="w-16 h-16 object-contain"
            />
          )}
          {brand.description && (
            <p className="text-sm text-muted-foreground">
              {brand.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {brand.brand_connections?.map((connection: any) => (
              <div
                key={connection.id}
                className="text-xs bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-full"
              >
                {connection.platform_name}
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <EditBrandDialog
        brand={brand}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <ConnectAccountsDialog
        brand={brand}
        open={isConnectDialogOpen}
        onOpenChange={setIsConnectDialogOpen}
      />
    </Card>
  );
}