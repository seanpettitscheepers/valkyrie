import { ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface PlanFeaturesProps {
  currentPlan: any;
  nextPlan: any;
  nextTier: string | null;
  upgradeFeatures: string[];
  onUpgrade: () => void;
}

export function PlanFeatures({ currentPlan, nextPlan, nextTier, upgradeFeatures, onUpgrade }: PlanFeaturesProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium">What's included in your plan:</h4>
        <ul className="space-y-2">
          {currentPlan?.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-primary">•</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {nextTier && (
        <>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-primary" />
              <h4 className="font-medium">Upgrade to {nextPlan?.name} to get:</h4>
            </div>
            <ul className="space-y-2">
              {upgradeFeatures.map((feature: string, index: number) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-primary">•</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Button 
              className="w-full" 
              onClick={onUpgrade}
            >
              Upgrade to {nextPlan?.name}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}