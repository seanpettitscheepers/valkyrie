import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function MetricsExplanation() {
  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertDescription>
        <p className="mb-2">Key Performance Metrics Explained:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><span className="font-medium">Spend</span>: Total amount spent on campaigns</li>
          <li><span className="font-medium">CPM (Cost Per Mille)</span>: Cost per 1,000 impressions</li>
          <li><span className="font-medium">Engagements</span>: Total number of interactions</li>
          <li><span className="font-medium">Video Views</span>: Total number of video views</li>
          <li><span className="font-medium">CPV (Cost Per View)</span>: Average cost per video view</li>
          <li><span className="font-medium">CPC (Cost Per Click)</span>: Average cost per click</li>
          <li><span className="font-medium">Engagement Rate</span>: Percentage of impressions resulting in engagement</li>
          <li><span className="font-medium">VTR (View Through Rate)</span>: Percentage of impressions resulting in video views</li>
          <li><span className="font-medium">CPCV (Cost Per Completed View)</span>: Average cost per completed video view</li>
          <li><span className="font-medium">CTR (Click Through Rate)</span>: Percentage of impressions resulting in clicks</li>
          <li><span className="font-medium">CPE (Cost Per Engagement)</span>: Average cost per engagement</li>
          <li><span className="font-medium">CPA (Cost Per Acquisition)</span>: Average cost per conversion</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}