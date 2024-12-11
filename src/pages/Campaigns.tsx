import { PageLayout } from "@/components/Layout/PageLayout";
import { CampaignDashboard } from "@/components/Campaigns/CampaignDashboard";

export default function Campaigns() {
  return (
    <PageLayout title="Campaign Dashboard">
      <CampaignDashboard />
    </PageLayout>
  );
}