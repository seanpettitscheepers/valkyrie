import { PageLayout } from "@/components/Layout/PageLayout";
import { PlatformConnections } from "@/components/Connections/PlatformConnections";
import { FacebookAdsIntegration } from "@/components/Integrations/FacebookAdsIntegration";
import { FacebookPagesIntegration } from "@/components/Integrations/Facebook/FacebookPagesIntegration";
import { DV360Integration } from "@/components/Integrations/DV360/DV360Integration";
import { TikTokAdsIntegration } from "@/components/Integrations/TikTok/TikTokAdsIntegration";

export default function Connections() {
  return (
    <PageLayout title="Platform Connections">
      <div className="space-y-6">
        <FacebookAdsIntegration />
        <FacebookPagesIntegration />
        <DV360Integration />
        <TikTokAdsIntegration />
        <PlatformConnections />
      </div>
    </PageLayout>
  );
}