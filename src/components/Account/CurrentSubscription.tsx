import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubscriptionBadge } from "./SubscriptionBadge";

interface CurrentSubscriptionProps {
  profile: any;
  subscription: any;
  currentPlan: any;
  onManageSubscription: () => void;
}

export function CurrentSubscription({ profile, subscription, currentPlan, onManageSubscription }: CurrentSubscriptionProps) {
  const getTrialStatus = () => {
    if (!profile?.trial_ends_at) return null;
    const trialEnd = new Date(profile.trial_ends_at);
    const now = new Date();
    if (trialEnd > now) {
      return `Trial ends on ${formatDate(trialEnd)}`;
    }
    return "Trial ended";
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium">Current Plan</h3>
        <div className="flex items-center gap-2 mt-1">
          <SubscriptionBadge tier={profile?.subscription_tier} />
          {getTrialStatus() && (
            <Badge variant="outline">{getTrialStatus()}</Badge>
          )}
        </div>
      </div>
      {subscription && (
        <Button 
          variant="outline"
          onClick={onManageSubscription}
        >
          {subscription.cancel_at_period_end ? "Resume Subscription" : "Cancel Subscription"}
        </Button>
      )}
    </div>
  );
}