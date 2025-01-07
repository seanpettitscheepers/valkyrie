import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Search, Filter, UserCheck, UserX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search influencers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blacklisted">Blacklisted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Engagement Rate</TableHead>
                  <TableHead>Safety Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {influencers?.map((influencer) => (
                  <TableRow key={influencer.id}>
                    <TableCell className="font-medium">
                      {influencer.name}
                    </TableCell>
                    <TableCell>{influencer.location}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat().format(influencer.follower_count)}
                    </TableCell>
                    <TableCell>
                      {influencer.engagement_rate?.toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          influencer.brand_safety_score >= 80
                            ? "success"
                            : influencer.brand_safety_score >= 60
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {influencer.brand_safety_score?.toFixed(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          influencer.status === "active"
                            ? "success"
                            : influencer.status === "pending"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {influencer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleStatusChange(influencer.id, "active")
                          }
                          title="Approve"
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleStatusChange(influencer.id, "blacklisted")
                          }
                          title="Blacklist"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}