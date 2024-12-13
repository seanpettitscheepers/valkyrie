import { PageLayout } from "@/components/Layout/PageLayout";
import { PlatformConnections } from "@/components/Connections/PlatformConnections";
import { FacebookAdsIntegration } from "@/components/Integrations/FacebookAdsIntegration";
import { FacebookPagesIntegration } from "@/components/Integrations/Facebook/FacebookPagesIntegration";
import { DV360Integration } from "@/components/Integrations/DV360/DV360Integration";
import { TikTokAdsIntegration } from "@/components/Integrations/TikTok/TikTokAdsIntegration";
import { PinterestAdsIntegration } from "@/components/Integrations/Pinterest/PinterestAdsIntegration";
import { SnapchatAdsIntegration } from "@/components/Integrations/Snapchat/SnapchatAdsIntegration";

export default function Connections() {
  return (
    <PageLayout title="Platform Connections">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1">
          <FacebookAdsIntegration />
        </div>
        <div className="col-span-1">
          <FacebookPagesIntegration />
        </div>
        <div className="col-span-1">
          <DV360Integration />
        </div>
        <div className="col-span-1">
          <TikTokAdsIntegration />
        </div>
        <div className="col-span-1">
          <PinterestAdsIntegration />
        </div>
        <div className="col-span-1">
          <SnapchatAdsIntegration />
        </div>
      </div>
      <PlatformConnections />
    </PageLayout>
  );
}