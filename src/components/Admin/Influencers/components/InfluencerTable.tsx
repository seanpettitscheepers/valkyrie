import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserCheck, UserX } from "lucide-react";

interface InfluencerTableProps {
  influencers: any[];
  onStatusChange: (influencerId: string, newStatus: string) => Promise<void>;
}

export function InfluencerTable({ influencers, onStatusChange }: InfluencerTableProps) {
  const getBadgeVariant = (value: number) => {
    if (value >= 80) return "default";
    if (value >= 60) return "outline";
    return "destructive";
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "outline";
      default:
        return "destructive";
    }
  };

  return (
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
                variant={getBadgeVariant(influencer.brand_safety_score)}
              >
                {influencer.brand_safety_score?.toFixed(1)}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={getStatusVariant(influencer.status)}
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
                    onStatusChange(influencer.id, "active")
                  }
                  title="Approve"
                >
                  <UserCheck className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    onStatusChange(influencer.id, "blacklisted")
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
  );
}