import { PageLayout } from "@/components/Layout/PageLayout";
import { CampaignDashboard } from "@/components/Campaigns/CampaignDashboard";
import { PageHeader } from "@/components/ui/page-header";

export default function Campaigns() {
  return (
    <PageLayout title="Campaigns">
      <div className="space-y-6">
        <PageHeader
          title="Your Campaign Command Center: Plan, Execute, and Conquer"
          description="Track your entire campaign arsenal in one place. Monitor ROI, measure impact, and ensure your strategy is always hitting the mark."
        />
        <CampaignDashboard />
      </div>
    </PageLayout>
  );
}