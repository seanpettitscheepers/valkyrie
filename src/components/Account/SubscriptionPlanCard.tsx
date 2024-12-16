import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/types/profile";

interface SubscriptionPlanCardProps {
  plan: {
    id: string;
    tier: string;
    name: string;
    price: number | null;
    annual_price: number | null;
    features: string[];
  };
  profile: Profile | null;
  isCurrentPlan: boolean;
  onSubscribe: () => void;
}

export function SubscriptionPlanCard({ plan, profile, isCurrentPlan, onSubscribe }: SubscriptionPlanCardProps) {
  const renderPrice = () => {
    if (plan.price === null) return "Custom pricing";
    if (plan.price === 0) return "Free";
    
    return (
      <>
        ${plan.price}/month
        {plan.annual_price && (
          <span className="block text-sm text-muted-foreground">
            or ${plan.annual_price}/year
          </span>
        )}
      </>
    );
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{renderPrice()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-2">•</span>
              {feature}
            </li>
          ))}
        </ul>
        <Button 
          className="w-full mt-4" 
          variant={isCurrentPlan ? "outline" : "default"}
          onClick={onSubscribe}
        >
          {isCurrentPlan ? "Current Plan" : "Upgrade"}
        </Button>
      </CardContent>
      {isCurrentPlan && (
        <div className="absolute -top-2 -right-2">
          <Badge>Current</Badge>
        </div>
      )}
    </Card>
  );
}