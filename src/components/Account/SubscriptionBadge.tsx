import { Badge } from "@/components/ui/badge";

interface SubscriptionBadgeProps {
  tier: string | null;
}

export function SubscriptionBadge({ tier }: SubscriptionBadgeProps) {
  const getBadgeColor = (tier: string | null) => {
    switch (tier) {
      case "free":
        return "bg-gray-100 text-gray-800";
      case "growth":
        return "bg-blue-100 text-blue-800";
      case "pro":
        return "bg-purple-100 text-purple-800";
      case "enterprise":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge className={getBadgeColor(tier)}>
      {tier?.toUpperCase() || "FREE"}
    </Badge>
  );
}