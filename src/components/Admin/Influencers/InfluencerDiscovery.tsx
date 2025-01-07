import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SearchFilters } from "./components/SearchFilters";
import { InfluencerTable } from "./components/InfluencerTable";

export function InfluencerDiscovery() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: influencers, isLoading } = useQuery({
    queryKey: ["influencers", searchQuery, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("influencers")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch influencers",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  const handleStatusChange = async (influencerId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("influencers")
        .update({ status: newStatus })
        .eq("id", influencerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Influencer status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update influencer status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Influencer Discovery</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
          />

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <InfluencerTable
              influencers={influencers || []}
              onStatusChange={handleStatusChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}