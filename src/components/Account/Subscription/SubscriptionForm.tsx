import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useSubscriptionData } from "./hooks/useSubscriptionData";
import { CurrentSubscription } from "../CurrentSubscription";
import { PlanFeatures } from "../PlanFeatures";
import { SubscriptionPlanCard } from "../SubscriptionPlanCard";
import { SubscriptionLimits } from "../SubscriptionLimits";

export function SubscriptionForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    profile, 
    subscription, 
    plans, 
    currentPlan,
    nextTier,
    nextPlan,
    upgradeFeatures,
    isLoading,
    handleSubscribe,
    handleManageSubscription 
  } = useSubscriptionData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>
          Manage your subscription and billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CurrentSubscription 
          profile={profile}
          subscription={subscription}
          currentPlan={currentPlan}
          onManageSubscription={handleManageSubscription}
        />

        <SubscriptionLimits />

        <PlanFeatures 
          currentPlan={currentPlan}
          nextPlan={nextPlan}
          nextTier={nextTier}
          upgradeFeatures={upgradeFeatures}
          onUpgrade={() => nextPlan && handleSubscribe(nextPlan)}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans?.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              profile={profile}
              isCurrentPlan={plan.tier === profile?.subscription_tier}
              onSubscribe={() => handleSubscribe(plan)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}