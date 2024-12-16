import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { CampaignFilter } from "./CampaignFilter";
import { ShareDialog } from "../Share/ShareDialog";
import { CreateCampaignDialog } from "./CreateCampaignDialog";

interface DashboardHeaderProps {
  selectedCampaign: string;
  onCampaignChange: (campaign: string) => void;
  dashboardRef: React.RefObject<HTMLDivElement>;
}

export function DashboardHeader({ selectedCampaign, onCampaignChange, dashboardRef }: DashboardHeaderProps) {
  return (
    <div>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Your Campaign Command Center: Plan, Execute, and Conquer.</h1>
          <p className="text-muted-foreground mt-1">
            Track your entire campaign arsenal in one place. Monitor ROI, measure impact, and ensure your strategy is always hitting the mark.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <CreateCampaignDialog />
          <CampaignFilter
            selectedCampaign={selectedCampaign}
            onCampaignChange={onCampaignChange}
          />
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <ShareDialog contentRef={dashboardRef} pageTitle="Campaign Dashboard" />
        </div>
      </div>
    </div>
  );
}