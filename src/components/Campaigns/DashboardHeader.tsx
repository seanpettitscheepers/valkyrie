import { Button } from "@/components/ui/button";
import { Filter, MoreHorizontal } from "lucide-react";
import { CampaignFilter } from "./CampaignFilter";
import { ShareDialog } from "../Share/ShareDialog";

interface DashboardHeaderProps {
  selectedCampaign: string;
  onCampaignChange: (campaign: string) => void;
  dashboardRef: React.RefObject<HTMLDivElement>;
}

export function DashboardHeader({ selectedCampaign, onCampaignChange, dashboardRef }: DashboardHeaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Marketing's KPI</h1>
          <p className="text-muted-foreground mt-1">
            Key Performance Indicators (KPIs) are specific, measurable metrics that
            organizations use to track and evaluate their performance in various areas of their
            business
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <CampaignFilter
            selectedCampaign={selectedCampaign}
            onCampaignChange={onCampaignChange}
          />
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <ShareDialog contentRef={dashboardRef} pageTitle="Campaign Dashboard" />
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}