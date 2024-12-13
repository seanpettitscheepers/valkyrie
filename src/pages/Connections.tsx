import { PageLayout } from "@/components/Layout/PageLayout";
import { PlatformConnections } from "@/components/Connections/PlatformConnections";
import { FacebookAdsIntegration } from "@/components/Integrations/FacebookAdsIntegration";

export default function Connections() {
  return (
    <PageLayout title="Platform Connections">
      <div className="space-y-6">
        <FacebookAdsIntegration />
        <PlatformConnections />
      </div>
    </PageLayout>
  );
}